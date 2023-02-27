// import Bugsnag from "@bugsnag/js"
import { Shopify } from "@shopify/shopify-api"
import { logger } from "../utils/logger.js"

export const graphqlProxy = async (shop, accessToken, query, variables = {}) => {
	const client = new Shopify.Clients.Graphql(shop, accessToken)
	return await client.query({
		data: {
			query,
			variables
		}
	})
		.catch(err => {
			if (err.response) {
				logger.warn("[graphqlProxy] Catched query response errors", err.response)
				return err.response
			} else {
				logger.error("[graphqlProxy] Catched error", { error: err })
				// Bugsnag.notify({ ...err }, (e) => e.addMetadata("metadata", { shop, accessToken, query, variables }))
				return { errors: [{ message: "Unspecified error 1" }] }
			}
		})
}
