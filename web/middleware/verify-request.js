// import Bugsnag from "@bugsnag/js"
import { Shopify } from "@shopify/shopify-api"
import ensureBilling, { ShopifyBillingError } from "../helpers/ensure-billing.js"
import redirectToAuth from "../helpers/redirect-to-auth.js"

import returnTopLevelRedirection from "../helpers/return-top-level-redirection.js"
import { logger } from "../utils/logger.js"

const TEST_GRAPHQL_QUERY = `{
	shop {
		name
	}
}`

// Loads JWT session token from request and checks if user is subbed and access token is valid
export default function verifyRequest(app, { billing = { required: false } } = { billing: { required: false } } ) {
	return async (req, res, next) => {
		logger.info(`[verifyRequest] Verifying request for ${req.originalUrl}`)

		let session = null
		try {
			session = await Shopify.Utils.loadCurrentSession(
				req,
				res,
				app.get("use-online-tokens")
			)
		} catch (error) {
			logger.error("[verifyRequest] Catched error trying to load session", { error })
			// Bugsnag.notify({ ...error }, (e) => e.addMetadata("metadata", { reqPath: req.path, reqQuery: req.query }))
			return res.status(500).send("Error trying to load session")
		}
		logger.debug("[verifyRequest] Session loaded:", { session })
		
		let shop = Shopify.Utils.sanitizeShop(req.query.shop)

		if (session && shop && session.shop !== shop) {
			logger.warn("[verifyRequest] Shop invalid, redirecting to Auth", { shop })
			// The current request is for a different shop. Redirect gracefully.
			return redirectToAuth(req, res, app)
		}

		logger.debug("[verifyRequest] Session isActive?", session?.isActive() || false)
		if (session?.isActive()) {
			try {
				if (billing.required) {
					// Dont check billing on /api since as it is unnecessary, except for /api/checkSubscription
					if (req.originalUrl.startsWith("/api") && !req.originalUrl.includes("/api/checkSubscription")) return next()
					
					// The request to check billing status serves to validate that the access token is still valid.
					logger.info("[verifyRequest] Checking for subscription")
					const [hasPayment, confirmationUrl] = await ensureBilling(session, billing)

					if (!hasPayment) {
						logger.info(`[verifyRequest] ${shop} is not subscribed, returning top level redirection`)
						returnTopLevelRedirection(req, res, confirmationUrl)
						return
					} else {
						logger.info(`[verifyRequest] ${shop} is subscribed`)
						return next()
					}
				} else {
					// Make a request to ensure the access token is valid. Otherwise an exception will be thrown and later redirected to re-authenticate the user.
					logger.info("[verifyRequest] Checking if token is valid with GQL test query")
					const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
					const gqlTestQueryRes = await client.query({ data: TEST_GRAPHQL_QUERY })
					if (gqlTestQueryRes?.body?.data?.shop?.name) {
						return next()
					}
				}
			} catch (e) {
				if (e instanceof Shopify.Errors.HttpResponseError && e.response.code === 401) {
					// Re-authenticate if we get a 401 response
					logger.warn("[verifyRequest] Catched 401 unauthorized error, redirecting to Auth", { shop, error: e })
					returnTopLevelRedirection(req, res, `/api/auth?shop=${encodeURIComponent(shop)}`)
					// return redirectToAuth(req, res, app);
					return
				} else if (e instanceof ShopifyBillingError) {
					logger.error("[verifyRequest] Catched ShopifyBilling error", { message: e.message, errordata: e.errorData[0] })
					// Bugsnag.notify({ ...e }, (e) => e.addMetadata("metadata", { reqPath: req.path, reqQuery: req.query }))
					res.status(500).end()
					return
				} else {
					logger.error("[verifyRequest] Catched error", { ...e })
					// Bugsnag.notify({ ...e }, (e) => e.addMetadata("metadata", { reqPath: req.path, reqQuery: req.query }))
					throw e
				}
			}
		}

		// Check JWT session token to obtain shop parameter if not obtained already
		const bearerPresent = req.headers.authorization?.match(/Bearer (.*)/)
		if (bearerPresent && !shop) {
			logger.debug("[verifyRequest] Attempting to extract shop from Bearer token found")
			if (session) {
				shop = session.shop
			} else if (Shopify.Context.IS_EMBEDDED_APP) {
				const payload = Shopify.Utils.decodeSessionToken(bearerPresent[1])
				shop = payload.dest.replace("https://", "")
			}
		}

		if (!shop) {
			logger.warn("[verifyRequest] Request didn't pass verification and missing shop parameter for auth redirection")
			return res.status(500).send("Missing shop parameter")
		}
		logger.info("[verifyRequest] Request didn't pass verification, returning top level redirection to auth", { shop })
		returnTopLevelRedirection(req, res, `/api/auth?shop=${encodeURIComponent(shop)}`)
	}
}
