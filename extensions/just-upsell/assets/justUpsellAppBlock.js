const domain = "https://api.justupsell.com"

const justUpsellStyles = document.createElement("link")
justUpsellStyles.rel = "stylesheet"
justUpsellStyles.href = `${domain}/checkbox.css`
document.body.append(justUpsellStyles)

const prettyCheckbox = document.createElement("link")
prettyCheckbox.rel = "stylesheet"
prettyCheckbox.href = "https://cdn.jsdelivr.net/npm/pretty-checkbox@3.0/dist/pretty-checkbox.min.css"
document.body.append(prettyCheckbox)

const materialDesignIcons = document.createElement("link")
materialDesignIcons.rel = "stylesheet"
materialDesignIcons.href = "https://cdn.jsdelivr.net/npm/@mdi/font@6.9.96/css/materialdesignicons.min.css"
document.body.append(materialDesignIcons)

const justUpsellScript = document.createElement("script")
justUpsellScript.src = `${domain}/justUpsellScript.js`
// justUpsellScript.async = true
justUpsellScript.defer = true
document.body.append(justUpsellScript)
