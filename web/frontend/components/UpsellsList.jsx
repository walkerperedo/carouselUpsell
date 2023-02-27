import { useNavigate } from "@shopify/app-bridge-react"
import React, { useContext } from "react"
import { GlobalStateContext } from "./providers/GlobalStateProvider.jsx"
import { UpsellsListItem } from "./UpsellsListItem.jsx"

export const UpsellsList = ({ upsells, setUpsells }) => {
	const { state } = useContext(GlobalStateContext)
	const navigate = useNavigate()
		
	return (
		<div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
			{
				upsells.length ?
					upsells.map((upsell, index) => (
						<UpsellsListItem
							upsell={upsell}
							index={index}
							setUpsells={setUpsells}
							key={upsell.id}
							currency={state.shopCurrency}
						/>
					))
				: <div style={{ height: "5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
					You don&apos;t have any Upsells yet. <span style={{ marginLeft: "5px", textDecoration: "underline", cursor: "pointer" }} onClick={() => navigate("/newUpsell")}>Create your first Upsell</span>
				</div>
			}
		</div>
	)

}
