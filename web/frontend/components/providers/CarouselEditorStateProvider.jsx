import React from "react"

export const defaultCarouselEditorState = {
	associatedCollectionIds: [],
	displayText: "Text Displayed",
	name: "My Upsell",
	positioning: null,
	published: true,
	shownFor: [],
	stats: {
		addedToCart: 0,
		conversions: 0,
		revenue: 0,
		views: 0,
	},
	styling: {
		showImage: false,
		showCompareAtPrice: false,
		itemBorderRadius: "",
		itemBorderColor: "",
		itemBorderWidth: "",
		itemShadow: "",
		itemBackgroundColor: "",
		itemTextColor: "#fff",
	},
	carouselItems: [],
}

export const CarouselEditorStateContext = React.createContext(defaultCarouselEditorState)

export const CarouselEditorStateProvider = ({ children }) => {
	const [upsell, setUpsell] = React.useReducer((state, newValue) => {
		return {
			...state,
			...newValue,
		}
	}, defaultCarouselEditorState)

	return <CarouselEditorStateContext.Provider value={{ upsell, setUpsell }}>{children}</CarouselEditorStateContext.Provider>
}
