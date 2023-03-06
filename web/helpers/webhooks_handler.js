import { AppInstallations } from "./app_installations.js"
import { checkIfUserTrialed, setStoreData } from "./firestoreHelper.js"
import { updateShownForByAssociatedCollectionIds, updateUpsellStats } from "./carouselHelper.js"
import * as dotenv from "dotenv"
import { logger } from "../utils/logger.js"
import { Shopify } from "@shopify/shopify-api"
dotenv.config()

export const ensureValidWebhookSubscriptions = async (store) => {
	try {
		const hostname = Shopify.Context.HOST_NAME
		const sessions = await Shopify.Context.SESSION_STORAGE.findSessionsByShop(store)

		if (!sessions?.[0]?.accessToken) {
			logger.warn("[ensureValidWebhookSubscriptions] No accessToken found", { sessions, store })
			return
		}

		const responses = await Shopify.Webhooks.Registry.registerAll({
			shop: sessions[0].shop,
			accessToken: sessions[0].accessToken,
		})

		return responses
	} catch (error) {
		logger.error("[ensureValidWebhookSubscriptions] Catched error", { error })
	}
}

export const appUninstalledHandler = async (_topic, shop, _body) => {
	logger.info("/api/webhooks - APP_UNINSTALLED - Deleting for", { shop, body: _body })

	await AppInstallations.delete(shop)

	setStoreData(shop, { status: "UNINSTALLED" })
}

export const appSubscriptionsUpdateHandler = async (_topic, shop, _body) => {
	logger.info("/api/webhooks - APP_SUBSCRIPTIONS_UPDATE - ", { shop, body: _body })

	let { hasUserTrialed, trialDaysLeft } = await checkIfUserTrialed(shop, parseInt(process.env.TRIAL_DAYS))
	let appSubscriptionInfo = {}

	if (typeof _body === "string") {
		const parsedBody = JSON.parse(_body)
		if (parsedBody.app_subscription) {
			appSubscriptionInfo = parsedBody.app_subscription
		}
	} else if (_body.app_subscription) {
		appSubscriptionInfo = _body.app_subscription
	}
	logger.debug("/api/webhooks Test body", { appSubscriptionInfo })
	setStoreData(shop, {
		appSubscription: appSubscriptionInfo,
		hasTrialed: true,
		...(hasUserTrialed === false && { startedTrialDate: new Date() }),
	})
}

export const collectionsUpdateHandler = async (_topic, shop, _body) => {
	logger.info("/api/webhooks - COLLECTIONS_UPDATE - ", { shop, body: _body })

	try {
		const parsedBody = JSON.parse(_body)

		if (parsedBody?.id) {
			updateShownForByAssociatedCollectionIds(shop, `${parsedBody.id}`)
		}
	} catch (error) {
		logger.error("/api/webhooks collectionsUpdateHandler catched error", { error })
	}
}

export const ordersCreateHandler = async (_topic, shop, _body) => {
	logger.info("/api/webhooks - ORDERS_CREATE - ", { shop, body: _body })

	try {
		const parsedBody = JSON.parse(_body)

		// No line_items field present is a possibility due to API 2022-10 and greater requiring protected customer data access
		parsedBody?.line_items?.map((lineItem) => {
			if (lineItem.properties) {
				const upsellId = lineItem.properties.find((property) => property.name == "_justUpsell")?.value || ""

				if (upsellId) {
					const priceSetPrice = parseFloat(lineItem.price_set?.shop_money?.amount || "") || 0
					const defaultPrice = parseFloat(lineItem.price || "") || 0
					const lineItemPrice = priceSetPrice || defaultPrice

					updateUpsellStats(upsellId, "conversions", 1)
					updateUpsellStats(upsellId, "revenue", lineItemPrice * lineItem.quantity)
				}
			}
		})
	} catch (error) {
		logger.error("/api/webhooks - ordersCreateHandler catched error", { error })
	}
}
