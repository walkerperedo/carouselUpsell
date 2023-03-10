import { ResourcePicker } from "@shopify/app-bridge-react"
import { Icon } from "@shopify/polaris"
import { CancelSmallMinor } from "@shopify/polaris-icons"
import React, { useEffect, useState } from "react"
import { useGQL } from "../hooks/useGQL.js"
import { buildProductVariantQuery, buildVariantsQuery } from "../utils/buildVariantsQuery.js"
import { extractIdNumberFromGid } from "../utils/shopifyGid.js"

export const CarouselProductSelector = ({ upsell, setUpsell }) => {
	const gql = useGQL()

	const [open, setOpen] = useState(false)
	const [carouselItems, setCarouselItems] = useState([]) // [{id, title, image}]
	const [noProductsMessage, setNoProductsMessage] = useState("Select Carousel Products")

	const handleSelection = (resources) => {
		if (resources.selection.length < 2) {
			setCarouselItems([])
			setUpsell({ carouselItems: [] })
			setNoProductsMessage("Please select at least two products")
		} else {
			const newItems = resources.selection.map((resource) => {
				return {
					id: extractIdNumberFromGid(resource.id),
					title: resource.title,
					image: resource.images.length ? resource.images[0]?.originalSrc : "",
				}
			})

			setCarouselItems(newItems)

			setUpsell({
				carouselItems: resources.selection.map((resource) => extractIdNumberFromGid(resource.id)),
			})
		}
		setOpen(false)
	}

	const deleteSelection = (id) => {
		if (carouselItems.length < 3) {
			setCarouselItems([])
			setUpsell({ carouselItems: [] })
			setNoProductsMessage("Please select at least two products")
		} else {
			const newItems = upsell.carouselItems.filter((variantId) => variantId !== id)
			const newCarouselItems = carouselItems.filter((item) => item.id !== id)

			setUpsell({ carouselItems: newItems })
			setCarouselItems(newCarouselItems)
		}
	}

	useEffect(async () => {
		if (upsell.carouselItems.length && !carouselItems.length) {
			const variantRes = await gql(buildProductVariantQuery(upsell.carouselItems))
			if (variantRes?.data) {
				const variantInfo = Object.keys(variantRes.data).map((key) => {
					const current = variantRes.data[key]
					return {
						title: current?.variants?.nodes[0]?.displayName,
						price: current?.variants?.nodes[0]?.price,
						compareAtPrice: current?.variants?.nodes[0]?.compareAtPrice,
						image: current?.variants?.nodes[0]?.image?.url,
						id: extractIdNumberFromGid(current?.variants?.nodes[0]?.id),
					}
				})
				setCarouselItems(variantInfo)
			}
		}
	}, [upsell.carouselItems.length])

	return (
		<div style={{ borderTop: "1px solid #ccc", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
			<div style={{ display: "flex", gap: "1rem", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
				<span className="font-satoshi neu-text neu-text-600" style={{ fontSize: "1.2rem" }}>
					Carousel Products
				</span>
				<div className="neu-background neu-shadow neu-border-radius-2 neu-no-border neu-button" onClick={() => setOpen(true)}>
					<span className="font-satoshi neu-text neu-text-600">Add Products</span>
				</div>
			</div>

			{carouselItems.length ? (
				carouselItems.map((item) => (
					<div
						key={item.id}
						style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "1rem" }}
					>
						<div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
							{item.image && (
								<img
									className="neu-shadow"
									style={{ borderRadius: "5px", height: "4rem", width: "4rem", objectFit: "contain", background: "white" }}
									src={item.image}
								/>
							)}
							<div style={{ maxWidth: "290px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
								<span className="neu-text font-satoshi" title={item.title || ""} style={{ fontSize: "1rem" }}>
									{item.title || "Product Title"}
								</span>
							</div>
						</div>
						<div
							className="icon neu-background neu-shadow neu-border-radius-2"
							style={{ padding: "0.5rem", cursor: "pointer" }}
							onClick={() => deleteSelection(item.id)}
						>
							<Icon source={CancelSmallMinor} />
						</div>
					</div>
				))
			) : (
				<p style={{ marginTop: "4rem", marginBottom: "4rem", color: "#ff3838", textAlign: "center" }}>{noProductsMessage}</p>
			)}

			<ResourcePicker
				resourceType={"Product"}
				showVariants={false}
				open={open}
				selectMultiple={true}
				onCancel={() => setOpen(false)}
				onSelection={handleSelection}
			/>
		</div>
	)
}
