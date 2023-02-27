import { Shopify } from "@shopify/shopify-api"
import { logger } from "../utils/logger.js"

export function setupGDPRWebHooks(path) {
	/**
	 * Customers can request their data from a store owner. When this happens,
	 * Shopify invokes this webhook.
	 *
	 * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
	 */
	Shopify.Webhooks.Registry.addHandler("CUSTOMERS_DATA_REQUEST", {
		path,
		webhookHandler: async (topic, shop, body) => {
			const payload = JSON.parse(body)
			logger.debug("/api/webhooks - CUSTOMERS_DATA_REQUEST - payload", { payload })
			// Payload has the following shape:
			// {
			//   "shop_id": 954889,
			//   "shop_domain": "{shop}.myshopify.com",
			//   "orders_requested": [
			//     299938,
			//     280263,
			//     220458
			//   ],
			//   "customer": {
			//     "id": 191167,
			//     "email": "john@example.com",
			//     "phone": "555-625-1199"
			//   },
			//   "data_request": {
			//     "id": 9999
			//   }
			// }
		},
	})

	/**
	 * Store owners can request that data is deleted on behalf of a customer. When
	 * this happens, Shopify invokes this webhook.
	 *
	 * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-redact
	 */
	Shopify.Webhooks.Registry.addHandler("CUSTOMERS_REDACT", {
		path,
		webhookHandler: async (topic, shop, body) => {
			const payload = JSON.parse(body)
			logger.debug("/api/webhooks - CUSTOMERS_REDACT - payload", { payload })
			// Payload has the following shape:
			// {
			//   "shop_id": 954889,
			//   "shop_domain": "{shop}.myshopify.com",
			//   "customer": {
			//     "id": 191167,
			//     "email": "john@example.com",
			//     "phone": "555-625-1199"
			//   },
			//   "orders_to_redact": [
			//     299938,
			//     280263,
			//     220458
			//   ]
			// }
		},
	})

	/**
	 * 48 hours after a store owner uninstalls your app, Shopify invokes this
	 * webhook.
	 *
	 * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#shop-redact
	 */
	Shopify.Webhooks.Registry.addHandler("SHOP_REDACT", {
		path,
		webhookHandler: async (topic, shop, body) => {
			const payload = JSON.parse(body)
			logger.debug("/api/webhooks - SHOP_REDACT - payload", { payload })
			// Payload has the following shape:
			// {
			//   "shop_id": 954889,
			//   "shop_domain": "{shop}.myshopify.com"
			// }
		},
	})
}
