// @ts-check
import { ApiVersion, LATEST_API_VERSION, Shopify } from "@shopify/shopify-api"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import { readFileSync } from "fs"
import { join } from "path"
import { AppInstallations } from "./helpers/app_installations.js"
import { graphqlProxy } from "./helpers/graphql.js"
import redirectToAuth from "./helpers/redirect-to-auth.js"
import { setupGDPRWebHooks } from "./helpers/setup_gdpr.js"
import { appSubscriptionsUpdateHandler, appUninstalledHandler, ordersCreateHandler, collectionsUpdateHandler, ensureValidWebhookSubscriptions } from "./helpers/webhooks_handler.js"
import applyAuthMiddleware from "./middleware/auth.js"
import verifyRequest from "./middleware/verify-request.js"
import applyThemeSupportRoutes from "./routes/themeSupportRoutes.js"
import applyUpsellRoutes from "./routes/upsellRoutes.js"
import applyFirestoreRoutes from "./routes/firestore.js"
import { logger } from "./utils/logger.js"
import { BillingInterval } from "./helpers/ensure-billing.js"
import { changeBillingPlan, checkSubscription } from "./helpers/billing.js"

const USE_ONLINE_TOKENS = false
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10)
const DEV_INDEX_PATH = `${process.cwd()}/frontend/`
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`
const DB_PATH = `${process.cwd()}/database.sqlite`

Shopify.Context.initialize({
	API_KEY: process.env.SHOPIFY_API_KEY,
	API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
	SCOPES: process.env.SCOPES.split(","),
	HOST_NAME: process.env.HOST.replace(/https?:\/\//, ""),
	HOST_SCHEME: process.env.HOST.split("://")[0],
	API_VERSION: ApiVersion.July22,
	IS_EMBEDDED_APP: true,
	SESSION_STORAGE: new Shopify.Session.SQLiteSessionStorage(DB_PATH)
})

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", { path: "/api/webhooks", webhookHandler: appUninstalledHandler })
Shopify.Webhooks.Registry.addHandler("APP_SUBSCRIPTIONS_UPDATE", { path: "/api/webhooks", webhookHandler: appSubscriptionsUpdateHandler })
Shopify.Webhooks.Registry.addHandler("COLLECTIONS_UPDATE", { path: "/api/webhooks", webhookHandler: collectionsUpdateHandler })
Shopify.Webhooks.Registry.addHandler("ORDERS_CREATE", { path: "/api/webhooks", webhookHandler: ordersCreateHandler })

const BILLING_SETTINGS = {
	required: false,
	chargeName: "Unlimited",
	amount: 0,
	currencyCode: "USD",
	interval: BillingInterval.Every30Days,
}

setupGDPRWebHooks("/api/webhooks")

// export for test use only
export async function createServer(
	root = process.cwd(),
	isProd = process.env.NODE_ENV === "production",
	billingSettings = BILLING_SETTINGS
) {
	const app = express()

	app.set("use-online-tokens", USE_ONLINE_TOKENS)
	app.use(cookieParser(Shopify.Context.API_SECRET_KEY))

	applyAuthMiddleware(app, { billing: billingSettings })
	
	app.post("/api/webhooks", async (req, res) => {
		try {
			await Shopify.Webhooks.Registry.process(req, res)
			logger.info(`${req.originalUrl} Webhook processed, returned status code 200`)
		} catch (e) {
			logger.warn(`${req.originalUrl} Failed to process webhook`, { error: e })
			if (!res.headersSent) {
				res.status(500).send(e.message)
			}
		}
	})

	app.use("/api/*", cors())

	app.use("/api/upsells", express.json(), applyUpsellRoutes)
	
	app.get("/api/checkSubscription", async (req, res) => {
		const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"))

		if (!session) {
			return res.status(500).send()
		}

		const { isSubbed, activePlan } = await checkSubscription(session)

		return res.send({ isSubbed, activePlan, subbingRequired: BILLING_SETTINGS.required })
	})

	app.post("/api/changeBillingPlan", express.json(), async (req, res) => {
		const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"))

		if (!session) {
			return res.status(500).send()
		}

		const redirectionUrl = await changeBillingPlan({
			shop: session.shop,
			accessToken: session.accessToken,
			planName: req.body.planName,
			returnPath: req.body.returnPath
		})

		return res.send({ redirectionUrl })
	})

	app.use("/api/*", verifyRequest(app, { billing: billingSettings }))

	app.post("/api/graphql", express.json(), async (req, res) => {
		logger.info("/api/graphql", { query: req.query })

		if (!req.body) {
			logger.warn("/api/graphql No query parameter found in request body", { body: req.body })
			return res.status(500).send("No query parameter found in request body")
		}
		
		const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"))
		const shop = session?.shop || req.query.shop
		let status = 200
		let result = null

		try {
			result = await graphqlProxy(shop, session?.accessToken, req.body.query, req.body.variables)
		} catch (e) {
			logger.error("/api/graphql Catched error", { ...e })
			status = 500
			result = { errors: [{ message: e.message }] }
		}

		res.status(status).send(result)
	})

	app.use(express.json())
	
	applyThemeSupportRoutes(app)
	app.use("/api/firestore", applyFirestoreRoutes)

	app.use("/api/*", async (req, res) => {
		logger.warn(`${req.originalUrl} ${req.method} 404 Route Not Found`)
		res.status(404).send()
	})

	// CSP header requirement for embedded apps
	app.use((req, res, next) => {
		const shop = Shopify.Utils.sanitizeShop(req.query.shop)
		if (Shopify.Context.IS_EMBEDDED_APP && shop) {
			res.setHeader("Content-Security-Policy", `frame-ancestors https://${encodeURIComponent(shop)} https://admin.shopify.com;`)
		} else if (Shopify.Context.IS_EMBEDDED_APP && !shop) {
			res.setHeader("Content-Security-Policy", "frame-ancestors https://admin.shopify.com;")
		} else {
			res.setHeader("Content-Security-Policy", "frame-ancestors 'none';")
		}
		next()
	})

	// File Compression and serve static files
	if (isProd) {
		const compression = await import("compression").then(({ default: fn }) => fn)
		const serveStatic = await import("serve-static").then(({ default: fn }) => fn)
		app.use(compression())
		app.use(serveStatic(PROD_INDEX_PATH, { index: false }))
	}

	app.get("/justUpsellScript.js", (req, res) => {
		const jsFile = join(`${process.cwd()}/frontend/`, "justUpsellScript.js")
		return res.status(200).set("Content-Type", "text/javascript").send(readFileSync(jsFile))
	})

	app.get("/checkbox.css", (req, res) => {
		const cssFile = join(`${process.cwd()}/frontend/`, "checkbox.css")
		return res.status(200).set("Content-Type", "text/css").send(readFileSync(cssFile))
	})

	app.use("/*", async (req, res, next) => {

		if (typeof req.query.shop !== "string") {
			logger.warn("/* No shop parameter found", { reqQuery: req.query })
			return res.status(500).send("No shop provided. Try opening the app from the apps section of your store.")
		}
		
		let shop = req.query.shop
		
		try {
			shop = Shopify.Utils.sanitizeShop(req.query.shop)
		} catch (error) {
			logger.error("/* - Error sanitizing shop", { error: error, shop })
			return res.status(500).send("Error processing shop parameter. Try opening the app from the apps section of your store.")
		}
		logger.info("/* Verifying if session is in database", { shop, reqUrl: req.originalUrl })
		const sessionInDb = await AppInstallations.includes(shop, true)
		logger.debug("/* Session found?", { shop, sessionFound: sessionInDb })

		// If session is not found in database, redirect to auth
		if (!sessionInDb && !req.originalUrl.match(/^\/exitiframe/i)) {
			logger.warn("/* Session not found in DB, redirecting to auth", { shop })
			return redirectToAuth(req, res, app)
		}

		// host parameter is required for Shopify.Utils.getEmbeddedAppUrl()
		if (typeof req.query.host !== "string") { 
			logger.warn("/* No host parameter provided", { reqQuery: req.query })
			return res.status(500).send("No host provided. Try opening the app from the apps section of your store.")
		}

		// Redirect to embedded URL (https://<store>.myshopify.com/admin/apps/<app_id>/<route>)
		if (Shopify.Context.IS_EMBEDDED_APP && req.query.embedded !== "1") {
			logger.info("/* Redirecting to embedded App URL since request comes outside of iframe")
			const embeddedUrl = Shopify.Utils.getEmbeddedAppUrl(req)
			logger.debug("/* Redirecting", { embeddedUrl: embeddedUrl + req.path })
			return res.redirect(embeddedUrl + req.path)
		}

		// Ensure webhook subscriptions are valid and have updated url
		if (req.path === "/") {
			logger.info("/ - Ensuring valid WebhookSubscriptions")
			await ensureValidWebhookSubscriptions(shop)
		}

		// Client-side routing will picku up on the correct route to render, so we always render the index here
		logger.info(`/* Returning front-end stuff for ${req.path}`)
		const htmlFile = join(isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH, "index.html")
		return res.status(200).set("Content-Type", "text/html").send(readFileSync(htmlFile))
	})

	return { app }
}

createServer().then(({ app }) => app.listen(PORT, () => {
	logger.info(`Running on ${PORT}`)
}))
