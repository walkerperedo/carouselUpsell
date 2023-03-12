import { Select, SkeletonThumbnail, Thumbnail } from "@shopify/polaris"
import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { CarouselEditorStateContext } from "./providers/CarouselEditorStateProvider"
import { GlobalStateContext } from "./providers/GlobalStateProvider"
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide"
import "@splidejs/react-splide/css"
import { useGQL } from "../hooks/useGQL"
import { extractIdNumberFromGid } from "../utils/shopifyGid"
import { NoteMinor } from "@shopify/polaris-icons"
import { buildProductVariantQuery, buildVariantsQuery } from "../utils/buildVariantsQuery"
import CarouselItem from "./CarouselItem"

export const CarouselItemsContainer = (props) => {
	const { shopCurrency } = props

	const { upsell, setUpsell } = useContext(CarouselEditorStateContext)
	const [variants, setVariants] = useState([])

	const [options, setOptions] = useState({
		type: "loop",
		gap: "0.5rem",
		pauseOnHover: true,
		resetProgress: false,
		height: "fit-content",
		perPage: upsell.itemsPerPage,
		arrows: false,
		drag: true,
		autoplay: upsell.autoPlay,
		interval: "5000",
	})

	const gql = useGQL()

	useEffect(async () => {
		if (upsell.carouselItems.length >= 2) {
			const variantRes = await gql(buildProductVariantQuery(upsell.carouselItems))
			const variantInfo = Object.keys(variantRes.data).map((key) => {
				const current = variantRes.data[key]
				return current.variants.nodes.map((variant) => {
					return {
						title: variant.displayName,
						price: variant.price,
						compareAtPrice: variant.compareAtPrice,
						image: variant?.image?.url || null,
						id: variant.id,
					}
				})
			})
			setVariants(variantInfo)
		}
	}, [upsell.carouselItems.length])

	// useEffect(() => {
	// 	setOptions({
	// 		type: "loop",
	// 		gap: "0.5rem",
	// 		pauseOnHover: true,
	// 		resetProgress: false,
	// 		height: "fit-content",
	// 		perPage: upsell.itemsPerPage,
	// 		arrows: false,
	// 		drag: true,
	// 		autoplay: upsell.autoPlay,
	// 		interval: "3000",
	// 	})
	// }, [upsell.autoPlay, upsell.itemsPerPage])

	if (upsell.carouselItems.length < 2) {
		return null
	}

	return (
		<>
			<div className="upsell-label">{upsell.displayText}</div>
			<div style={{ maxWidth: "100%" }}>
				<Splide options={options} aria-labelledby="autoplay-example-heading" hasTrack={false}>
					<div style={{ position: "relative" }}>
						<SplideTrack>
							{variants.map((item) => (
								<CarouselItem variants={item} key={`${item[0].id}carousel`} shopCurrency={shopCurrency} />
							))}
						</SplideTrack>
					</div>

					<div className="splide__progress">
						<div className="splide__progress__bar" />
					</div>
					{/* 
					<button className="splide__toggle">
						<span className="splide__toggle__play">Play</span>
						<span className="splide__toggle__pause">Pause</span>
					</button> */}
				</Splide>
			</div>
		</>
	)
}
