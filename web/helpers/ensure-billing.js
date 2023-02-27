// import Bugsnag from "@bugsnag/node"
import { Shopify } from "@shopify/shopify-api"
import * as dotenv from "dotenv"
import { logger } from "../utils/logger.js"
import { checkIfUserTrialed } from "./firestoreHelper.js"
dotenv.config()

export const BillingInterval = {
	OneTime: "ONE_TIME",
	Every30Days: "EVERY_30_DAYS",
	Annual: "ANNUAL",
}

const RECURRING_INTERVALS = [
	BillingInterval.Every30Days,
	BillingInterval.Annual,
]

export const isProd = process.env.LIVE === "true"

const isRecurring = (interval) => RECURRING_INTERVALS.includes(interval)

export function ShopifyBillingError(message, errorData) {
	this.name = "ShopifyBillingError"
	this.stack = new Error().stack

	this.message = message
	this.errorData = errorData
}
ShopifyBillingError.prototype = new Error()


export default async function ensureBilling(
	session,
	{ chargeName, amount, currencyCode, interval }
) {
	logger.info("[ensureBilling] Checking if subscribed", { shop: session.shop })
	if (!Object.values(BillingInterval).includes(interval)) {
		throw `Unrecognized billing interval '${interval}'`
	}

	let hasPayment
	let confirmationUrl = null

	if (await hasActivePayment(session, { chargeName, interval })) {
		hasPayment = true
	} else {
		hasPayment = false
		confirmationUrl = await requestPayment(session, {
			chargeName,
			amount,
			currencyCode,
			interval,
		})
	}

	return [hasPayment, confirmationUrl]
}

async function checkIfStaffAccount(session) { // Checks if the store is a store owned by Shopify Staff
	try {
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
		
		const shopPlanQuery = await client.query({
			data: SHOP_PLAN_QUERY
		})
	
		const shopPlan = shopPlanQuery?.body?.data?.shop?.plan || null

		if (shopPlan && (shopPlan.partnerDevelopment || shopPlan.displayName === "affiliate" || shopPlan.displayName === "staff")) {
			return { isStaffAccount: true, shopPlan }
		} else {
			return { isStaffAccount: false, shopPlan: null }
		}
	} catch (err) {
		logger.error("[checkIfStaffAccount] Catched error", { error: err })
		// Bugsnag.notify({ ...err }, (e) => e.addMetadata("shop", session.shop))
		return { isStaffAccount: false, shopPlan: null }
	}
}

async function hasActivePayment(session, { chargeName, interval }) {
	logger.debug("[hasActivePayment] checking for activePayment for session", { ...session, chargeName, interval })
	const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)

	if (isRecurring(interval)) {
		const currentInstallations = await client.query({
			data: RECURRING_PURCHASES_QUERY,
		}).catch(err => {
			logger.error("[hasActivePayment] Catched error", { error: err })
			// Bugsnag.notify({ ...err }, (e) => e.addMetadata("shop", session.shop))
		})

		const { isStaffAccount, shopPlan } = await checkIfStaffAccount(session)
		logger.debug("[hasActivePayment] isStaffAccount", { isStaffAccount, shopPlan })

		const subscriptions = currentInstallations?.body?.data?.currentAppInstallation?.activeSubscriptions || []
		logger.debug("[hasActivePayment] Subscriptions fetched", { numberOfSubscriptions: subscriptions.length, latestSubscription: subscriptions[0] })

		for (let i = 0, len = subscriptions.length; i < len; i++) {
			if (
				subscriptions[i]?.name === chargeName
				&& (subscriptions[i]?.test ? isStaffAccount || !isProd : true) // Ensure that if it is a test subscription that the account is a staff account or that we are in development
				&& subscriptions[i]?.status === "ACTIVE"
				// && subscriptions[i]?.currentPeriodEnd < new Date().toISOString()
			) {
				logger.debug("[hasActivePayment] Valid subscription", { validSubscription: subscriptions[i] })
				return true
			}
		}
	}
	
	logger.warn("[hasActivePayment] No valid subscription found", { })
	return false
}

async function requestPayment(session, { chargeName, amount, currencyCode, interval }) {
	const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
	const returnUrl = `https://${Shopify.Context.HOST_NAME}?shop=${session.shop}&host=${Buffer.from(`${session.shop}/admin`).toString("base64")}`

	let data
	if (isRecurring(interval)) {
		const mutationResponse = await requestRecurringPayment(client, returnUrl, session.shop, {
			chargeName,
			amount,
			currencyCode,
			interval
		})
		data = mutationResponse?.body?.data?.appSubscriptionCreate
	}

	if (data?.userErrors?.length) {
		throw new ShopifyBillingError("Error while billing the store", data.userErrors)
	}

	return data.confirmationUrl
}

async function requestRecurringPayment(client, returnUrl, shop, { chargeName, amount, currencyCode, interval }) {
	let { hasUserTrialed, trialDaysLeft } = await checkIfUserTrialed(shop, parseInt(process.env.TRIAL_DAYS))

	logger.debug("[requestRecurringPayment] Requesting payment", { shop, returnUrl, chargeName, interval, amount, currencyCode, hasUserTrialed, trialDaysLeft, test: !isProd })
	const mutationResponse = await client.query({
		data: {
			query: RECURRING_PURCHASE_MUTATION,
			variables: {
				name: chargeName,
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
		logger.error("[requestRecurringPayment] Catched error", { error: err })
		// Bugsnag.notify({ ...err }, (e) => e.addMetadata("metadata", { shop, returnUrl, chargeName, interval, amount, currencyCode, hasUserTrialed, trialDaysLeft, test: !isProd }))
	})

	if (mutationResponse?.body?.errors && mutationResponse.body.errors.length) {
		logger.error("[requestRecurringPayment] res.body.errors", { errors: mutationResponse.body.errors })
		// Bugsnag.notify({ name: "[requestRecurringPayment] res.body.errors" }, (e) => e.addMetadata("metadata", { shop, returnUrl, chargeName, interval, amount, currencyCode, hasUserTrialed, trialDaysLeft, test: !isProd, errors: mutationResponse.body.errors }))
		throw new ShopifyBillingError("Error while billing the store", mutationResponse.body.errors)
	}

	return mutationResponse
}


export const RECURRING_PURCHASES_QUERY = `
	query appSubscription {
		currentAppInstallation {
			activeSubscriptions {
				name
				test
				trialDays
				createdAt
				currentPeriodEnd
				id
				returnUrl
				status
			}
		}
	}
`

export const RECURRING_PURCHASE_MUTATION = `
	mutation test(
		$name: String!
		$lineItems: [AppSubscriptionLineItemInput!]!
		$returnUrl: URL!
		$test: Boolean
		$trialDays: Int!
	) {
		appSubscriptionCreate(
			name: $name
			lineItems: $lineItems
			returnUrl: $returnUrl
			test: $test
			trialDays: $trialDays
		) {
			confirmationUrl
			userErrors {
				field
				message
			}
		}
	}
`

const SHOP_PLAN_QUERY = `
	query shopPlan {
		shop {
			name
			plan {
				displayName
				partnerDevelopment
				shopifyPlus
			}
		}
	}
`
