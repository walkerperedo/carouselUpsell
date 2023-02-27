import admin from "firebase-admin"
import * as dotenv from "dotenv"
import { logger } from "../utils/logger.js"
// import Bugsnag from "@bugsnag/js"
dotenv.config()

admin.initializeApp({
	credential: admin.credential.cert({
		"project_id": process.env.FIREBASE_PROJECT_ID,
		"private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
		"client_email": process.env.FIREBASE_CLIENT_EMAIL
	}),
	databaseURL: process.env.FIREBASE_DB_URL
})

export default admin

const db = admin.firestore()

export const setStoreData = async (store, data) => {
	logger.debug("[setStoreData]", { store, data })
	return await db.collection("stores").doc(store).set(data, { merge: true })
		.catch((err) => {
			logger.error("[setStoreData] Catched error", { error: err })
			// Bugsnag.notify({ ...err }, (e) => e.addMetadata("metadata", { store, data }))
			return { error: err }
		})
}

export const getStoreData = async (store, allFields = false) => {
	return await db.collection("stores").doc(store).get()
		.then((doc) => {
			if (allFields) {
				return doc.data()
			} else {
				return {
					hasTutorialDismissed: doc?.data()?.hasTutorialDismissed ?? null,
					hasCompletedInitialSetup: doc?.data()?.hasCompletedInitialSetup ?? null,
					preferredUpsellPositioning: doc?.data()?.preferredUpsellPositioning ?? null
				}
			}
		})
		.catch((err) => {
			logger.error("[getStoreData] Catched error", { error: err })
			// Bugsnag.notify({ ...err }, (e) => e.addMetadata("metadata", { store }))
			return { error: err }
		})
}

export const checkIfUserTrialed = async (store, trialDays) => {
	const daysBetween = (startDate, endDate) => {
		const treatAsUTC = (date) => {
			const result = new Date(date)
			result.setMinutes(result.getMinutes() - result.getTimezoneOffset())
			return result
		}
		const millisecondsPerDay = 24 * 60 * 60 * 1000
		return parseInt((treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay)
	}

	try {
		let storeData = await getStoreData(store, true)
		const hasTrialed = storeData?.hasTrialed || false
		const startedTrialDate = storeData?.startedTrialDate?.toDate() || null
		logger.debug("[checkIfUserTrialed] hasUserTrialed", { store, hasTrialed, startedTrialDate })
		
		if (storeData.error) {
			logger.error("[checkIfUserTrialed] hasUserTrialed error", store, storeData.error)
			// Bugsnag.notify({ ...storeData.error }, (e) => e.addMetadata("metadata", { store }))
		}
		
		if (hasTrialed && hasTrialed === true) {
			return { hasUserTrialed: true, trialDaysLeft: Math.max(0, trialDays - daysBetween(startedTrialDate, new Date())) }
		} else {
			return { hasUserTrialed: false, trialDaysLeft: trialDays }
		}
	} catch (err) {
		logger.error("[checkIfUserTrialed] Catched error", err)
		// Bugsnag.notify({ name: "[checkIfUserTrialed] catched error", message: err.message, stack: err.stack }, (e) => e.setUser(store))
		return { hasTrialed: false, trialDaysLeft: trialDays }
	}
}
