import { Shopify } from "@shopify/shopify-api"
import { Asset, ScriptTag, Theme } from "@shopify/shopify-api/dist/rest-resources/2022-07/index.js"
import { logger } from "../utils/logger.js"

const validBlockType = process.env.NODE_ENV === "production" ? "shopify://apps/justupsell-checkbox-upsell/blocks/justUpsell/" : "shopify://apps/justupsell-dev/blocks/justUpsell/"

export default function applyThemeSupportRoutes(app) {
	app.get("/api/isStoreThemeV2", async (req, res) => {
		try {
			
			// const APP_BLOCK_TEMPLATES = ["product", "collection", "index"]
			const APP_BLOCK_TEMPLATES = ["product"]
			const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"))
	
			// Use `client.get` to request a list of themes on the shop
			const themes = await Theme.all({ session })
	
			// Find the currently active theme
			const publishedTheme = themes.find((theme) => theme.role === "main")
	
			// Retrieve a list of assets in the published theme
			const assets = await Asset.all({ session, theme_id: publishedTheme.id })
	
			// Check if JSON template files exist for the template specified in APP_BLOCK_TEMPLATES
			const templateJSONFiles = assets.filter((file) => {
				return APP_BLOCK_TEMPLATES.some((template) => file.key === `templates/${template}.json`)
			})
	
			if (templateJSONFiles.length > 0 && templateJSONFiles.length === APP_BLOCK_TEMPLATES.length) {
				logger.debug("All desired templates support sections everywhere!")
			} else if (templateJSONFiles.length) {
				logger.debug("Only some of the desired templates support sections everywhere.")
			}
	
			// Retrieve the body of JSON templates and find what section is set as `main`
			const templateMainSections = (
				await Promise.all(
					templateJSONFiles.map(async (file, index) => {
						let acceptsAppBlock = false
	
						const asset = await Asset.all({
							session,
							theme_id: publishedTheme.id,
							asset: { key: file.key },
						})
	
						const json = JSON.parse(asset[0].value)
						const main = Object.entries(json.sections).find(
							([id, section]) => id === "main" || section.type.startsWith("main-")
						)
						if (main) {
							return assets.find((file) => file.key === `sections/${main[1].type}.liquid`)
						}
					})
				)
			).filter((value) => value)
	
			// Request the content of each section and check if it has a schema that contains a
			// block of type '@app'
			const sectionsWithAppBlock = (
				await Promise.all(
					templateMainSections.map(async (file, index) => {
						let acceptsAppBlock = false
						const asset = await Asset.all({
							session,
							theme_id: publishedTheme.id,
							asset: { key: file.key },
						})
	
						const match = asset[0].value.match(
							/\{%\s+schema\s+%\}([\s\S]*?)\{%\s+endschema\s+%\}/m
						)
						const schema = JSON.parse(match[1])
						if (schema && schema.blocks) {
							acceptsAppBlock = schema.blocks.some((b) => b.type === "@app")
						}
	
						return acceptsAppBlock ? file : null
					})
				)
			).filter((value) => value)
	
			if (templateJSONFiles.length > 0 && templateJSONFiles.length === sectionsWithAppBlock.length) {
				res.status(200).send({ response: true })
			} else if (sectionsWithAppBlock.length) {
				res.status(200).send({ response: false })
			} else {
				res.status(200).send({ response: false })
			}
		} catch (error) {
			logger.error("/api/storeThemeIsV2 catched error", { error })
			res.status(500).send({ response: false })
		}
	})

	app.get("/api/isAppBlockEnabled", async (req, res) => {
		try {
			const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"))
			let appEnabled = false

			const themes = await Theme.all({ session })
			// logger.debug("/api/checkIfAppBlockIsEnabled themes obtained", { themes: themes.map(t => ({ name: t.name, id: t.id, role: t.role })) })

			if (themes?.length > 0) {
				let currentlyActiveThemeId = ""
				themes.map(t => {
					if (t.role === "main") {
						currentlyActiveThemeId = t.id
					}
				})

				if (!currentlyActiveThemeId) {
					logger.warn("/api/checkIfAppBlockIsEnabled no theme id found in theme obtained", { theme: themes[0] })
					return res.status(500).send({ response: false })
				}
	
				const settingsDataAssets = await Asset.all({
					session,
					theme_id: currentlyActiveThemeId,
					asset: { key: "config/settings_data.json" }
				})

				if (!settingsDataAssets || settingsDataAssets.length === 0) {
					logger.warn("/api/checkIfAppBlockIsEnabled no settings_data.json asset obtained", { currentlyActiveThemeId })
					return res.status(500).send({ error: "No settings_data.json asset obtained" })
				}
				if (!(settingsDataAssets[0]?.value)) {
					logger.warn("/api/checkIfAppBlockIsEnabled no value field found in settings_data.json", { settingsDataAsset: settingsDataAssets[0] })
					return res.status(500).send({ response: false })
				}

				const parsedSettings = JSON.parse(settingsDataAssets[0].value)
				// logger.debug("/api/checkIfAppBlockIsEnabled settingsDataAsset", { parsedSettings })
				
				const blocks = parsedSettings?.current?.blocks
				
				if (!blocks) {
					logger.warn("/api/checkIfAppBlockIsEnabled No blocks found in settings_data.json")
					return res.status(500).send({ response: false })
				}
				// logger.debug("/api/checkIfAppBlockIsEnabled blocks", { blocks: JSON.stringify(blocks) })
				
				for (const prop in blocks) {
					const block = blocks[prop]
					if (block.type.startsWith(validBlockType)) {
						appEnabled = !block.disabled
					}
				}
				return res.status(200).send({ response: appEnabled })
			} else {
				logger.warn("/api/checkIfAppBlockIsEnabled No themes obtained")
				return res.status(500).send({ response: false })
			}
		} catch (e) {
			logger.error("/api/checkIfAppBlockIsEnabled catched error", { error: e })
			res.status(500).send({ response: false })
		}
	})

	app.get("/api/isScriptTagPresent", async (req, res) => {
		try {
			const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"))

			let isScriptTagPresent = false
			const scripts = await ScriptTag.all({ session })

			scripts.map(script => {
				if (script.src.includes(`${process.env.HOST}/justUpsellScript.js`)) {
					isScriptTagPresent = true
				}
			})

			return res.status(200).send({ response: isScriptTagPresent })
		} catch (error) {
			logger.warn("/api/isScriptTagPresent catched error", { error })
			return res.status(500).send({ response: false })
		}
	})

	app.post("/api/createScriptTag", async (req, res) => {
		try {
			const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"))
			const scripts = await ScriptTag.all({ session })
			const ids = scripts.map(async (script) => await ScriptTag.delete({ session, id: script.id }))
			await Promise.all(ids)
			
			const scriptTag = new ScriptTag({ session })
			scriptTag.event = "onload"
			scriptTag.cache = true
			scriptTag.display_scope = "all"
			scriptTag.src = `${process.env.HOST}/justUpsellScript.js?loaddeps`
			await scriptTag.save({ update: true })

			logger.info("/api/createScriptTag Script created")
			return res.status(200).send({ scriptTag })
		} catch (error) {
			logger.warn("/api/createScriptTag catched error", { error })
			return res.status(500).send({ error })
		}
	})

	app.post("/api/deleteScriptTag", async (req, res) => {
		try {
			const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"))
			const scripts = await ScriptTag.all({ session })
			const ids = scripts.map(async (script) => await ScriptTag.delete({ session, id: script.id }))
			await Promise.all(ids)

			logger.info("/api/deleteScriptTags Script created")
			return res.status(200).send({ ids })
		} catch (error) {
			logger.warn("/api/deleteScriptTags catched error", { error })
			return res.status(500).send({ error })
		}
	})
}
