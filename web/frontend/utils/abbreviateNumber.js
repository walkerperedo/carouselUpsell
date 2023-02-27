export const abbreviateNumber = (number) => {
	return Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 2
	}).format(number)
}