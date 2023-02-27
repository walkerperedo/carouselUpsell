// import Bugsnag from "@bugsnag/js"
import { Shopify } from "@shopify/shopify-api"
import { logger } from "../utils/logger.js"

export default async function redirectToAuth(req, res, app) {
	if (!req.query.shop) {
		logger.warn("[redirectToAuth] No query.shop param found", { reqPath: req.path, reqQuery: req.query })
		res.status(500)
		return res.send("No shop provided")
	}

	if (req.query.embedded === "1") {
		logger.debug("[redirectToAuth] Redirecting client side via /exitiframe", { reqPath: req.path, reqQuery: req.query })
		return clientSideRedirect(req, res)
	}
	
	logger.debug("[redirectToAuth] Redirecting server side", { reqPath: req.path, reqQuery: req.query })
	return await serverSideRedirect(req, res, app)
}

function clientSideRedirect(req, res) {
	try {
		const shop = Shopify.Utils.sanitizeShop(req.query.shop)
		const redirectUriParams = new URLSearchParams({
			shop,
			host: req.query.host,
		}).toString()
		const queryParams = new URLSearchParams({
			...req.query,
			shop,
			redirectUri: `https://${Shopify.Context.HOST_NAME}/api/auth?${redirectUriParams}`,
		}).toString()

		logger.debug("[clientSideRedirect] Redirecting to /exitiframe", { queryParams })
		return res.redirect(`/exitiframe?${queryParams}`)
	} catch (error) {
		logger.error("[clientSideRedirect] Catched error", { error })
		// Bugsnag.notify({ ...error }, (e) => e.addMetadata("metadata", { reqPath: req.path, reqQuery: req.query }))
		return res.status(500).send("Error redirecting to auth")
	}
}

async function serverSideRedirect(req, res, app) {
	try {
		const redirectUrl = await Shopify.Auth.beginAuth(
			req,
			res,
			req.query.shop,
			"/api/auth/callback",
			app.get("use-online-tokens")
		)
	
		logger.debug("[serverSideRedirect] Redirecting to", { redirectUrl })
		return res.redirect(redirectUrl)
	} catch (error) {
		logger.error("[serverSideRedirect] Catched error", { error })
		// Bugsnag.notify({ ...error }, (e) => e.addMetadata("metadata", { reqPath: req.path, reqQuery: req.query }))
		return res.status(500).send("Error redirecting to auth")
	}
}
