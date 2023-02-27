export const extractIdNumberFromGid = (gid) => {
	const extractedId = /\d+/.exec(gid)?.[0]
	return extractedId || ""
}