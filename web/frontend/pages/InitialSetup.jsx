import { useNavigate } from "@shopify/app-bridge-react"
import { Banner, Page, Spinner } from "@shopify/polaris"
import React, { useContext, useState } from "react"
import { GlobalStateContext } from "../components/providers/GlobalStateProvider.jsx"
import ThemeSupportSettings from "../components/ThemeSupportSettings.jsx"
import { CarouselPositioningSettings } from "../components/CarouselPositioningSettings.jsx"
import { useFirestoreDataUpdate } from "../hooks/useFirestoreDataUpdate.js"

export const InitialSetup = () => {
	const updateFirestoreData = useFirestoreDataUpdate()
	const navigate = useNavigate()
	const { state, dispatch } = useContext(GlobalStateContext)

	const [loading, setLoading] = useState(false)
	const [hasEnabledApp, setHasEnabledApp] = useState(false)

	const finishSetup = async () => {
		setLoading(true)
		await updateFirestoreData({ hasCompletedInitialSetup: true, preferredUpsellPositioning: state.preferredUpsellPositioning })
		dispatch({ hasCompletedInitialSetup: true })
		setLoading(false)
		navigate("/")
	}

	return (
		<Page fullWidth>
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
				<div style={{ width: "520px", padding: "1rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
					<h1 className="neu-text font-satoshi" style={{ fontSize: "2rem", marginBottom: "1rem" }}>Hey! Welcome to JustUpsell</h1>
	
					<Banner status="info">
						<h2 className="neu-text font-satoshi">
							Please follow the steps below to start using the app
						</h2>
					</Banner>

					<div>
						<p className="neu-text font-satoshi" style={{ marginBottom: "1rem" }}>1. Enable the app</p>
						<div className="neu-background neu-shadow neu-border-radius-1" style={{ padding: "1rem" }}>
							<ThemeSupportSettings setHasEnabledApp={setHasEnabledApp}/>
						</div>
					</div>

					<div>
						<p className="neu-text font-satoshi" style={{ marginBottom: "1rem" }}>2. Choose where you want your upsells to be displayed</p>
						<div className="neu-background neu-shadow neu-border-radius-1" style={{ padding: "1rem" }}>
							<CarouselPositioningSettings/>
						</div>
					</div>
	
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<h2 className="neu-text font-satoshi">Click <span style={{ fontWeight: "bold" }}>Next</span> once you have completed the steps above</h2>
						<button
							className="neu-background neu-shadow neu-border-radius-2 neu-button neu-no-border"
							style={{ padding: "0.5rem 1rem" }}
							onClick={finishSetup}
							disabled={loading || !hasEnabledApp || !state.preferredUpsellPositioning}
						>
							{
								loading ?
									<Spinner size="small"/>
								:
									<span className="neu-text font-satoshi">Next</span>
							}
						</button>
					</div>
				</div>
			</div>
		</Page>
	)
}
