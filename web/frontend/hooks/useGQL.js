// import Bugsnag from "@bugsnag/js"
import { useAuthenticatedFetch } from "./useAuthenticatedFetch.js"

export const useGQL = () => {
	const authenticatedFetch = useAuthenticatedFetch()
		
	return async (query, variables) => {
		return await authenticatedFetch("/api/graphql", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				query,
				variables
			})
		})
			.then(res => res.json())
			.then(json => {
				if (json?.errors) {
					console.error("useGQL json.errors", json.errors)
					return { data: null, errors: json.errors }
				} else if (json?.body?.data) {
					const operationName = Object.keys(json.body.data)[0] || ""
					if (operationName && json.body.data[operationName]?.userErrors?.length) {
						return { data: null, errors: json.body.data[operationName].userErrors }
					} else {
						return { data: json.body.data, errors: null }
					}
				} else {
					return { data: null, errors: [{ message: "Unspecified error 2" }] }
				}
			})
			.catch(err => {
				console.error("useGQL catched error", err)
				// Bugsnag.notify({ name: "useGQL catched error", message: JSON.stringify(err.message) })
				return { data: null, errors: [{ message: err.message }] }
			})
	}
}
