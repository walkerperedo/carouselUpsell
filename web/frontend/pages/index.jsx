import { useNavigate } from "@shopify/app-bridge-react"
import { Icon, Page, Spinner } from "@shopify/polaris"
import { SettingsMajor } from "@shopify/polaris-icons"
import React, { useContext, useEffect, useState } from "react"
import { GlobalStateContext } from "../components/providers/GlobalStateProvider"
import { StatisticCard } from "../components/StatisticCard.jsx"
import { CarouselsList } from "../components/CarouselsList.jsx"
import { useGetAllStoreUpsells } from "../hooks/upsellHooks.js"
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch.js"

const Dashboard = () => {
	const { state, dispatch } = useContext(GlobalStateContext)
	const navigate = useNavigate()
	const authFetch = useAuthenticatedFetch()
	const getAllUpsells = useGetAllStoreUpsells()

	const [upsells, setUpsells] = useState([])
	const [loadingUpsells, setLoadingUpsells] = useState(true)
	
	const [totalViews, setTotalViews] = useState(0)
	const [totalAddedToCart, setTotalAddedToCart] = useState(0)
	const [totalConversions, setTotalConversions] = useState(0)
	const [totalRevenue, setTotalRevenue] = useState(0)

	const fetchUpsells = () => {
		getAllUpsells()
			.then(({ upsells }) => {
				if (upsells?.length) {
					setUpsells(upsells)
					
					let views = 0
					let addedToCart = 0
					let conversions = 0
					let revenue = 0
	
					for (let upsell of upsells) {
						views += upsell.stats?.views || 0
						addedToCart += upsell.stats?.addedToCart || 0
						conversions += upsell.stats?.conversions || 0
						revenue += upsell.stats?.revenue || 0
					}
	
					setTotalViews(views)
					setTotalAddedToCart(addedToCart)
					setTotalConversions(conversions)
					setTotalRevenue(revenue)
				}
			})
			.catch(err => {
				console.error(err)
			})
			.finally(() => {
				setLoadingUpsells(false)
			})
	}

	useEffect(() => {
		fetchUpsells()
	}, [])

	return (
		<Page fullWidth>
			{
				loadingUpsells ?
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", marginTop: "35vh" }}>
						<Spinner/>
						<span>Loading Upsells...</span>
					</div>
				:
					<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
						<div style={{ width: "850px", paddingBottom: "1rem" }}>
							<h1 className="neu-text font-satoshi" style={{ marginBottom: "2rem", fontStyle: "normal", fontWeight: "400", fontSize: "33px", lineHeight: "39px", color: "#202223" }}>👋 Hi there! Welcome to JustUpsell</h1>

							<div style={{ display: "flex", gap: "1rem", width: "100%" }}>
								<StatisticCard
									statName="impressions"
									title="Impressions"
									data={{ percentage: 30, number: totalViews }}
								/>
								<StatisticCard
									statName="addToCart"
									title="Added to Cart"
									data={{ percentage: 30, number: totalAddedToCart }}
								/>
								<StatisticCard
									statName="conversions"
									title="Conversions"
									data={{ percentage: 30, number: totalConversions }}
								/>
								<StatisticCard
									statName="totalRevenue"
									title="Total Revenue"
									data={{ percentage: 30, number: totalRevenue.toFixed(2) }}
									currency={state.shopCurrency}
								/>
							</div>
							
							<div style={{ marginTop: "3rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between" }}>
								<h1 className="neu-text neu-text-600 font-satoshi" style={{ fontSize: "1.5rem" }}>Your Upsells</h1>
								<div style={{ display: "flex", gap: "1rem" }}>
									<button className="neu-background neu-shadow neu-border-radius-2 neu-no-border" style={{ padding: "0.5rem", cursor: "pointer" }} onClick={() => navigate("/settings")}>
										<Icon color="subdued" source={SettingsMajor} />
									</button>
									<button className="neu-background neu-shadow neu-border-radius-2 neu-no-border" style={{ padding: "0.5rem 1rem", cursor: "pointer" }} onClick={() => navigate("/newCarouselUpsell")}>
										<span className="font-satoshi neu-text neu-text-600" style={{ fontSize: "0.9rem" }}>New Upsell</span>
									</button>
								</div>
							</div>

							<CarouselsList upsells={upsells} setUpsells={setUpsells} />
						</div>
					</div>
			}
		</Page>
	)
}

export default Dashboard
