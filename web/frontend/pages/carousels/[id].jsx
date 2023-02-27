import { Loading, Page } from "@shopify/polaris"
import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { UpsellEditorStateContext } from "../../components/providers/UpsellEditorStateProvider.jsx"
import { CarouselEditor } from "../../components/CarouselEditor.jsx"
import { useGetUpsellById } from "../../hooks/upsellHooks.js"

const EditUpsell = () => {
	const { id } = useParams()
	const getUpsellById = useGetUpsellById()

	const { upsell, setUpsell } = useContext(UpsellEditorStateContext)
	
	const [loading, setLoading] = useState(true)
	const [upsellNotFound, setUpsellNotFound] = useState(false)

	useEffect(async () => {
		const { upsell: upsellRes } = await getUpsellById(id)
		if (upsellRes) {
			setUpsell(upsellRes)
		} else {
			setUpsellNotFound(true)
		}

		setLoading(false)
	}, [])

	return (
		<Page fullWidth>
			{
				loading ?
					<Loading />
				: upsellNotFound ?
					<div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>Upsell not found</div>
				:
					<CarouselEditor upsell={upsell} setUpsell={setUpsell} newUpsell={false}/>
			}
		</Page>
	)
}

export default EditUpsell
