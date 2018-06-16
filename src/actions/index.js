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

  const sunburstDataQuery =
        'SELECT Category AS "parent", Sub_Category AS "name", Product_Name AS "id", '+
        'SUM(SuperStoreSales."Sales") AS "sum__Sales", '+
        'AVG(SuperStoreSales."Profit") AS "avg__Profit" '+
        'FROM SuperStoreSales GROUP BY "parent", "name", "id" '+
        'ORDER BY "sum__Sales" DESC LIMIT 500'

  // Querying data by a categorical variable and grouping
  const simplifiedSunburstDataQuery =
      'SELECT Row_ID AS "key", Category AS "category", Sub_Category AS "sub_category", Product_Name AS "name", '+
      'SuperStoreSales."Sales" AS "Sales" '+
      'FROM SuperStoreSales ' +
      'ORDER BY "Sales" DESC LIMIT 200'

  return (dispatch) => {
    getSunburstData(simplifiedSunburstDataQuery, options)
      .then(result => {

        //vega sunburst data from vega spec
        const vega_data = vegaSpec(result);

        //creates a nested hierarchical data structure
        const nested_data = d3.nest()
          .key(function (d) {return d.category; })
          .key(function (d) {return d.sub_category; })
          .entries(result)

        //modifying the nested data for d3 sunburst specific
        const d3_data = {"key": "SuperStoreSales", "values": nested_data}

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