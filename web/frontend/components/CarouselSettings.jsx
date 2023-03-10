import { Checkbox, Spinner, TextField, Toast } from "@shopify/polaris"
import React, { useCallback, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useCreateCarousel } from "../hooks/carouselHooks.js"
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch.js"
import { ShownForSelector } from "./ShownForSelector.jsx"
import { CarouselProductSelector } from "./CarouselProductSelector.jsx"

export const CarouselSettings = ({ upsell, setUpsell }) => {
	const { id } = useParams()
	const authFetch = useAuthenticatedFetch()
	const navigate = useNavigate()
	const createUpsell = useCreateCarousel()

	return (
		<div style={{ marginTop: "2rem" }}>
			<div style={{ marginTop: "1rem" }}>
				<TextField
					label="Upsell name"
					type="text"
					value={upsell.name}
					onChange={(value) => setUpsell({ name: value })}
					helpText="Title of your Upsell that won't be shown to customers"
				/>
				{!upsell.name && <div style={{ color: "#ff3838" }}>Upsell Name cannot be empty</div>}
			</div>
			<div style={{ marginTop: "1rem" }}>
				<TextField
					label="Display Message"
					type="text"
					value={upsell.displayText}
					onChange={(value) => setUpsell({ displayText: value })}
					helpText="Message that will be displayed next to the checkbox"
				/>
				{!upsell.displayText && <div style={{ color: "#ff3838" }}>Display Message cannot be empty</div>}
			</div>
			<div style={{ marginTop: "1rem" }}>
				<TextField
					label="Products per page"
					type="number"
					max={4}
					min={2}
					value={upsell.itemsPerPage}
					onChange={(value) => setUpsell({ itemsPerPage: value })}
				/>
			</div>
			<div style={{ marginBottom: "1.5rem", marginTop: "1rem" }}>
				<Checkbox label="Auto play" checked={upsell.autoPlay} onChange={(value) => setUpsell({ autoPlay: value })} />
			</div>

			<div style={{ marginBottom: "1.5rem" }}>
				<Checkbox
					label="Show product compare at price"
					checked={upsell.styling.showCompareAtPrice}
					onChange={(value) => setUpsell({ styling: { ...upsell.styling, showCompareAtPrice: value } })}
				/>
			</div>

			<CarouselProductSelector upsell={upsell} setUpsell={setUpsell} />

			<ShownForSelector upsell={upsell} setUpsell={setUpsell} />
		</div>
	)
}
