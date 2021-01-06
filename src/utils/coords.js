export function getCoords(svg, pt, evt) {
  pt.x = evt.clientX
  pt.y = evt.clientY

  return pt.matrixTransform(svg.getScreenCTM().inverse())
}

export function getSVGScale(svg) {
  return svg.getScreenCTM().inverse().d
}