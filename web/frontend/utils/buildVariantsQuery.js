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

export const buildProductVariantQuery = (ids) => {
	let query = "query {"

	ids.map((id, i) => {
		query += `
      product${i + 1}: product(id: "gid://shopify/Product/${id}") {
        variants(first: 30) {
          nodes{
            id
            price
            compareAtPrice
            displayName
            image{
              url
            }
          }
        }
      }
    `
	})
	query += "}"

	return query
}
