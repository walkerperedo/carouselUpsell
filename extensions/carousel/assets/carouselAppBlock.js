const carouselDomain = "https://950f-132-251-254-148.sa.ngrok.io"

const carouselStyles = document.createElement("link")
carouselStyles.rel = "stylesheet"
carouselStyles.href = `${carouselDomain}/carousel.css`
document.body.append(carouselStyles)

const materialDesignIconsCarousel = document.createElement("link")
materialDesignIconsCarousel.rel = "stylesheet"
materialDesignIconsCarousel.href = "https://cdn.jsdelivr.net/npm/@mdi/font@6.9.96/css/materialdesignicons.min.css"
document.body.append(materialDesignIconsCarousel)

const splideScript = document.createElement("script")
splideScript.defer = true
splideScript.src = "https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"
document.body.append(splideScript)

const splideCss = document.createElement("link")
splideCss.rel = "stylesheet"
splideCss.href = "https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css"
document.body.append(splideCss)

const carouselScript = document.createElement("script")
carouselScript.src = `${carouselDomain}/carouselScript.js`
// carouselScript.async = true
carouselScript.defer = true
document.body.append(carouselScript)
