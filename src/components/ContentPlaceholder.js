import React from "react"
import ContentLoader from "react-content-loader"

const ImgLoader = props => (
  <ContentLoader speed={2} width={220} height={220} viewBox="0 0 220 220" backgroundColor="#f3f3f3" foregroundColor="#ecebeb" {...props}>
    <circle cx="108" cy="109" r="109" />
  </ContentLoader>
)

const ResultLoader = props => (
  <ContentLoader speed={2} width={400} height={290} viewBox="0 0 450 290" backgroundColor="#f3f3f3" foregroundColor="#ecebeb" {...props}>
    <rect x="33" y="1" rx="5" ry="5" width="400" height="290" />
  </ContentLoader>
)
const ListingResultsLoader = props => (
  <ContentLoader speed={2} width={440} height={250} viewBox="0 0 440 250" backgroundColor="#f3f3f3" foregroundColor="#ecebeb" {...props}>
    <rect x="0" y="1" rx="5" ry="5" width="440" height="250" />
  </ContentLoader>
)
const ImgTextLoader = props => (
  <ContentLoader speed={2} width={300} height={34} viewBox="0 0 405 50" backgroundColor="#f3f3f3" foregroundColor="#ecebeb" {...props}>
    <rect x="25" y="7" rx="2" ry="2" width="350" height="40" />
  </ContentLoader>
)
export { ImgLoader, ImgTextLoader, ResultLoader, ListingResultsLoader }
