const COMPASS_POINTS = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"]

export const directionFormatter = (direction) => {
  return COMPASS_POINTS[Math.round((direction % 360) / 22.5)]
};

export default {
  directionFormatter,
}
