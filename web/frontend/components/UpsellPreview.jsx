import { Icon, SkeletonBodyText } from "@shopify/polaris"
import { StarFilledMinor } from "@shopify/polaris-icons"
import React, { useContext, useEffect, useState } from "react"
import previewImage from "../assets/previewImage.png"
import { useGQL } from "../hooks/useGQL.js"
import { GlobalStateContext } from "./providers/GlobalStateProvider.jsx"
import { UpsellCheckboxContainer } from "./UpsellCheckboxContainer.jsx"

export const UpsellPreview = ({ upsell }) => {
	const { state, dispatch } = useContext(GlobalStateContext)

	const gql = useGQL()

	const [loadingUpsellProductImage, setLoadingUpsellProductImage] = useState(false)
	const [upsellProductImage, setUpsellProductImage] = useState(null)
	const [upsellProductPrice, setUpsellProductPrice] = useState(null)
	const [upsellProductCompareAtPrice, setUpsellProductCompareAtPrice] = useState(null)
	
	useEffect(async () => {
		if (!upsell.upsellVariantId) return setUpsellProductImage(null)
		
		setLoadingUpsellProductImage(true)
		const variantRes = await gql(`
			query {
				productVariant(id: "gid://shopify/ProductVariant/${upsell.upsellVariantId}") {
					image {
						url
					}
					price
					compareAtPrice
				}
			}
		`)
		setLoadingUpsellProductImage(false)
		
		if (variantRes?.data?.productVariant?.image?.url) {
			setUpsellProductImage(variantRes.data.productVariant.image.url)
		} else {
			setUpsellProductImage(null)
		}

		if (variantRes?.data?.productVariant?.price) {
			setUpsellProductPrice(variantRes.data.productVariant.price)
		}

		if (variantRes?.data?.productVariant?.compareAtPrice) {
			setUpsellProductCompareAtPrice(variantRes.data.productVariant.compareAtPrice)
		}
	}, [upsell.upsellVariantId])

	return (
		<div className="upsell-editor-preview" style={{ display: "flex", alignSelf: "flex-start", position: "sticky", height: "auto", top: "4rem", flex: "1" }}>
			<style type="text/css">{upsell.styling.customCss}</style>
			<div className="neu-background neu-shadow neu-border-radius-1" style={{ display: "flex", padding: "3rem 1rem", width: "100%" }}>

				<div>
					<img src={previewImage} alt="example-image" style={{ width: "20rem" }} />
					<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
						<img src={previewImage} alt="example-image" style={{ width: "4.5rem" }}/>
						<img src={previewImage} alt="example-image" style={{ width: "4.5rem" }}/>
						<img src={previewImage} alt="example-image" style={{ width: "4.5rem" }}/>
					</div>
				</div>

				<div style={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start", width: "290px" }}>
					<h3 style={{ fontWeight: "700", fontSize: "1.5rem", lineHeight: "20px", marginBottom: "1.5rem" }}>Example Product</h3>

					<div style={{ display: "flex" }}>
						{[...Array(5)].map((e, i) => (
							<Icon source={StarFilledMinor} key={`${i}_star`} />
						))}
						<span>15 Reviews</span>
					</div>

					<div style={{ width: "100%", marginTop: "2rem", marginBottom: "2rem" }}>
						<SkeletonBodyText lines={10}/>
					</div>

					<UpsellCheckboxContainer upsell={upsell} upsellProductImage={upsellProductImage} loadingUpsellProductImage={loadingUpsellProductImage} upsellProductPrice={upsellProductPrice} upsellProductCompareAtPrice={upsellProductCompareAtPrice} shopCurrency={state.shopCurrency}/>
					
					<button style={{ width: "100%", background: "black", color: "whitesmoke", border: "none", fontWeight: "400", fontSize: "1rem", lineHeight: "20px", padding: "0.7rem", cursor: "pointer", fontFamily: "satoshi", borderRadius: "5px" }}>Add to Cart</button>
				</div>
			</div>
		</div>
	)
}
