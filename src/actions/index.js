
// export const UPDATE_VEGA_LAYER = 'UPDATE_VEGA_LAYER'
// import {getConnection, getConnectionStatus, renderVega, saveConnectionObj} from "../mapd-connector"
// import { conv4326To900913 } from '../utils'
// import {serverInfo} from "../config";
// import makeVegaSpec from "../vegaspec"


// export function updateVegaLayer(size, extent) {
//
//   const height = size ? size[1] : 692
//   const width = size ? size[0] : 1383
//   // const [xMin, yMin] = conv4326To900913([extent[0], extent[1]])
//   // const [xMax, yMax] = conv4326To900913([extent[2], extent[3]])
//
//   const vegaSpec = makeVegaSpec({
//     width,
//     height,
//     minXBounds: extent ? extent[0] : -27062376.990310084,
//     maxXBounds: extent ? extent[2] : 27062376.990310084,
//     minYBounds: extent ? extent[1] : -13540972.434775544,
//     maxYBounds: extent ? extent[3] : 13540972.434775544
//
//   })
//
//   return (dispatch) => {
//
//     renderVega(vegaSpec)
//       .then(result => {
//         dispatch({
//           type: "UPDATE_VEGA_LAYER",
//           payload: result
//         })
//       })
//       .catch(error => {
//         console.log('error: ', error)
//       })
//
//   }
// }


export function fetchData() {
  return (dispatch) => {
    dispatch({
          type: "FETCH_DATA",
          payload: null
        })
  }
}