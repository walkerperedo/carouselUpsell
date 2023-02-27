// import Bugsnag from "@bugsnag/node"
import { Shopify } from "@shopify/shopify-api"
import * as dotenv from "dotenv"
import { logger } from "../utils/logger.js"
import { BillingInterval, isProd, RECURRING_PURCHASES_QUERY, RECURRING_PURCHASE_MUTATION, ShopifyBillingError } from "./ensure-billing.js"
import { checkIfUserTrialed } from "./firestoreHelper.js"
dotenv.config()

export async function checkSubscription({ shop, accessToken }) {
	const client = new Shopify.Clients.Graphql(shop, accessToken)

	const currentInstallations = await client.query({
		data: RECURRING_PURCHASES_QUERY,
	}).catch(err => {
		logger.error("[checkSubscription] Catched error", { error: err })
		// Bugsnag.notify({ ...err }, (e) => e.addMetadata("shop", session.shop))
	})

	const subscriptions = currentInstallations?.body?.data?.currentAppInstallation?.activeSubscriptions || []
	logger.debug("[checkSubscription] Subscriptions fetched", { numberOfSubscriptions: subscriptions.length, latestSubscription: subscriptions[0] })

	return {
		activePlan: subscriptions[0]?.name ?? null,
		isSubbed: subscriptions.length > 0
	}
}

async function cancelCurrentPlan({ shop, client }) {
	const currentInstallations = await client.query({
		data: RECURRING_PURCHASES_QUERY,
	}).catch(error => {
		logger.error("[cancelCurrentPlan] RECURRING_PURCHASES_QUERY Catched error", { error })
		// Bugsnag.notify({ ...err }, (e) => e.addMetadata("shop", session.shop))
	})

	const activeSubscriptionId = currentInstallations?.body?.data?.currentAppInstallation?.activeSubscriptions?.[0]?.id ?? null

	if (activeSubscriptionId) {
		const cancelSubscriptionResponse = await client.query({
			data: {
				query: CANCEL_SUBSCRIPTION_MUTATION,
				variables: {
					id: activeSubscriptionId
				}
			}
		}).catch(error => {
			logger.error("[cancelCurrentPlan] CANCEL_SUBSCRIPTION_MUTATION Catched error", { error })
		})
	
		if (cancelSubscriptionResponse?.body?.errors?.length) {
			logger.error("[cancelCurrentPlan] res.body.errors", { errors: cancelSubscriptionResponse.body.errors })
		}
	}
}

async function requestCharge({ shop, client, planName, returnUrl }) {
	const { hasUserTrialed, trialDaysLeft } = await checkIfUserTrialed(shop, parseInt(process.env.TRIAL_DAYS))
	const { interval, amount, currencyCode } = BILLING_PLANS[planName]

	logger.debug("[requestCharge] Requesting payment", { shop, returnUrl, planName, interval, amount, currencyCode, hasUserTrialed, trialDaysLeft, test: !isProd })

	const mutationResponse = await client.query({
		data: {
			query: RECURRING_PURCHASE_MUTATION,
			variables: {
				name: planName,
				lineItems: [
					{
						plan: {
							appRecurringPricingDetails: {
								interval,
								price: { amount, currencyCode }
							}
						}
					}
				],
				returnUrl,
				test: !isProd,
				trialDays: trialDaysLeft
			}
		}
	}).catch(err => {
		logger.error("[requestCharge] Catched error", { error: err })
		// Bugsnag.notify({ ...err }, (e) => e.addMetadata("metadata", { shop, returnUrl, chargeName, interval, amount, currencyCode, hasUserTrialed, trialDaysLeft, test: !isProd }))
	})

	if (mutationResponse?.body?.errors && mutationResponse.body.errors.length) {
		logger.error("[requestCharge] res.body.errors", { errors: mutationResponse.body.errors })
		// Bugsnag.notify({ name: "[changeBillingPlan] res.body.errors" }, (e) => e.addMetadata("metadata", { shop, returnUrl, chargeName, interval, amount, currencyCode, hasUserTrialed, trialDaysLeft, test: !isProd, errors: mutationResponse.body.errors }))
		throw new ShopifyBillingError("Error while billing the store", mutationResponse.body.errors)
	}

	return mutationResponse?.body?.data?.appSubscriptionCreate?.confirmationUrl || returnUrl
}

export async function changeBillingPlan({ shop, accessToken, planName, returnPath }) {
	let urlToReturn = null

	const client = new Shopify.Clients.Graphql(shop, accessToken)
	const returnUrl = `https://${Shopify.Context.HOST_NAME}${returnPath}?shop=${shop}&host=${Buffer.from(`${shop}/admin`).toString("base64")}`
	
	if (BILLING_PLANS[planName].free) {
		await cancelCurrentPlan({ shop, client })
		return returnUrl
	} else {
		return await requestCharge({ shop, client, planName, returnUrl })
	}
}


const BILLING_PLANS = {
	"Free": {
		chargeName: "Free",
		free: true
	},
	"Unlimited": {
		chargeName: "Unlimited",
		free: false,
		interval: BillingInterval.Every30Days,
		amount: 9.99,
		currencyCode: "USD"
	}
}

const CANCEL_SUBSCRIPTION_MUTATION = `
	mutation AppSubscriptionCancel($id: ID!) {
		appSubscriptionCancel(id: $id) {
			userErrors {
				field
				message
			}
			appSubscription {
				id
				status
			}
		}
	}
`