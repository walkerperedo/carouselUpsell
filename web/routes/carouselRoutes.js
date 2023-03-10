import express from "express"
import {
	createCarousel,
	deleteUpsell,
	getAllStoreUpsells,
	getNumberOfUpsellsCreated,
	getUpsellById,
	getCarousel,
	updatePreferredCarouselPositioning,
	updateUpsell,
	updateUpsellStats,
} from "../helpers/carouselHelper.js"
import { logger } from "../utils/logger.js"
import apicache from "apicache"

const router = express.Router()
const onlyStatus200 = (req, res) => res.statusCode === 200
apicache.options({ debug: true })

export const deleteUpsellsCacheEntry = (productId) => {
	apicache.clear(`/api/upsells/getUpsells/${productId}`)
}

router.post("/createCarousel", express.json(), async (req, res) => {
	const { carousel } = req.body

	try {
		const id = await createCarousel({ ...carousel, store: req.query.shop })
		return res.status(200).json({ id })
	} catch (error) {
		logger.warn("/createCarousel catched error", { error, carousel })
		return res.status(500).send({ error: error.message })
	}
})

router.post("/deleteUpsell", async (req, res) => {
	const { upsellId } = req.body
	try {
		await deleteUpsell(upsellId)
		return res.status(200).send({ upsellId })
	} catch (error) {
		logger.warn("/deleteUpsell catched error", { error, upsellId })
		return res.status(500).json({ error: error.message })
	}
})

router.post("/updateUpsell", express.json(), async (req, res) => {
	const { upsellId, data } = req.body

	try {
		await updateUpsell(upsellId, { ...data, store: req.query.shop })
		return res.status(200).send({ upsellId })
	} catch (error) {
		logger.warn("/updateUpsell catched error", { error, upsellId, data })
		return res.status(500).send({ error: error.message })
	}
})

router.get("/getAllStoreUpsells", async (req, res) => {
	try {
		const upsells = await getAllStoreUpsells(req.query.shop)
		logger.info("/getAllStoreUpsells upsells retrieved", upsells.length)
		return res.status(200).send({ upsells })
	} catch (error) {
		logger.warn("/getAllStoreUpsells catched error", { error })
		return res.status(500).send({ error: error.message })
	}
})

router.get("/getUpsellById/:upsellId", async (req, res) => {
	try {
		const upsell = await getUpsellById(req.params.upsellId)
		logger.info("/getUpsellById upsell retrieved", { upsell })
		return res.status(200).send({ upsell })
	} catch (error) {
		logger.warn("/getUpsellById  catched error", { error })
		return res.status(500).send({ error: error.message })
	}
})

router.post("/updateUpsellStats", async (req, res) => {
	try {
		await updateUpsellStats(req.body.upsellId, req.body.field, req.body.value)
		logger.info("/updateUpsellStats stats updated for", req.body.upsellId, req.body.field, req.body.value)
		return res.status(200).send()
	} catch (error) {
		logger.warn("/updateUpsellStats catched error", { error })
		return res.status(500).send({ error: error.message })
	}
})

router.put("/getCarousel/:productId", async (req, res) => {
	// apicache.middleware("24 hours", onlyStatus200),

	try {
		const carousel = await getCarousel(req.params.productId, req.query.store || "")
		logger.info("/getCarousel carousel retrieved", carousel.length)

		return res.status(200).send({ carousel: carousel.length ? carousel[0] : null })
	} catch (error) {
		logger.warn("/getCarousel catched error", { error })
		return res.status(500).send({ error: error.message })
	}
})

router.post("/updatePreferredCarouselPositioning", async (req, res) => {
	try {
		await updatePreferredCarouselPositioning(req.query.shop, req.body.preferredCarouselPositioning)
		return res.status(200).send()
	} catch (error) {
		logger.warn("/updatePreferredCarouselPositioning catched error", { error })
		return res.status(500).send({ error: error.message })
	}
})

router.get("/getNumberOfUpsellsCreated", async (req, res) => {
	try {
		const numberOfUpsellsCreated = await getNumberOfUpsellsCreated(req.query.shop)
		return res.status(200).send({ numberOfUpsellsCreated })
	} catch (error) {
		logger.warn("/getNumberOfUpsellsCreated catched error", { error })
		return res.status(500).send({ error: error.message })
	}
})

export default router
