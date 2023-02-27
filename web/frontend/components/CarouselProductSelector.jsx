import { ResourcePicker } from "@shopify/app-bridge-react"
import { Icon } from "@shopify/polaris"
import { CancelSmallMinor } from "@shopify/polaris-icons"
import React, { useEffect, useState } from "react"
import { useGQL } from "../hooks/useGQL.js"
import { extractIdNumberFromGid } from "../utils/shopifyGid.js"

export const CarouselProductSelector = ({ upsell, setUpsell }) => {
	const gql = useGQL()

	const [open, setOpen] = useState(false)
	const [productToUpsellTitle, setProductToUpsellTitle] = useState(null)
	const [productToUpsellImage, setProductToUpsellImage] = useState(null)

	const handleSelection = (resources) => {
		setProductToUpsellTitle(resources.selection[0].displayName)
		setProductToUpsellImage(resources.selection[0].image?.originalSrc || "")
		setUpsell({
			upsellProductId: extractIdNumberFromGid(resources.selection[0].product.id),
			upsellVariantId: extractIdNumberFromGid(resources.selection[0].id)
		})
		setOpen(false)
	}

	const deleteSelection = () => {
		setUpsell({ upsellProductId: null, upsellVariantId: null })
		setProductToUpsellTitle(null)
		setProductToUpsellImage(null)
	}

	useEffect(async () => {
		if (upsell.upsellVariantId && !productToUpsellImage) {
			const variantRes = await gql(`
				query {
					productVariant(id: "gid://shopify/ProductVariant/${upsell.upsellVariantId}") {
						displayName
						image {
							url
						}
					}
				}
			`)
			
			if (variantRes?.data?.productVariant?.image?.url) {
				setProductToUpsellImage(variantRes.data.productVariant.image.url)
			} else {
				setProductToUpsellImage(null)
			}
			if (variantRes?.data?.productVariant?.displayName) {
				setProductToUpsellTitle(variantRes.data.productVariant.displayName)
			} else {
				setProductToUpsellTitle(null)
			}
		}
	}, [upsell.upsellVariantId])

	return (
		<div style={{ borderTop: "1px solid #ccc", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
			<div style={{ display: "flex", gap: "1rem", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
				<span className="font-satoshi neu-text neu-text-600" style={{ fontSize: "1.2rem" }}>Upsell Product</span>
				<div className="neu-background neu-shadow neu-border-radius-2 neu-no-border neu-button" onClick={() => setOpen(true)}>
					<span className="font-satoshi neu-text neu-text-600">Add Product</span>
				</div>
			</div>

			{
				upsell.upsellVariantId ?
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
						<div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
							{
								productToUpsellImage && <img className="neu-shadow" style={{ borderRadius: "5px", height: "4rem", width: "4rem", objectFit: "contain", background: "white" }} src={productToUpsellImage} />
							}
							<div style={{ maxWidth: "290px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
								<span className="neu-text font-satoshi" title={productToUpsellTitle || ""} style={{ fontSize: "1rem" }}>{ productToUpsellTitle || "Product Title" }</span>
							</div>
						</div>
						<div className="icon neu-background neu-shadow neu-border-radius-2" style={{ padding: "0.5rem", cursor: "pointer" }} onClick={deleteSelection}>
							<Icon source={CancelSmallMinor} />
						</div>
					</div>
				:
					<p style={{ marginTop: "4rem", marginBottom: "4rem", color: "#ff3838", textAlign: "center" }}>Select an Upsell Product</p>
			}

			<ResourcePicker
				resourceType={"ProductVariant"}
				showVariants={true}
				open={open}
				allowMultiple={false}
				onCancel={() => setOpen(false)}
				onSelection={handleSelection}
			/>
		</div>
	)
}
