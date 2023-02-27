import { Icon, Spinner } from "@shopify/polaris"
import { TickMinor } from "@shopify/polaris-icons"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch.js"
import { GlobalStateContext } from "./providers/GlobalStateProvider.jsx"

const ThemeSupportSettings = (props) => {
	const authFetch = useAuthenticatedFetch()
	const { state, dispatch } = useContext(GlobalStateContext)
	const pathToActivateApp = `https://${state.shop}/admin/themes/current/editor?context=apps`
	
	const [loading, setLoading] = useState(false)
	const [storeThemeIsV2, setStoreThemeIsV2] = useState(false)
	const [appEnabled, setAppEnabled] = useState(false)
	const [savingScriptTag, setSavingScriptTag] = useState(false)
	const [scriptTagSavedSuccessful, setScriptTagSavedSuccessful] = useState(false)
	
	const focusEventListener = useRef(null)

	const checkStoreThemeIsV2 = async () => {
		let isThemeV2 = false
		
		await authFetch("/api/isStoreThemeV2", { method: "GET" })
			.then((res) => res.json())
			.then((res) => {
				if (res.response === true) {
					setStoreThemeIsV2(true)
					isThemeV2 = true
				}
			})
			.catch((err) => console.error(err))
		
		return isThemeV2
	}

	const checkAppBlockEnabled = async () => {
		let isAppBlockEnabled = false
		
		await authFetch("/api/isAppBlockEnabled", { method: "GET" })
			.then((res) => res.json())
			.then((res) => {
				if (res.response === true) {
					isAppBlockEnabled = true
				}
			})
			.catch((err) => console.error(err))
		
		return isAppBlockEnabled
	}

	const checkScriptTagPresent = async () => {
		let isScriptTagPresent = false
		
		await authFetch("/api/isScriptTagPresent", { method: "GET" })
			.then((res) => res.json())
			.then((res) => {
				if (res.response === true) {
					isScriptTagPresent = true
				}
			})
			.catch((err) => console.error(err))
		
		return isScriptTagPresent
	}

	const checkIsAppEnabled = async (isThemeV2) => {
		let isEnabled = false
		if (isThemeV2) {
			isEnabled = await checkAppBlockEnabled()
		} else {
			isEnabled = await checkScriptTagPresent()
		}

		setAppEnabled(isEnabled)
		return isEnabled
	}

	const createScriptTag = async () => {
		setSavingScriptTag(true)
		const res = await authFetch("/api/createScriptTag", { method: "POST" })
		setSavingScriptTag(false)

		if (!res.error) {
			setAppEnabled(true)
			setScriptTagSavedSuccessful(true)
			setTimeout(() => {
				setScriptTagSavedSuccessful(false)
			}, 2000)
		}
	}

	const deleteScriptTag = async () => {
		setSavingScriptTag(true)
		const res = await authFetch("/api/deleteScriptTag", { method: "POST" })
		setSavingScriptTag(false)

		if (!res.error) {
			setAppEnabled(false)
			setScriptTagSavedSuccessful(true)
			setTimeout(() => {
				setScriptTagSavedSuccessful(false)
			}, 2000)
		}
	}

	const openThemeEditor = () => {
		const recheck = async () => {
			setLoading(true)
			const appBlockIsEnabled = await checkAppBlockEnabled()
			setLoading(false)

			if (appBlockIsEnabled) {
				setAppEnabled(true)
				if (props.setHasEnabledApp) {
					props.setHasEnabledApp(true)
				}
				window?.removeEventListener("focus", focusEventListener.current)
			} else {
				setAppEnabled(false)
			}
		}
		focusEventListener.current = recheck
		window?.addEventListener("focus", recheck)
		
		window?.open(pathToActivateApp, "_blank")
	}

	useEffect(async () => {
		setLoading(true)

		const isThemeV2 = await checkStoreThemeIsV2()
		const isEnabled = await checkIsAppEnabled(isThemeV2)
		
		if (props.setHasEnabledApp) {
			props.setHasEnabledApp(isEnabled)
		}

		setLoading(false)
	}, [])

	
	return (
		<div>
			{
				loading ?
					<div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "1rem" }}>
						<Spinner size="small"/>
					</div>
				:
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<div>
							<span className="neu-text neu-text-600">App is currently: <span title={storeThemeIsV2 ? "V2" : "V1" } style={{ color: appEnabled ? "green" : "red" }}>{appEnabled ? "Enabled" : "Disabled"}</span></span>
							{
								storeThemeIsV2 && !appEnabled && (
									<div className="neu-text font-satoshi" style={{ marginTop: "1rem" }}>
										Enable the app in the App Embeds section of your theme, click <span style={{ fontWeight: "bold" }}>Enable</span> to do so
									</div>
								)
							}
						</div>

						<button
							className="neu-background neu-shadow neu-border-radius-2 neu-button neu-no-border"
							style={{ padding: "0.5rem 1rem", alignSelf: "start" }}
							onClick={
								storeThemeIsV2 ?
									openThemeEditor
								: appEnabled ?
									deleteScriptTag
								:
									createScriptTag
							}
						>
							{
								savingScriptTag ?
									<div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
										<Spinner size="small" />
										<span className="font-satoshi neu-text-600 neu-text">{appEnabled ? "Disabling" : "Enabling"}...</span>
									</div>
								: scriptTagSavedSuccessful ?
									<div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
										<Icon source={TickMinor} color="success" />
									</div>
								:
									<span className="neu-text font-satoshi">{appEnabled ? "Disable" : "Enable"}</span>
							}
						</button>

					</div>
			}
		</div>
	)
}

export default ThemeSupportSettings
