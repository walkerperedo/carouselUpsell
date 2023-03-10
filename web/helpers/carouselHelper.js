import admin, { getStoreData, setStoreData } from "./firestoreHelper.js"
import { logger } from "../utils/logger.js"
import { Shopify } from "@shopify/shopify-api"
import { graphqlProxy } from "./graphql.js"

const db = admin.firestore()

export const getAllProductIdsFromCollectionIds = async (store, collectionIds) => {
	const accessToken = (await getStoreData(store, true))?.accessToken || null
	const productIds = []

	if (!accessToken) {
		return []
	}

	for (const collectionId of collectionIds) {
		const res = await graphqlProxy(
			store,
			accessToken,
			`{
			collection(id: "gid://shopify/Collection/${collectionId}") {
				products(first: 250) {
					nodes {
						id
					}
				}
			}
		}`
		)

		if (res?.body?.data?.collection?.products?.nodes) {
			res.body.data.collection.products.nodes.map((product) => {
				if (product.id) {
					const id = /\d+/.exec(product.id)?.[0] || null
					if (id) productIds.push(id)
				}
			})
		}
	}

	return productIds
}

export const createCarousel = async (carousel) => {
	if (carousel.store && carousel.associatedCollectionIds.length > 0) {
		carousel.shownFor = await getAllProductIdsFromCollectionIds(carousel.store, carousel.associatedCollectionIds)
	}

	const preferredCarouselPositioning = (await getStoreData(carousel.store, true))?.preferredCarouselPositioning || "before($ADD_TO_CART$)"

	const response = await db.collection("carousels").add({
		...carousel,
		positioning: preferredCarouselPositioning,
	})
	return response.id || null
}

export const deleteUpsell = async (upsellId) => {
	return await db.collection("carousels").doc(upsellId).delete()
}

export const updateUpsell = async (upsellId, upsell) => {
	if (upsell.store && upsell.associatedCollectionIds.length > 0) {
		upsell.shownFor = await getAllProductIdsFromCollectionIds(upsell.store, upsell.associatedCollectionIds)
	}

	const preferredCarouselPositioning = (await getStoreData(upsell.store, true))?.preferredCarouselPositioning || "before($ADD_TO_CART$)"

	return await db
		.collection("upsells")
		.doc(upsellId)
		.update({
			...upsell,
			positioning: preferredCarouselPositioning,
		})
}

export const getAllStoreUpsells = async (store) => {
	const docs = []
	await db
		.collection("carousels")
		.where("store", "==", store)
		.get()
		.then((snap) => {
			snap.docs.map((upsell) => docs.push({ id: upsell.id, ...upsell.data() }))
		})
	return docs
}

export const getUpsellById = async (upsellId) => {
	const doc = await db.collection("carousels").doc(upsellId).get()
	return doc?.data() || null
}

export const updateUpsellStats = async (upsellId, field, value) => {
	return await db
		.collection("carousels")
		.doc(upsellId)
		.update({ [`stats.${field}`]: admin.firestore.FieldValue.increment(value) })
}

export const updateShownForByAssociatedCollectionIds = async (shop, updatedCollectionId) => {
	const upsellsAssociatedWithUpdatedCollectionId = (
		await db.collection("carousels").where("associatedCollectionIds", "array-contains", updatedCollectionId).get()
	).docs
	if (upsellsAssociatedWithUpdatedCollectionId.length === 0) return

	for (const upsell of upsellsAssociatedWithUpdatedCollectionId) {
		const newShownFor = await getAllProductIdsFromCollectionIds(upsell.data().store, upsell.data().associatedCollectionIds)

		if (newShownFor) {
			upsell.ref.update({ shownFor: newShownFor })
		}
	}
}

export const buildProductVariantQuery = (ids) => {
	let query = "query {"

	ids.map((id, i) => {
		query += `
      product${i + 1}: product(id: "gid://shopify/Product/${id}") {
		title
        variants(first: 30) {
          nodes{
			availableForSale
            id
            price
            compareAtPrice
            displayName
            image{
              url
            }
          }
        }
      }
    `
	})
	query += "}"

	return query
}

export const getProductMetadataFromShopify = async (store, carouselProductIds, upsellToReturn) => {
	const accessToken = (await getStoreData(store, true))?.accessToken || null
	let carouselItems

	if (!accessToken) {
		logger.warn("[getUpsellVariantMetadataFromShopify] No access token found", { store })
		return null
	}
	const query = buildProductVariantQuery(carouselProductIds)
	const res = await graphqlProxy(store, accessToken, query)

	if (res?.body?.data) {
		carouselItems = Object.keys(res.body.data).map((key) => {
			return res.body.data[key]?.variants?.nodes?.map((variant) => {
				return {
					id: variant?.id || null,
					image: variant?.image?.url || null,
					price: variant?.price || null,
					compareAtPrice: variant?.compareAtPrice || null,
					availableForSale: variant?.availableForSale || null,
					variantName: variant?.displayName?.includes("Default Title") ? res.body.data[key]?.title : variant?.displayName,
				}
			})
		})
	}

	return {
		...upsellToReturn,
		carouselItems,
	}
}

export const getCarousel = async (productId, store) => {
	const upsellsToReturn = []
	const metadataPromisesArr = []
	let carouselArr = []

	const globalUpsells = db.collection("carousels").where("store", "==", store).where("shownFor", "array-contains", "*").get()
	const shownForUpsells = db.collection("carousels").where("shownFor", "array-contains", productId).get()

	await Promise.allSettled([globalUpsells, shownForUpsells]).then((responses) => {
		responses.map((res) => {
			if (res.value) {
				res.value.docs.map((carousel) => {
					carouselArr.push({ id: carousel.id, ...carousel.data() })
				})
			}
		})
	})
	if (carouselArr.length === 0) return []

	for (const carousel of carouselArr) {
		if (carousel.published && carousel.store && carousel.carouselItems.length) {
			const productMetadataPromise = getProductMetadataFromShopify(carousel.store, carousel.carouselItems, {
				id: carousel.id,
				displayText: carousel.displayText,
				positioning: carousel.positioning,
				styling: carousel.styling,
			})

			if (productMetadataPromise) {
				metadataPromisesArr.push(productMetadataPromise)
			}
		}
	}

	await Promise.allSettled(metadataPromisesArr).then((responses) => {
		responses.map((res) => {
			if (res.value) {
				upsellsToReturn.push(res.value)
			}
		})
	})

	return upsellsToReturn
}

export const updatePreferredCarouselPositioning = async (store, preferredCarouselPositioning) => {
	await setStoreData(store, { preferredCarouselPositioning })
	const upsells = (await db.collection("carousels").where("store", "==", store).get()).docs

	for (const upsell of upsells) {
		await upsell.ref.update({ positioning: preferredCarouselPositioning })
	}
}

export const getNumberOfUpsellsCreated = async (store) => {
	const upsells = await db.collection("carousels").where("store", "==", store).get()
	return upsells.docs.length
}
