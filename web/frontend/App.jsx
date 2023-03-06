import { NavigationMenu, useNavigate } from "@shopify/app-bridge-react"
import { Frame, Loading, Spinner } from "@shopify/polaris"
import { useContext, useEffect } from "react"
import { BrowserRouter, useLocation } from "react-router-dom"
import "./assets/neumorphism.css"
import "./assets/overrides.css"
import "./assets/responsive.css"
import "./checkbox.css"
import { AppBridgeProvider } from "./components/providers/AppBridgeProvider.jsx"
import { defaultGlobalState, GlobalStateContext, GlobalStateProvider } from "./components/providers/GlobalStateProvider.jsx"
import { PolarisProvider } from "./components/providers/PolarisProvider.jsx"
import { QueryProvider } from "./components/providers/QueryProvider.jsx"
import { CarouselEditorStateProvider } from "./components/providers/CarouselEditorStateProvider.jsx"
import { useAuthenticatedFetch } from "./hooks/useAuthenticatedFetch.js"
import { useCheckSubscription } from "./hooks/useCheckSubscription.js"
import { useGQL } from "./hooks/useGQL.js"
import { InitialSetup } from "./pages/InitialSetup.jsx"
import Routes from "./Routes"
import { appendThirdPartyScripts } from "./utils/appendThirdPartyScripts.js"

const paramsShop = new URL(window.location).searchParams.get("shop") || ""

const App = () => {
	const { state, dispatch } = useContext(GlobalStateContext)

	const location = useLocation()
	const authenticatedFetch = useAuthenticatedFetch()
	const gqlQuery = useGQL()
	const checkSub = useCheckSubscription()
	const navigate = useNavigate()

	const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)")

	const getUserDataFromFirestore = (shop) => {
		if (shop.length > 0) {
			authenticatedFetch(`/api/firestore/getUserData/${shop}`)
				.then((res) => res.json())
				.then((res) => {
					if (res.error) {
						console.error("getUserData error", res.error)
						// Bugsnag.notify({ name: "getUserData error", message: JSON.stringify(res.error) }, (e) => e.addMetadata("shop", { shop }))
						dispatch({ loadingUserData: false })
					} else {
						dispatch({
							loadingUserData: false,
							hasCompletedInitialSetup: res.hasCompletedInitialSetup || defaultGlobalState.hasCompletedInitialSetup,
							preferredCarousellPositioning: res.preferredCarousellPositioning || defaultGlobalState.preferredCarousellPositioning,
						})
					}
				})
				.catch((err) => {
					dispatch({ loadingUserData: false })
					console.error("getUserData catched error", err)
					// Bugsnag.notify({ name: "getUserData catched error", message: err.message, stack: err.stack }, (e) => e.addMetadata("shop", { shop }))
				})
		} else {
			dispatch({ loadingUserData: false })
		}
	}

	const getShopFromGql = async () => {
		const { data, errors } = await gqlQuery(`
			query {
				shop {
					currencyCode
					myshopifyDomain
				}
			}
		`)

		if (data?.shop?.currencyCode) {
			dispatch({
				shopCurrency: data.shop.currencyCode,
				isCurrencyFetched: true,
				shop: data.shop.myshopifyDomain,
			})
		} else if (errors) {
			console.error("getStoreCurrency errors", errors)
			// Bugsnag.notify({ name: "getStoreCurrency errors", message: "getStoreCurrency errors" }, (e) => e.addMetadata("meta", { getStoreCurrencyRes: JSON.stringify({ data, errors }) }))
		}

		if (data?.shop?.myshopifyDomain) {
			return data.shop.myshopifyDomain
		}
	}

	useEffect(async () => {
		if (location.pathname !== "/exitiframe") {
			const { isSubbed, activePlan, subbingRequired } = await checkSub()
			if (!subbingRequired || (subbingRequired && isSubbed)) {
				dispatch({ isSubbed: isSubbed, activePlan: activePlan, subbingRequired: subbingRequired })
				const fetchedShop = await getShopFromGql()
				const shop = paramsShop || fetchedShop || ""
				await getUserDataFromFirestore(shop)
				appendThirdPartyScripts(shop)
			} else {
				dispatch({ isSubbed: isSubbed, subbingRequired: subbingRequired })
			}
		} else {
			dispatch({ loadingUserData: false, isSubbed: true })
		}
	}, [])

	if (
		location.pathname !== "/exitiframe" &&
		!state.loadingUserData &&
		(!state.subbingRequired || (state.subbingRequired && state.isSubbed)) &&
		!state.hasCompletedInitialSetup
	) {
		return <InitialSetup />
	}

	return (
		<Frame>
			{state.loadingUserData ? (
				<Loading />
			) : !state.subbingRequired || (state.subbingRequired && state.state.isSubbed) ? (
				<Routes pages={pages} />
			) : (
				<div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
					<Spinner />
				</div>
			)}
		</Frame>
	)
}

const withProviders = (AppComponent) => () =>
	(
		<PolarisProvider>
			<BrowserRouter>
				<AppBridgeProvider>
					<QueryProvider>
						<GlobalStateProvider>
							<CarouselEditorStateProvider>
								<AppComponent />
								<NavigationMenu
									navigationLinks={[
										{ label: "Dashboard", destination: "/" },
										{ label: "New Upsell", destination: "/newCarouselUpsell" },
										{ label: "Billing", destination: "/billing" },
										{ label: "Settings", destination: "/settings" },
									]}
									matcher={(link, location) => link.destination === location.pathname}
								/>
							</CarouselEditorStateProvider>
						</GlobalStateProvider>
					</QueryProvider>
				</AppBridgeProvider>
			</BrowserRouter>
		</PolarisProvider>
	)

export default withProviders(App)
