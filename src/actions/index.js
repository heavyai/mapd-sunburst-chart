import {getConnection, getConnectionStatus, saveConnectionObj, getSunburstData} from "../mapd-connector"
import {serverInfo} from "../config";
import vegaSpec from "../vegaspec";

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

  const simplifiedSunburstDataQuery =
      'SELECT Row_ID AS "unique_id", Category AS "category", Sub_Category AS "sub_category", Product_Name AS "name", '+
      'SuperStoreSales."Sales" AS "Sales" '+
      'FROM SuperStoreSales ' +
      'ORDER BY "Sales" DESC LIMIT 200'

  return (dispatch) => {
    getSunburstData(simplifiedSunburstDataQuery, options)
      .then(result => {
        dispatch({
          type: "FETCH_DATA",
          payload: result
        })
      })
      .catch(error => {
        console.log('error: ', error)
      })
  }
}