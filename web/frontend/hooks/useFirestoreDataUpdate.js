import { useContext } from "react"
import { GlobalStateContext } from "../components/providers/GlobalStateProvider.jsx"
import { useAuthenticatedFetch } from "./useAuthenticatedFetch.js"

export const useFirestoreDataUpdate = () => {
	try {
		const authenticatedFetch = useAuthenticatedFetch()
		const { state, dispatch } = useContext(GlobalStateContext)
		const shop = new URLSearchParams(location.search).get("shop") || state.shop
	
		return async (fields) => {
			return await authenticatedFetch("/api/firestore/updateUserData", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					"shop": shop,
					"fields": fields
				})
			}).catch(err => console.error(err))
		}
	} catch (error) {
		console.error("[useFirestoreDataUpdate] catched error", error)
	}
}
