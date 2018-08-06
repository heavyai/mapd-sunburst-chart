import {getConnection, getConnectionStatus, saveConnectionObj, getSunburstData, getTables} from "../mapd-connector"
import {serverInfo} from "../config";
import vegaSpec from "../vegaspec";
import * as d3 from "d3"
export const FETCH_DATA = 'FETCH_DATA'


// connect to the mapd database
export function connectToMapdDatabase() {
  return ()  => {
    getConnection(serverInfo)
      .then(con => {
        // save the connection object so we can use it later
        saveConnectionObj(con)
        return getConnectionStatus(con)
      })
      .catch(error => throw error)
  }
}

export function fetchData() {
  const options = {}
  const tableName = "nyc_trees_2015_683k"
  const dim1 = "boroname"
  const dim2 = "spc_common"
  const dim3 = "health"
  const measure = "block_id"

  const sunburstDataQuery =
        'SELECT Category AS "category", Sub_Category AS "sub_category", Product_Name AS "key", '+
        'SUM(SuperStoreSales."Sales") AS "sum__Sales", '+
        'AVG(SuperStoreSales."Profit") AS "avg__Profit" '+
        'FROM SuperStoreSales GROUP BY "category", "sub_category", "key" '+
        'ORDER BY "sum__Sales" DESC LIMIT 9000'

  const treeSunburstQuery = 'SELECT '+dim1+', '+dim2+', ' +dim3+', ' +measure+' AS "key" FROM '+tableName+' GROUP BY '+dim1+', '+dim2+', '+dim3+' , "key" LIMIT 100'

  const testQuery = 'SELECT '+dim1+', '+dim2+', '+dim3+', COUNT(*) AS val FROM nyc_trees_2015_683k GROUP BY '+dim1+', '+dim2+', '+dim3+' ORDER BY val DESC LIMIT 100'

  return (dispatch) => {

    getSunburstData(treeSunburstQuery, options)
      .then(result => {

        //vega sunburst data from vega spec
        const vega_data = vegaSpec(result);

        //creates a nested hierarchical data structure
        // console.time('timingNest')
        const nested_data = d3.nest()
          .key(function (d) {return d[dim1]; })
          .key(function (d) {return d[dim2]; })
          .key(function (d) {return d[dim3]; })
          .entries(result)
        // console.timeEnd('timingNest')


        //modifying the nested data for d3 sunburst specific
        const d3_data = {"key": tableName, "values": nested_data}

        dispatch({
          type: FETCH_DATA,
          payload: {"vega_data": vega_data, "d3_data": d3_data}
        })

      })
      .catch(error => {
        console.log('error: ', error)
      })
  }
}