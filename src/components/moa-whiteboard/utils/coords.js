export function getCoords(svg, pt, evt) {
  pt.x = evt.clientX;
  pt.y = evt.clientY;

  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

export function getSVGScale(svg) {
  return svg.getScreenCTM().inverse().d;
}

export function getPoints(bounds) {
  return {
    tl: { x: bounds.x, y: bounds.y },
    tr: { x: bounds.x + bounds.w, y: bounds.y },
    br: { x: bounds.x + bounds.w, y: bounds.y + bounds.h },
    bl: { x: bounds.x, y: bounds.y + bounds.h },
  };
}
