export const buildVariantsQuery = (ids) => {
	let query = "query {"

	ids.map((id, i) => {
		query += `
        productVariant${i + 1}: productVariant(id: "gid://shopify/ProductVariant/${id}") {
            title
            image {
                url
            }
            price
            compareAtPrice
            id
          }
        `
	})
	query += "}"
	return query
}
