import React from "react"
import BillingPlans from "../components/BillingPlans.jsx"

const Billing = () => {
	return (
		<div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem" }}>
			<BillingPlans returnPath="/billing"/>
		</div>
	)
}

export default Billing
