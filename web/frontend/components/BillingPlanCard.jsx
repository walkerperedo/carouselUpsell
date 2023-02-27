import { useAppBridge } from "@shopify/app-bridge-react"
import { Redirect } from "@shopify/app-bridge/actions"
import { Button, Heading } from "@shopify/polaris"
import React, { useContext } from "react"
import PositiveComparisonIndicator from "../assets/PositiveComparisonIndicator.svg"
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch.js"
import { GlobalStateContext } from "./providers/GlobalStateProvider"

const getIdFromGid = (gid) => {
	const arr = gid.split("/")
	return arr[arr.length - 1]
}

const BillingPlanCard = ({ plan, returnPath }) => {
	const { state } = useContext(GlobalStateContext)
	const authFetch = useAuthenticatedFetch()
	const appBridge = useAppBridge()

	const currentlyActive = (!state.isSubbed && plan.name === "Free") || (state.activePlan === plan.name)

	const changeActivePlan = async () => {
		await authFetch("/api/changeBillingPlan", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				planName: plan.name,
				returnPath: returnPath
			})
		})
			.then(res => res.json())
			.then(json => {
				if (json.redirectionUrl) {
					const redirect = Redirect.create(appBridge)

					redirect.dispatch(
						Redirect.Action.REMOTE,
						decodeURIComponent(json.redirectionUrl)
					)
				}
			})

	}

	return (
		<div
			className="neu-background neu-shadow neu-border-radius-1"
			style={{
				position: "relative",
				width: "305px",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				padding: "2rem 2rem 1rem 2rem"
			}}
			key={plan.name}
		>

			<div style={{ display: "flex", gap: "0.5rem", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
				<div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flex: "1" }}>
					<Heading>{plan.name} Plan</Heading>
				</div>

				<div className="Polaris-Heading">{plan.displayPrice}</div>

				{currentlyActive && (
					<img
						className="pulse-green"
						style={{ width: "16px", height: "16px" }}
						src={PositiveComparisonIndicator}
					/>
				)}
			</div>

			<p className="font-satoshi" style={{ fontSize: "0.8rem", color: "#555" }}>
				{plan.description}
			</p>

			<div className="font-satoshi" style={{ margin: "1rem 0" }}>
				<h3>Features: </h3>
				{plan.features.map((feature) => (
					<div
						key={`${feature.name}_${plan.name}`}
						style={{ display: "flex", gap: "0.4rem", margin: "0.6rem 0" }}
					>
						<div>
							{feature.icon}
						</div>
						<span>{feature.name}</span>
					</div>
				))}
			</div>

			<div style={{ marginTop: "auto" }}>
				{currentlyActive ? (
					<div
						className="neu-background neu-shadow neu-no-border"
						style={{ padding: "0.5rem 1rem", display: "flex", justifyContent: "center", borderRadius: "0.25rem", width: "100%" }}
					>
						<span className="font-satoshi neu-text neu-text-600">Current</span>
					</div>
				) : (
					<Button primary onClick={changeActivePlan} fullWidth>
						<p className="font-satoshi">Change Plan</p>
					</Button>
				)}
			</div>
		</div>
	)
}

export default BillingPlanCard
