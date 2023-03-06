import React from "react"

export const defaultGlobalState = {
	loadingUserData: true,
	isSubbed: false,
	activePlan: null,
	subbingRequired: false,
	shop: "",
	shopCurrency: "",
	isCurrencyFetched: false,
	hasCompletedInitialSetup: false,
	preferredCarouselPositioning: "before($ADD_TO_CART$)",
}

export const GlobalStateContext = React.createContext(defaultGlobalState)

export const GlobalStateProvider = ({ children }) => {
	const [state, dispatch] = React.useReducer((state, newValue) => {
		return {
			...state,
			...newValue,
		}
	}, defaultGlobalState)

	return <GlobalStateContext.Provider value={{ state, dispatch }}>{children}</GlobalStateContext.Provider>
}
