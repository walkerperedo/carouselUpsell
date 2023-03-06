import { useNavigate } from "@shopify/app-bridge-react"
import { Icon, Spinner, Toast } from "@shopify/polaris"
import { MobileBackArrowMajor, TickMinor } from "@shopify/polaris-icons"
import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { CarouselPreview } from "./CarouselPreview.jsx"
import { CarouselSettings } from "./CarouselSettings.jsx"
import { CarouselStyling } from "./CarouselStyling.jsx"
import { useCreateCarousel, useUpdateCarousel } from "../hooks/carouselHooks.js"

export const CarouselEditor = ({ upsell, setUpsell, newUpsell }) => {
	const navigate = useNavigate()
	const { id } = useParams()
	const updateUpsell = useUpdateCarousel()
	const createCarousel = useCreateCarousel()

	const [selectedTab, setSelectedTab] = useState(0)
	const [saving, setSaving] = useState(false)
	const [saveSuccesful, setSaveSuccesful] = useState(false)
	const [toastOpen, setToastOpen] = useState(false)
	const [toastErrorMessage, setToastErrorMessage] = useState("")

	const saveChanges = async (carousel) => {
		setSaving(true)

		let res = null

		if (newUpsell) {
			res = await createCarousel(carousel)
		} else {
			res = await updateUpsell(id, carousel)
		}

		setSaving(false)

		if (res.error) {
			setToastOpen(true)
			setToastErrorMessage("Error saving changes")
		} else {
			setSaveSuccesful(true)

			if (newUpsell) {
				navigate("/")
			} else {
				setTimeout(() => {
					setSaveSuccesful(false)
				}, 3000)
			}
		}
	}

	const formNotValidated =
		!upsell.name ||
		!upsell.displayText ||
		!upsell.carouselItems.length === 0 ||
		(upsell.shownFor.length === 0 && upsell.associatedCollectionIds.length === 0)

	return (
		<div style={{ maxWidth: "1200px", margin: "auto" }}>
			<div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem" }}>
				<div>
					<div
						className="neu-background neu-shadow neu-border-radius-2 neu-no-border"
						style={{ padding: "0.5rem 1rem", cursor: "pointer", textAlign: "center" }}
						onClick={() => navigate("/")}
					>
						<Icon source={MobileBackArrowMajor} />
					</div>
				</div>
				<div>
					<button
						className="neu-background neu-shadow neu-border-radius-2 neu-no-border neu-button"
						style={{ padding: "0.5rem 1rem", cursor: "pointer", textAlign: "center" }}
						onClick={() => saveChanges(upsell)}
						disabled={saving || saveSuccesful || formNotValidated}
					>
						{saveSuccesful ? (
							<div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
								<Icon source={TickMinor} color="success" />
								<span className="font-satoshi neu-text-600 neu-text">Saved successfully</span>
							</div>
						) : saving ? (
							<div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
								<Spinner size="small" />
								<span className="font-satoshi neu-text-600 neu-text">Saving...</span>
							</div>
						) : (
							<span className="font-satoshi neu-text-600 neu-text">Save changes</span>
						)}
					</button>
				</div>
			</div>

			<div className="upsell-editor" style={{ marginTop: "1rem", marginBottom: "5rem", display: "flex", gap: "2rem" }}>
				<CarouselPreview upsell={upsell} />

				<div
					className="upsell-editor-settings neu-background neu-shadow neu-border-radius-1"
					style={{ padding: "1rem 1.5rem 2rem 1.5rem", flex: "1", alignSelf: "flex-start", marginBottom: "50vh" }}
				>
					<div style={{ display: "flex", gap: "0.5rem", justifyContent: "space-between" }}>
						<div
							className={`neu-background neu-shadow${selectedTab === 0 ? "-inset" : ""} neu-border-radius-2 neu-no-border neu-button`}
							style={{ width: "50%", padding: "0.5rem 1rem", cursor: "pointer", textAlign: "center" }}
							onClick={() => setSelectedTab(0)}
						>
							<span className="font-satoshi neu-text-600 neu-text">Settings</span>
						</div>
						<div
							className={`neu-background neu-shadow${selectedTab === 1 ? "-inset" : ""} neu-border-radius-2 neu-no-border neu-button`}
							style={{ width: "50%", padding: "0.5rem 1rem", cursor: "pointer", textAlign: "center" }}
							onClick={() => setSelectedTab(1)}
						>
							<span className="font-satoshi neu-text-600 neu-text">Style</span>
						</div>
					</div>

					{selectedTab === 0 ? (
						<CarouselSettings upsell={upsell} setUpsell={setUpsell} />
					) : selectedTab === 1 ? (
						<CarouselStyling upsell={upsell} setUpsell={setUpsell} />
					) : (
						""
					)}
				</div>
			</div>

			{toastOpen && <Toast content={toastErrorMessage} onDismiss={() => setToastOpen(false)} error />}
		</div>
	)
}
