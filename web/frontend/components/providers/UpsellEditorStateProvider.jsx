import React from "react"

export const defaultUpsellEditorState = {
	associatedCollectionIds: [],
	autoCheck: false,
	displayText: "Text Displayed",
	name: "My Upsell",
	positioning: null,
	priority: 1,
	published: true,
	seeMoreEnabled: false,
	shownFor: [],
	stats: {
		addedToCart: 0,
		conversions: 0,
		revenue: 0,
		views: 0
	},
	styling: {
		checkboxType: "box",
		checkmarkIcon: "check",
		borderType: "squared",
		checkmarkType: "default",
		colorType: "custom",
		customCheckboxColor: "#000",
		customCheckmarkColor: "#fff",
		presetColor: "",
		showImage: false,
		showCompareAtPrice: false,
		customCss: ""
	},
	upsellProductId: null,
	upsellVariantId: null
}

export const UpsellEditorStateContext = React.createContext(defaultUpsellEditorState)

export const UpsellEditorStateProvider = ({ children }) => {
	const [upsell, setUpsell] = React.useReducer((state, newValue) => {
		return {
			...state,
			...newValue,
		}
	}, defaultUpsellEditorState)

	return (
		<UpsellEditorStateContext.Provider value={{ upsell, setUpsell }}>
			{children}
		</UpsellEditorStateContext.Provider>
	)
}
