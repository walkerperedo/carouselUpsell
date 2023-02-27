import { ResourcePicker } from "@shopify/app-bridge-react"
import { Icon, Select, Spinner } from "@shopify/polaris"
import { CancelSmallMinor } from "@shopify/polaris-icons"
import React, { useEffect, useState } from "react"
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch.js"
import { extractIdNumberFromGid } from "../utils/shopifyGid.js"
import { ShownForItem } from "./ShownForItem.jsx"

export const ShownForSelector = ({ upsell, setUpsell }) => {
	const authFetch = useAuthenticatedFetch()

	const [openProductPicker, setOpenProductPicker] = useState(false)
	const [selectionType, setSelectionType] = useState("products")

	const onSelectionTypeChange = (change) => {
		setSelectionType(change)

		if (change === "products") {
			setUpsell({ shownFor: [], associatedCollectionIds: [] })
		} else if (change === "collections") {
			setUpsell({ shownFor: [], associatedCollectionIds: [] })
		} else {
			setUpsell({ shownFor: ["*"], associatedCollectionIds: [] })
		}
	}

	const handleSelection = (resources) => {
		setOpenProductPicker(false)

		if (selectionType === "products") {
			setUpsell({ shownFor: resources.selection.map(x => extractIdNumberFromGid(x.id)), associatedCollectionIds: [] })
		} else if (selectionType === "collections") {
			setUpsell({ shownFor: [], associatedCollectionIds: resources.selection.map(x => extractIdNumberFromGid(x.id)) })
		} else {
			setUpsell({ shownFor: ["*"], associatedCollectionIds: [] })
		}
	}

	const removeFromSelection = (id) => {
		if (selectionType === "products") {
			setUpsell({ shownFor: upsell.shownFor.filter((productId) => productId !== id) })
		} else if (selectionType === "collections") {
			setUpsell({ associatedCollectionIds: upsell.associatedCollectionIds.filter((collectionId) => collectionId !== id) })
		}
	}

	useEffect(() => {
		if (upsell.associatedCollectionIds.length) {
			setSelectionType("collections")
		} else if (upsell.shownFor[0] === "*") {
			setSelectionType("allProducts")
		} else {
			setSelectionType("products")
		}
	}, [])
	

	const resourcesDisplayed = selectionType === "products" ? upsell.shownFor : upsell.associatedCollectionIds

	return (
		<div style={{ borderTop: "1px solid #ccc", paddingTop: "1.5rem" }}>
			<span className="font-satoshi neu-text neu-text-600" style={{ fontSize: "1.2rem" }}>Where the Upsell will be shown</span>

			<div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
				<div style={{ flex: "1" }}>
					<Select
						options={[
							{ label: "Show Upsell for Specific Products", value: "products" },
							{ label: "Show Upsell for Specific Collections", value: "collections" },
							{ label: "Show Upsell for All Products", value: "allProducts" },
						]}
						value={selectionType}
						onChange={(value) => onSelectionTypeChange(value)}
					/>
				</div>
				<button className="neu-background neu-shadow neu-border-radius-2 neu-no-border neu-button" onClick={() => setOpenProductPicker(true)} disabled={selectionType === "allProducts"}>
					<span className="font-satoshi neu-text neu-text-600">Browse</span>
				</button>
			</div>

			{
				resourcesDisplayed.length > 0 ?
					<div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
						{
							resourcesDisplayed.map((r) => {
								return <ShownForItem key={r} resourceType={selectionType} resourceId={r} removeFromSelection={removeFromSelection}/>
							})
						}
					</div>
				:
					<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "10rem" }}>
						{
							selectionType === "products" ?
								<span style={{ color: "#ff3838" }}>Please select at least one product</span>
							: selectionType === "collections" ?
								<span style={{ color: "#ff3838" }}>Please select at least one collection</span>
							: <span>Upsell will be shown for all products</span>
						}
					</div>
			}


			<ResourcePicker
				resourceType={selectionType === "products" ? "Product" : "Collection"}
				showVariants={false}
				open={openProductPicker}
				allowMultiple={true}
				onCancel={() => setOpenProductPicker(false)}
				onSelection={handleSelection}
			/>
		</div>
	)
}
