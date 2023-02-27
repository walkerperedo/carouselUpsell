import { Icon } from "@shopify/polaris"
import { ThumbsDownMajor, ThumbsUpMajor } from "@shopify/polaris-icons"
import React from "react"
import BillingPlanCard from "./BillingPlanCard.jsx"

const BILLING_PLANS = [
	{
		name: "Free",
		description: "One Upsell",
		displayPrice: "$0",
		features: [
			{
				name: "Create up to 1 Upsell",
				icon: (
					<Icon
						source={ThumbsDownMajor}
						color="critical"
					/>
				)
			},
			{
				name: "Edit & Customize your Upsell",
				icon: (
					<Icon
						source={ThumbsUpMajor}
						color="success"
					/>
				)
			},
			{
				name: "Analytics to track the performance of your Upsell",
				icon: (
					<Icon
						source={ThumbsUpMajor}
						color="success"
					/>
				)
			},
			{
				name: "24/7 Customer support",
				icon: (
					<Icon
						source={ThumbsUpMajor}
						color="success"
					/>
				)
			}
		]
	},
	{
		name: "Unlimited",
		description: "Multiple Upsells",
		displayPrice: "$9.99",
		features: [
			{
				name: "Create Unlimited Upsells",
				icon: (
					<Icon
						source={ThumbsUpMajor}
						color="success"
					/>
				)
			},
			{
				name: "Edit & Customize your Upsells",
				icon: (
					<Icon
						source={ThumbsUpMajor}
						color="success"
					/>
				)
			},
			{
				name: "Analytics to track the performance of your Upsells",
				icon: (
					<Icon
						source={ThumbsUpMajor}
						color="success"
					/>
				)
			},
			{
				name: "24/7 Customer support",
				icon: (
					<Icon
						source={ThumbsUpMajor}
						color="success"
					/>
				)
			},
		]
	},
]

const BillingPlans = ({ returnPath }) => {
	return (
		<div style={{ display: "flex", gap: "2rem", flexDirection: "column", alignItems: "center" }}>
			<div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
				{BILLING_PLANS.map((billingPlan) => (
					<BillingPlanCard key={billingPlan.name} plan={billingPlan} returnPath={returnPath}/>
				))}
			</div>
		</div>
	)
}

export default BillingPlans
