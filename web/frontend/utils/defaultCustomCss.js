export const defaultCustomCss = (upsellId) => {
	return `#justUpsell-${upsellId}.upsell-checkbox-container {
	box-sizing: content-box;
	min-height: 35px;
	display: flex;
	padding: 7px 0px;
	justify-content: space-between;
	width: 100%;
	gap: 5px;
	align-items: center;
	font-size: 16px;
}

#justUpsell-${upsellId} .upsell-checkmark-container {
	display: flex;
	gap: 5px;
	flex-direction: row;
}

#justUpsell-${upsellId} .upsell-showImage .upsell-checkmark-container {
	flex-direction: column;
}

#justUpsell-${upsellId} .upsell-label {
	font-size: 16px;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	padding-bottom: 2px;
	white-space: normal;
}

#justUpsell-${upsellId} .upsell-price-container {
	padding-left: 0px;
}

#justUpsell-${upsellId} .upsell-showImage .upsell-price-container {
	padding-left: 23px;
}

#justUpsell-${upsellId} .pretty.p-switch .upsell-price-container {
	padding-left: 40px;
}

#justUpsell-${upsellId} .upsell-price {
	font-size: 15px;
	font-weight: 500;
}

#justUpsell-${upsellId} .upsell-compareAtPrice {
	font-size: 13px;
	font-weight: 400;
	text-decoration: line-through;
	opacity: 0.5;
	margin-left: 5px;
}

#justUpsell-${upsellId} .upsell-checkbox-image {
	border-radius: 5px;
	height: 40px;
	width: 40px;
	object-fit: contain;
	background: white;
	box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.1);
}


#justUpsell-${upsellId} .upsell-seeMore-button {
	min-width: fit-content;
	font-size: 14px;
	padding: 0px 5px;
	cursor: pointer;
	text-decoration: underline;
}

#justUpsell-${upsellId} .upsell-modal-container {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 99;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	backdrop-filter: blur(8px);
	padding: 30px;
	box-sizing: border-box;
}

#justUpsell-${upsellId} .upsell-modal-inner-container {
	position: relative;
	width: 500px;
	background-color: white;
	border-radius: 10px;
	box-shadow: 2px 8px 24px rgba(0, 0, 0, 0.12), inset 0px 2px 0px #FFFFFF;
	padding: 20px;
}

#justUpsell-${upsellId} .upsell-showImage .upsell-modal-inner-container {
	width: 700px;
}

#justUpsell-${upsellId} .upsell-modal-content {
	display: flex;
	gap: 30px;
}

#justUpsell-${upsellId} .upsell-modal-content > div {
	width: 100%;
}

#justUpsell-${upsellId} .upsell-showImage .upsell-modal-content > div {
	width: 50%;
}

.upsell-modal-details {
	display: flex;
	flex-direction: column;
}

#justUpsell-${upsellId} .upsell-modal-title {
	font-size: 30px;
	font-weight: 800;
	line-height: 30px;
}

#justUpsell-${upsellId} .upsell-modal-description {
	display: -webkit-box;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

#justUpsell-${upsellId} .upsell-modal-image-container {
}

#justUpsell-${upsellId} .upsell-modal-image {
	border-radius: 10px;
	width: 100%;
	object-fit: contain;
	background: white;
}

#justUpsell-${upsellId} .upsell-showImage .upsell-modal-container .upsell-price-container {
	padding-left: 0px;
}

#justUpsell-${upsellId} #upsell-modal-addToCart-button-container {
	margin-top: 20px;
	box-sizing: border-box;
}

#justUpsell-${upsellId} .upsell-modal-closeButton {
	font-family: Arial,sans-serif;
	color: #333;
	background: 0 0;
	position: absolute;
	right: -10px;
	top: -10px;
	font-size: 22px;
	text-align: center;
	text-decoration: none;
	font-weight: 700;
	box-shadow: none;
	border: none;
	cursor: pointer;
	background: #eee;
	line-height: 0px;
	padding: 15px 8px 14px 8px;
	border-radius: 25px;
}

#justUpsell-${upsellId} .upsell-button-charging {
	cursor: wait;
}


@media only screen and (max-width: 800px) {
	#justUpsell-${upsellId} .upsell-modal-container {
		align-items: unset !important;
	}

	#justUpsell-${upsellId} .upsell-modal-inner-container {
		width: 100% !important;
		height: 100% !important;
	}

	#justUpsell-${upsellId} .upsell-modal-content {
		flex-direction: column !important;
		height: 100% !important;
		gap: 15px !important;
	}

	#justUpsell-${upsellId}.upsell-showImage .upsell-modal-image-container {
		height: 30% !important;
	}

	#justUpsell-${upsellId}.upsell-showImage .upsell-modal-details {
		height: 70% !important;
	}

	#justUpsell-${upsellId} .upsell-modal-image-container {
		width: 100% !important;
	}

	#justUpsell-${upsellId} .upsell-modal-image {
		height: 100% !important;
		width: 100% !important;
	}
	
	#justUpsell-${upsellId} .upsell-modal-details {
		width: 100% !important;
		height: 100% !important;
	}

	#justUpsell-${upsellId} .upsell-modal-title, #justUpsell-${upsellId} .upsell-modal-description {
		-webkit-line-clamp: 6;
	}

	#justUpsell-${upsellId}.upsell-showImage .upsell-modal-title, #justUpsell-${upsellId}.upsell-showImage .upsell-modal-description {
		-webkit-line-clamp: 4;
	}

	#justUpsell-${upsellId} #upsell-modal-addToCart-button-container {
		margin-top: auto !important;
	}
}


#justUpsell-${upsellId} .pretty {
	width: 100% !important;
	overflow: hidden !important;
	margin-right: 0px !important;
	padding-top: 2px !important;
	padding-bottom: 2px !important;
}

#justUpsell-${upsellId} .pretty .state::before {
	top: 0px !important;
}

#justUpsell-${upsellId} .pretty .state label::after, .pretty .state label::before {
	top: 1px !important;
	height: 18px !important;
	width: 18px !important;
}

#justUpsell-${upsellId} .pretty.p-icon .state .icon {
	top: 1px !important;
	width: 18px !important;
	height: 18px !important;
}

#justUpsell-${upsellId} .pretty.pretty.p-switch {
	padding-top: 5px !important;
}

#justUpsell-${upsellId} .pretty.p-switch .state label::before, .pretty.p-switch .state label::after {
	top: 0.5px !important;
}

#justUpsell-${upsellId} .pretty.p-switch.p-slim .state::before {
	top: calc(50% - 0.1rem) !important;
}

#justUpsell-${upsellId} .pretty.p-default input:checked ~ .state.custom-color label::before {
	background-color: var(--custom-checkbox-color) !important;
}

#justUpsell-${upsellId} .pretty.p-default input:checked ~ .state.custom-color label::after {
	background-color: var(--custom-checkmark-color) !important;
}

#justUpsell-${upsellId} .pretty.p-switch input:checked ~ .state.custom-color::before {
	border-color: var(--custom-checkbox-color) !important;
}

#justUpsell-${upsellId} .pretty.p-switch input:checked ~ .state.custom-color label::after {
	background-color: var(--custom-checkmark-color) !important;
}

#justUpsell-${upsellId} .pretty.p-switch.p-fill input:checked ~ .state.custom-color::before {
	background-color: var(--custom-checkbox-color) !important;
}

#justUpsell-${upsellId} .pretty.p-switch.p-fill input:checked ~ .state.custom-color label::after {
	background-color: var(--custom-checkmark-color) !important;
}

#justUpsell-${upsellId} .pretty.p-switch.p-slim input:checked ~ .state.custom-color::before {
	background-color: var(--custom-checkbox-color) !important;
	border-color: var(--custom-checkbox-color) !important;
}

#justUpsell-${upsellId} .pretty.p-switch.p-slim input:checked ~ .state.custom-color label::after {
	background-color: var(--custom-checkmark-color) !important;
}

#justUpsell-${upsellId} .pretty.p-icon .state:not(.custom-color) .icon::before {
	color: unset !important;
	background: unset !important;
}

#justUpsell-${upsellId} .pretty.p-icon input:checked ~ .state.custom-color i {
	border: none !important;
}

#justUpsell-${upsellId} .pretty.p-icon input:checked ~ .state.custom-color i::before {
	background-color: var(--custom-checkbox-color) !important;
	color: var(--custom-checkmark-color);
}

#justUpsell-${upsellId} .pretty.p-icon.p-curve input:checked ~ .state.custom-color i::before {
	border-radius: 20% !important;
}

#justUpsell-${upsellId} .pretty.p-icon.p-round input:checked ~ .state.custom-color i::before {
	width: 150% !important;
	height: 150% !important;
	margin-top: -5px !important;
	margin-left: -5px !important;
}


#justUpsell-${upsellId} .upsell-skeleton-loader {
	width: 100%;
	background: #d9d9d9;
	color: transparent;
	border-radius: 5px;
	height: 25px;
	margin: 15px 0px;
	overflow: hidden;
	position: relative;
}

#justUpsell-${upsellId} .upsell-skeleton-loader::before {
	position: absolute;
	content: "";
	height: 100%;
	width: 100%;
	background-image: linear-gradient(to right, #d9d9d9 0%, rgba(0,0,0,0.07) 20%, #d9d9d9 40%, #d9d9d9 100%);
	background-repeat: no-repeat;
	background-size: 450px 400px;
	animation: shimmer 1s linear infinite;
}

@keyframes shimmer {
	0% {
		background-position: -450px 0;
	}
	100% {
		background-position: 450px 0;
	}
}
`
}