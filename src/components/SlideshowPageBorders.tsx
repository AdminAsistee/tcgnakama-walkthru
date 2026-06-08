export default function SlideshowPageBorders() {
  return (
    <div className="slideshow-page-frame" aria-hidden="true">
      <div className="slideshow-page-frame__edge slideshow-page-frame__edge--top">
        <span className="slideshow-page-frame__line" />
        <span className="slideshow-page-frame__accent slideshow-page-frame__accent--left" />
        <span className="slideshow-page-frame__accent slideshow-page-frame__accent--right" />
      </div>
      <div className="slideshow-page-frame__edge slideshow-page-frame__edge--bottom">
        <span className="slideshow-page-frame__line" />
        <span className="slideshow-page-frame__accent slideshow-page-frame__accent--left" />
        <span className="slideshow-page-frame__accent slideshow-page-frame__accent--right" />
      </div>
    </div>
  )
}
