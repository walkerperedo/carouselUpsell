import { useAuthenticatedFetch } from "./useAuthenticatedFetch.js"

export const useCreateCarousel = () => {
	const authenticatedFetch = useAuthenticatedFetch()

	return async (carousel) => {
		return await authenticatedFetch("/api/carousels/createCarousel", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ carousel }),
		}).then((res) => res.json())
	}
}

export const useDeleteCarousel = () => {
	const authenticatedFetch = useAuthenticatedFetch()

	return async (upsellId) => {
		return await authenticatedFetch("/api/carousels/deleteUpsell", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ upsellId }),
		}).then((res) => res.json())
	}
}

export const useUpdateCarousel = () => {
	const authenticatedFetch = useAuthenticatedFetch()

	return async (upsellId, data) => {
		return await authenticatedFetch("/api/carousels/updateUpsell", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ upsellId, data }),
		}).then((res) => res.json())
	}
}

export const useGetAllStoreCarousels = () => {
	const authenticatedFetch = useAuthenticatedFetch()

	return async () => {
		return await authenticatedFetch("/api/carousels/getAllStoreUpsells").then((res) => res.json())
	}
}

export const useGetCarouselById = () => {
	const authenticatedFetch = useAuthenticatedFetch()

	return async (upsellId) => {
		return await authenticatedFetch(`/api/carousels/getUpsellById/${upsellId}`).then((res) => res.json())
	}
}

export const useUpdatePreferredCarouselPositioning = () => {
	const authenticatedFetch = useAuthenticatedFetch()

	return async (preferredCarouselPositioning) => {
		return await authenticatedFetch("/api/carousels/updatePreferredCarouselPositioning", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ preferredCarouselPositioning }),
		}).then((res) => res.json())
	}
}
