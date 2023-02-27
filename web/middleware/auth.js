import { Shopify } from "@shopify/shopify-api"
import { gdprTopics } from "@shopify/shopify-api/dist/webhooks/registry.js"

import ensureBilling from "../helpers/ensure-billing.js"
import redirectToAuth from "../helpers/redirect-to-auth.js"
import { setStoreData } from "../helpers/firestoreHelper.js"
import { logger } from "../utils/logger.js"
// import Bugsnag from "@bugsnag/js"

export default function applyAuthMiddleware(app, { billing = { required: false } } = { billing: { required: false } }) {
	app.get("/api/auth", async (req, res) => {
		logger.info("/api/auth", { reqQuery: req.query })
		return redirectToAuth(req, res, app)
	})

	app.get("/api/auth/callback", async (req, res) => {
		logger.info("/api/auth/callback", { reqQuery: req.query })
		try {
			logger.info("/api/auth/callback Validating auth callback")
			const session = await Shopify.Auth.validateAuthCallback(req, res, req.query)

			logger.info("/api/auth/callback Registering webhooks", { shop: session.shop })
			const responses = await Shopify.Webhooks.Registry.registerAll({
				shop: session.shop,
				accessToken: session.accessToken,
			})

			if (session.shop && session.accessToken) {
				await setStoreData(session.shop, { accessToken: session.accessToken })
			}

			Object.entries(responses).map(([topic, response]) => {
				// The response from registerAll will include errors for the GDPR topics.  These can be safely ignored.
				// To register the GDPR topics, please set the appropriate webhook endpoint in the
				// 'GDPR mandatory webhooks' section of 'App setup' in the Partners Dashboard.
				if (!response.success && !gdprTopics.includes(topic)) {
					logger.warn(`Failed to register ${topic} webhook: ${response.result.errors[0].message}`)
				}
			})

			logger.info("/api/auth/callback Checking if subscribed")
			// If billing is required, check if the store needs to be charged right away to minimize the number of redirects.
			if (billing.required) {
				const [hasPayment, confirmationUrl] = await ensureBilling(session, billing)

				if (!hasPayment) {
					return res.redirect(confirmationUrl)
				}
			}
			
			logger.info("/api/auth/callback Sanitizing host and redirecting")
			const host = Shopify.Utils.sanitizeHost(req.query.host)
			logger.debug("/api/auth/callback Sanitized host", { host })
			const redirectUrl = Shopify.Context.IS_EMBEDDED_APP ? Shopify.Utils.getEmbeddedAppUrl(req) : `/?shop=${session.shop}&host=${encodeURIComponent(host)}`
			
			logger.debug("/api/auth/callback Redirecting to", { redirectUrl })
			res.redirect(redirectUrl)
		} catch (e) {
			logger.warn("/api/auth/callback Catched error", { error: e })
			// Bugsnag.notify({ ...e }, (e) => e.addMetadata("metadata", { reqQuery: req.query }))
			switch (true) {
				case e instanceof Shopify.Errors.InvalidOAuthError:
					logger.info("/api/auth/callback Sending back 400")
					res.status(400)
					res.send(e.message)
					break
				case e instanceof Shopify.Errors.CookieNotFound:
				case e instanceof Shopify.Errors.SessionNotFound:
					// This is likely because the OAuth session cookie expired before the merchant approved the request
					logger.info("/api/auth/callback Redirecting to Auth (Likely OAuth session cookie expired before the merchant approved the request)")
					return redirectToAuth(req, res, app)
				default:
					logger.info("/api/auth/callback Sending back 500")
					res.status(500)
					res.send(e.message)
					break
			}
		}
	})
}
