// import Bugsnag from "@bugsnag/js"
import { useAuthenticatedFetch } from "./useAuthenticatedFetch.js"

export const useCheckSubscription = () => {
	const authenticatedFetch = useAuthenticatedFetch()

	return async () => {
		return await authenticatedFetch("/api/checkSubscription")
			.then(res => res.json())
			.then(json => json)
			.catch(err => {
				console.error("useCheckSubscription catched error", err)
				// Bugsnag.notify({ name: "useCheckSubscription catched error", message: JSON.stringify(err.message) })
				return false
			})
	}
}
