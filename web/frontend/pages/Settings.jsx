import { useNavigate } from "@shopify/app-bridge-react"
import { Icon, Page, Spinner, Toast } from "@shopify/polaris"
import { TickMinor } from "@shopify/polaris-icons"
import React, { useContext, useState } from "react"
import { GlobalStateContext } from "../components/providers/GlobalStateProvider.jsx"
import ThemeSupportSettings from "../components/ThemeSupportSettings.jsx"
import { CarouselPositioningSettings } from "../components/CarouselPositioningSettings.jsx"
import { useUpdatePreferredUpsellPositioning } from "../hooks/upsellHooks.js"
import { useFirestoreDataUpdate } from "../hooks/useFirestoreDataUpdate.js"

const Settings = () => {
	const updateFirestoreData = useFirestoreDataUpdate()
	const updatePreferredUpsellPositioning = useUpdatePreferredUpsellPositioning()
	const navigate = useNavigate()

	const { state, dispatch } = useContext(GlobalStateContext)
	
	const [saving, setSaving] = useState(false)
	const [savedSuccesfully, setSavedSuccesfully] = useState(false)
	const [toastOpen, setToastOpen] = useState(false)
	const [toastErrorMessage, setToastErrorMessage] = useState("")

	const save = async () => {
		setSaving(true)
		await updateFirestoreData({ preferredUpsellPositioning: state.preferredUpsellPositioning })
		const res = await updatePreferredUpsellPositioning(state.preferredUpsellPositioning)
		setSaving(false)

		if (res.error) {
			setToastOpen(true)
			setToastErrorMessage("Error saving changes")
		} else {
			setSavedSuccesfully(true)
			
			setTimeout(() => {
				setSavedSuccesfully(false)
			}, 3000)
		}
	}

	return (
		<Page fullWidth>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: "2rem" }}>
				<div className="neu-background neu-shadow neu-border-radius-1" style={{ width: "700px", padding: "2rem" }}>
					<div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #ccc" }}>
						<p className="neu-text neu-text-600 font-satoshi" style={{ fontSize: "1.3rem" }}>Settings</p>
					</div>

					<div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
						<ThemeSupportSettings/>
						<CarouselPositioningSettings/>
					</div>

					<div style={{ display: "flex", gap: "1rem", justifyContent: "end", alignItems: "center" }}>
						<button
							className="neu-background neu-shadow neu-border-radius-2 neu-button neu-no-border"
							style={{ marginTop: "1.5rem", padding: "0.5rem 1rem" }}
							onClick={() => navigate("/")}
						>
							<span className="font-satoshi neu-text-600 neu-text">Exit</span>
						</button>
		
						<button
							className="neu-background neu-shadow neu-border-radius-2 neu-button neu-no-border"
							style={{ marginTop: "1.5rem", padding: "0.5rem 1rem" }}
							onClick={save}
							disabled={saving || savedSuccesfully}
						>
							{
								savedSuccesfully ?
									<div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
										<Icon source={TickMinor} color="success" />
										<span className="font-satoshi neu-text-600 neu-text">Saved successfully</span>
									</div>
								: saving ?
									<div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
										<Spinner size="small" />
										<span className="font-satoshi neu-text-600 neu-text">Saving...</span>
									</div>
								:
									<span className="font-satoshi neu-text-600 neu-text">Save changes</span>
							}
						</button>
					</div>
				</div>
				
			</div>

			{ toastOpen && <Toast content={toastErrorMessage} onDismiss={() => setToastOpen(false)} error/> }
		</Page>
	)
}

export default Settings
