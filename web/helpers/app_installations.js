// import Bugsnag from "@bugsnag/js"
import { Shopify } from "@shopify/shopify-api"
import { logger } from "../utils/logger.js"

const APP_IS_INSTALLED_QUERY = `
	{
		currentAppInstallation {
			id
		}
	}
`

export const AppInstallations = {
	includes: async function (shopDomain, checkWithGraphQLQuery) {
		logger.info("[AppInstallations] Searching for sessions in DB for shop", { shopDomain, checkWithGraphQLQuery })
		const shopSessions = await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shopDomain)

		if (shopSessions.length > 0) {
			for (const session of shopSessions) {
				if (session.accessToken) {
					if (checkWithGraphQLQuery) {
						const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
						const res = await client.query({ data: APP_IS_INSTALLED_QUERY })
							.catch(err => {
								logger.error("[AppInstallations] Catched error querying GQL", { error: err })
								// Bugsnag.notify({ ...err }, (e) => e.addMetadata("shop", { shopDomain }))
							})
						
						if (res?.body?.data?.currentAppInstallation?.id?.length > 0) {
							return true
						} else {
							logger.warn("[AppInstallations] Session with accessToken but app not installed according to Shopify")
							return false
						}
					} else {
						return true
					}
				} else {
					logger.warn("[AppInstallations] Session does not have an accessToken", { ...session })
					return false
				}
			}
		} else {
			logger.info("[AppInstallations] No session found")
			return false
		}
	},

	delete: async function (shopDomain) {
		logger.info("[AppInstallations] Deleting session for shop", shopDomain)
		const shopSessions = await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shopDomain)
		if (shopSessions.length > 0) {
			await Shopify.Context.SESSION_STORAGE.deleteSessions(shopSessions.map((session) => session.id))
		} else {
			logger.warn("[AppInstallations] No sessions found to be deleted")
		}
	},
}
