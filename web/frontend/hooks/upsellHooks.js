import { useAuthenticatedFetch } from "./useAuthenticatedFetch.js"

export const useCreateUpsell = () => {
	const authenticatedFetch = useAuthenticatedFetch()

	return async (upsell) => {
		return await authenticatedFetch("/api/upsells/createUpsell", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ upsell }),
		}).then(res => res.json())
	}
}

export const useDeleteUpsell = () => {
	const authenticatedFetch = useAuthenticatedFetch()

	return async (upsellId) => {
		return await authenticatedFetch("/api/upsells/deleteUpsell", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ upsellId })
		}).then(res => res.json())
	}
}

export const useUpdateUpsell = () => {
	const authenticatedFetch = useAuthenticatedFetch()

	return async (upsellId, data) => {
		return await authenticatedFetch("/api/upsells/updateUpsell", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ upsellId, data })
		}).then(res => res.json())
	}
}

export const useGetAllStoreUpsells = () => {
	const authenticatedFetch = useAuthenticatedFetch()

	return async () => {
		return await authenticatedFetch("/api/upsells/getAllStoreUpsells").then(res => res.json())
	}
}

export const useGetUpsellById = () => {
	const authenticatedFetch = useAuthenticatedFetch()

	return async (upsellId) => {
		return await authenticatedFetch(`/api/upsells/getUpsellById/${upsellId}`).then(res => res.json())
	}
}

export const useUpdatePreferredUpsellPositioning = () => {
	const authenticatedFetch = useAuthenticatedFetch()

	return async (preferredUpsellPositioning) => {
		return await authenticatedFetch("/api/upsells/updatePreferredUpsellPositioning", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ preferredUpsellPositioning })
		}).then(res => res.json())
	}
}