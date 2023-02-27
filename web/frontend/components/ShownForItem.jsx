import { Icon, SkeletonBodyText } from "@shopify/polaris"
import { CancelSmallMinor } from "@shopify/polaris-icons"
import React, { useEffect, useState } from "react"
import { useGQL } from "../hooks/useGQL.js"

export const ShownForItem = ({ resourceType, resourceId, removeFromSelection }) => {
	const gql = useGQL()

	const [loadingMetadata, setLoadingMetadata] = useState(false)
	const [title, setTitle] = useState(null)
	const [image, setImage] = useState(null)

	useEffect(async () => {
		if (resourceId) {
			setLoadingMetadata(true)

			const query = resourceType === "products" ?
				`query {
					product(id: "gid://shopify/Product/${resourceId}") {
						title
						images(first: 1) {
							nodes {
								url
							}
						}
					}
				}`
			:
				`query {
					collection(id: "gid://shopify/Collection/${resourceId}") {
						title
						image {
							url
						}
					}
				}`

			const res = await gql(query)
			
			setLoadingMetadata(false)

			if (resourceType === "products") {
				if (res?.data?.product?.title) {
					setTitle(res.data.product.title)
				}
				if (res?.data?.product?.images?.nodes?.[0]?.url) {
					setImage(res.data.product.images.nodes[0].url)
				}
			} else {
				if (res?.data?.collection?.title) {
					setTitle(res.data.collection.title)
				}
				if (res?.data?.collection?.image?.url) {
					setImage(res.data.collection.image.url)
				}
			}
		}
	}, [resourceId])
	
	return (
		<div>
			{
				loadingMetadata ?
					<SkeletonBodyText/>
				:
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
						<div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
							<img className="neu-shadow" style={{ borderRadius: "5px", height: "4rem", width: "4rem", objectFit: "contain", background: "white" }} src={image} />
							<div style={{ flex: "1", maxWidth: "290px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
								<span className="neu-text font-satoshi" title={title || ""} style={{ fontSize: "1rem" }}>{ title || "Product Title" }</span>
							</div>
						</div>
						<div className="icon neu-background neu-shadow neu-border-radius-2" style={{ padding: "0.5rem", cursor: "pointer" }} onClick={() => removeFromSelection(resourceId)}>
							<Icon source={CancelSmallMinor} />
						</div>
					</div>
			}
		</div>
	)
}
