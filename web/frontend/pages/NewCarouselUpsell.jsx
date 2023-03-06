import { useNavigate } from "@shopify/app-bridge-react"
import { Icon, Loading, Page } from "@shopify/polaris"
import { DiamondAlertMajor, MobileBackArrowMajor } from "@shopify/polaris-icons"
import React, { useContext, useEffect, useState } from "react"
import BillingPlans from "../components/BillingPlans.jsx"
import { GlobalStateContext } from "../components/providers/GlobalStateProvider.jsx"
import { defaultCarouselEditorState, CarouselEditorStateContext } from "../components/providers/CarouselEditorStateProvider.jsx"
import { CarouselEditor } from "../components/CarouselEditor.jsx"
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch.js"

const NewUpsell = () => {
	const { upsell, setUpsell } = useContext(CarouselEditorStateContext)
	const { state } = useContext(GlobalStateContext)
	const navigate = useNavigate()
	const authFetch = useAuthenticatedFetch()
	const [numberOfUpsellsCreated, setNumberOfUpsellsCreated] = useState(0)
	const [loadingNumberOfUpsellsCreated, setLoadingNumberOfUpsellsCreated] = useState(true)

	const getNumberOfUpsellsCreated = async () => {
		await authFetch("/api/carousels/getNumberOfUpsellsCreated")
			.then((res) => res.json())
			.then((json) => {
				setNumberOfUpsellsCreated(json.numberOfUpsellsCreated || 0)
			})

		setLoadingNumberOfUpsellsCreated(false)
	}

	useEffect(async () => {
		setUpsell(defaultCarouselEditorState)
		await getNumberOfUpsellsCreated()
	}, [])

	if (loadingNumberOfUpsellsCreated) {
		return <Loading />
	}

	if (!state.isSubbed && numberOfUpsellsCreated > 0) {
		return (
			<div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem" }}>
				<div style={{ position: "absolute", top: "10px", left: "10px" }}>
					<div
						className="neu-background neu-shadow neu-border-radius-2 neu-no-border"
						style={{ padding: "0.5rem 1rem", cursor: "pointer", textAlign: "center" }}
						onClick={() => navigate("/")}
					>
						<Icon source={MobileBackArrowMajor} />
					</div>
				</div>
				<div
					className="neu-background neu-shadow neu-border-radius-1"
					style={{ display: "flex", gap: "1rem", padding: "1rem 1rem", width: "fit-content" }}
				>
					<div>
						<Icon source={DiamondAlertMajor} color="critical" />
					</div>
					<div>
						<p className="neu-text font-satoshi neu-text-600">Your current plan only allows you to have one upsell</p>
						<p className="neu-text font-satoshi">Upgrade now to create more than one upsell</p>
					</div>
				</div>
				<BillingPlans returnPath="/newCarouselUpsell" />
			</div>
		)
	}

	return (
		<Page fullWidth>
			<CarouselEditor upsell={upsell} setUpsell={setUpsell} newUpsell={true} />
		</Page>
	)
}

export default NewUpsell
