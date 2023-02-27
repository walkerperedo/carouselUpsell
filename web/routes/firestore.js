import express from "express"
import { getStoreData, setStoreData } from "../helpers/firestoreHelper.js"
import { logger } from "../utils/logger.js"

const router = express.Router()

router.get("/getUserData/:shop", async (req, res) => {
	if (!req.params || (!req.params.shop && !req.params.shop === "")) {
		logger.warn("/getUserData No shop parameter found")
		return res.status(400).send({ error: "No shop parameter found" })
	}

	let shop = req.params.shop
	let userData = await getStoreData(shop)

	if(!userData.error){
		return res.send(userData)
	}else{
		return res.send({ error: userData.error })
	}
})

router.post("/updateUserData", express.json(), async (req, res) => {
	let shop = req.body.shop
	if (shop === "" || shop === undefined || !shop) {
		logger.warn("/updateUserData No shop field found")
		return res.status(400).send({ error:"No shop field found" })
	}

	let fields = req.body.fields
	await setStoreData(shop, fields)

	res.status(200).end()
})

export default router