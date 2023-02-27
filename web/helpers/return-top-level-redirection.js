import { logger } from "../utils/logger.js"

export default function returnTopLevelRedirection(req, res, redirectUrl) {
	const bearerPresent = req.headers.authorization?.match(/Bearer (.*)/)

	// If the request has a bearer token, the app is currently embedded, and must break out of the iframe to
	// re-authenticate
	if (bearerPresent) {
		logger.debug("[returnTopLevelRedirection] Redirecting with X-Shopify-API-Request-Failure-Reauthorize headers", { redirectUrl })
		res.status(403)
		res.header("X-Shopify-API-Request-Failure-Reauthorize", "1")
		res.header("X-Shopify-API-Request-Failure-Reauthorize-Url", redirectUrl)
		res.end()
	} else {
		logger.debug("[returnTopLevelRedirection] Redirecting", { redirectUrl })
		res.redirect(redirectUrl)
	}
}
