import { Select, TextField } from "@shopify/polaris"
import React, { useContext, useEffect, useState } from "react"
import { GlobalStateContext } from "./providers/GlobalStateProvider.jsx"

export const CarouselPositioningSettings = () => {
	const { state, dispatch } = useContext(GlobalStateContext)

	const [selectionType, setSelectionType] = useState("preset")
	const [selection, setSelection] = useState("beforeAddToCart")
	const [customCssSelector, setCustomCssSelector] = useState("")

	const onSelectionChange = (change) => {
		setSelection(change)
		
		if (change === "beforeCustomCssSelector" || change === "afterCustomCssSelector") {
			setSelectionType("custom")
			setCustomCssSelector("")
			dispatch({ preferredUpsellPositioning: "" })
		} else {
			const position = change === "beforeAddToCart" ? "before" : "after"
			setSelectionType("preset")
			setCustomCssSelector("")
			dispatch({ preferredUpsellPositioning: `${position}($ADD_TO_CART$)` })
		}
	}

	const onCustomCssSelectorChange = (change) => {
		const position = selection === "beforeCustomCssSelector" ? "before" : "after"
		setCustomCssSelector(change)
		dispatch({ preferredUpsellPositioning: `${position}(${change})` })
	}

	useEffect(() => {
		if (state.preferredUpsellPositioning) {
			const isCustom = !state.preferredUpsellPositioning.includes("$ADD_TO_CART$")
			const position = state.preferredUpsellPositioning.split("(")[0]
			const customSelector = /\((.*)\)/.exec(state.preferredUpsellPositioning)?.[1] || ""
			
			if (isCustom) {
				setSelectionType("custom")
				if (position === "before") {
					setSelection("beforeCustomCssSelector")
				} else {
					setSelection("afterCustomCssSelector")
				}
				setCustomCssSelector(customSelector)
			} else {
				setSelectionType("preset")
				if (position === "before") {
					setSelection("beforeAddToCart")
				} else {
					setSelection("afterAddToCart")
				}
			}
		}
	}, [])
	

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
			<div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
				<div className="font-satoshi neu-text neu-text-600">Positioning</div>
				<Select
					options={[
						{ label: "Before Add to Cart Button", value: "beforeAddToCart" },
						{ label: "After Add to Cart Button", value: "afterAddToCart" },
						{ label: "Before Custom CSS Selector", value: "beforeCustomCssSelector" },
						{ label: "After Custom CSS Selector", value: "afterCustomCssSelector" }
					]}
					value={selection}
					onChange={(change) => onSelectionChange(change)}
				/>
			</div>

			{
				selectionType === "custom" && (
					<div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
						<div className="font-satoshi neu-text neu-text-600">Custom CSS Selector</div>
						<TextField
							type="text"
							value={customCssSelector}
							onChange={(value) => onCustomCssSelectorChange(value)}
							placeholder="#my-element > .container"
							disabled={selectionType !== "custom"}
						/>
					</div>
				)
			}

			{
				selectionType === "custom" && !customCssSelector && <div style={{ color: "#ff3838" }}>Custom CSS Selector cannot be empty</div>
			}
		</div>
	)
}
