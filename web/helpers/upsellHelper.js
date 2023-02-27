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
		const res = await graphqlProxy(store, accessToken, `{
			collection(id: "gid://shopify/Collection/${collectionId}") {
				products(first: 250) {
					nodes {
						id
					}
				}
			}
		}`)
		
		if (res?.body?.data?.collection?.products?.nodes) {
			res.body.data.collection.products.nodes.map(product => {
				if (product.id) {
					const id = /\d+/.exec(product.id)?.[0] || null
					if (id) productIds.push(id)
				}
			})
		}
	}

	return productIds
}

export const createUpsell = async (upsell) => {
	if (upsell.store && upsell.associatedCollectionIds.length > 0) {
		upsell.shownFor = await getAllProductIdsFromCollectionIds(upsell.store, upsell.associatedCollectionIds)
	}

	const preferredUpsellPositioning = (await getStoreData(upsell.store, true))?.preferredUpsellPositioning || "before($ADD_TO_CART$)"

	const response = await db.collection("upsells").add({
		...upsell,
		positioning: preferredUpsellPositioning
	})
	return response.id || null
}

export const deleteUpsell = async (upsellId) => {
	return await db.collection("upsells").doc(upsellId).delete()
}

export const updateUpsell = async (upsellId, upsell) => {
	if (upsell.store && upsell.associatedCollectionIds.length > 0) {
		upsell.shownFor = await getAllProductIdsFromCollectionIds(upsell.store, upsell.associatedCollectionIds)
	}

	const preferredUpsellPositioning = (await getStoreData(upsell.store, true))?.preferredUpsellPositioning || "before($ADD_TO_CART$)"

	return await db.collection("upsells").doc(upsellId).update({
		...upsell,
		positioning: preferredUpsellPositioning
	})
}

export const getAllStoreUpsells = async (store) => {
	const docs = []
	await db.collection("upsells").where("store", "==", store).get()
		.then(snap => {
			snap.docs.map(upsell => docs.push({ id: upsell.id, ...upsell.data() }))
		})
	return docs
}

export const getUpsellById = async (upsellId) => {
	const doc = await db.collection("upsells").doc(upsellId).get()
	return doc?.data() || null
}

export const updateUpsellStats = async (upsellId, field, value) => {
	return await db.collection("upsells").doc(upsellId).update({ [`stats.${field}`]: admin.firestore.FieldValue.increment(value) })
}

export const updateShownForByAssociatedCollectionIds = async (shop, updatedCollectionId) => {
	const upsellsAssociatedWithUpdatedCollectionId = (await db.collection("upsells").where("associatedCollectionIds", "array-contains", updatedCollectionId).get()).docs
	if (upsellsAssociatedWithUpdatedCollectionId.length === 0) return

	for (const upsell of upsellsAssociatedWithUpdatedCollectionId) {
		const newShownFor = await getAllProductIdsFromCollectionIds(upsell.data().store, upsell.data().associatedCollectionIds)

		if (newShownFor) {
			upsell.ref.update({ shownFor: newShownFor })
		}
	}
}

export const getUpsellVariantMetadataFromShopify = async (store, variantId, upsellToReturn) => {
	const accessToken = (await getStoreData(store, true))?.accessToken || null
	const productIds = []

	if (!accessToken) {
		logger.warn("[getUpsellVariantMetadataFromShopify] No access token found", { store })
		return null
	}

	const res = await graphqlProxy(store, accessToken, `{
		productVariant(id: "gid://shopify/ProductVariant/${variantId}") {
			image {
				url
			}
			price
			compareAtPrice
			availableForSale
			displayName
			product {
				title
				description
				featuredImage {
					url
				}
			}
		}
	}`)

	const image = res?.body?.data?.productVariant?.image?.url || res?.body?.data?.productVariant?.product?.featuredImage?.url || null
	const price = res?.body?.data?.productVariant?.price || null
	const compareAtPrice = res?.body?.data?.productVariant?.compareAtPrice || null
	const availableForSale = res?.body?.data?.productVariant?.availableForSale ?? false
	const description = res?.body?.data?.productVariant?.product?.description
	const variantName = res?.body?.data?.productVariant?.displayName?.includes("Default Title") ? res?.body?.data?.productVariant?.product?.title : res?.body?.data?.productVariant?.displayName


	return {
		...upsellToReturn,
		image,
		price,
		compareAtPrice,
		availableForSale,
		description,
		variantName
	}
}

export const getUpsells = async (productId, store) => {
	const upsellsToReturn = []
	const metadataPromisesArr = []
	let upsells = []

	const globalUpsells = db.collection("upsells").where("store", "==", store).where("shownFor", "array-contains", "*").get()
	const shownForUpsells = db.collection("upsells").where("shownFor", "array-contains", productId).get()
	
	await Promise.allSettled([globalUpsells, shownForUpsells])
		.then(responses => {
			responses.map(res => {
				if (res.value) {
					res.value.docs.map(upsell => {
						upsells.push({ id: upsell.id, ...upsell.data() })
					})
				}
			})
		})

	if (upsells.length === 0) return []

	for (const upsell of upsells) {
		if (upsell.published && upsell.store && upsell.upsellVariantId) {
			const productMetadataPromise = getUpsellVariantMetadataFromShopify(
				upsell.store,
				upsell.upsellVariantId,
				{
					id: upsell.id,
					autoCheck: upsell.autoCheck,
					displayText: upsell.displayText,
					positioning: upsell.positioning,
					priority: upsell.priority,
					styling: upsell.styling,
					upsellProductId: upsell.upsellProductId,
					upsellVariantId: upsell.upsellVariantId,
					seeMoreEnabled: upsell.seeMoreEnabled
				}
			)

			if (productMetadataPromise) {
				metadataPromisesArr.push(productMetadataPromise)
			}
		}
	}

	await Promise.allSettled(metadataPromisesArr)
		.then(responses => {
			responses.map(res => {
				if (res.value) {
					upsellsToReturn.push(res.value)
				}
			})
		})

	return upsellsToReturn
}

export const updatePreferredUpsellPositioning = async (store, preferredUpsellPositioning) => {
	await setStoreData(store, { preferredUpsellPositioning })
	const upsells = (await db.collection("upsells").where("store", "==", store).get()).docs

	for (const upsell of upsells) {
		await upsell.ref.update({ positioning: preferredUpsellPositioning })
	}
}

export const getNumberOfUpsellsCreated = async (store) => {
	const upsells = await db.collection("upsells").where("store", "==", store).get()
	return upsells.docs.length
}