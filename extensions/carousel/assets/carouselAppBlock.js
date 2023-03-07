const carouselDomain = "https://34ee-181-177-182-31.sa.ngrok.io"

const carouselStyles = document.createElement("link")
carouselStyles.rel = "stylesheet"
carouselStyles.href = `${carouselDomain}/checkbox.css`
document.body.append(carouselStyles)

const materialDesignIconsCarousel = document.createElement("link")
materialDesignIconsCarousel.rel = "stylesheet"
materialDesignIconsCarousel.href = "https://cdn.jsdelivr.net/npm/@mdi/font@6.9.96/css/materialdesignicons.min.css"
document.body.append(materialDesignIconsCarousel)

const carouselScript = document.createElement("script")
carouselScript.src = `${carouselDomain}/carouselScript.js`
// carouselScript.async = true
carouselScript.defer = true
document.body.append(carouselScript)
