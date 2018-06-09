import {getConnection, getConnectionStatus, saveConnectionObj, getSunburstData} from "../mapd-connector"
import {serverInfo} from "../config";

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
  const testQuery = "SELECT count(*) AS n FROM flights"

  const sunburstDataQuery =
        'SELECT Category AS "Category", Sub_Category AS "Sub_Category", Product_Name AS "Product_Name", '+
        'SUM(sample_orders."Sales") AS "sum__Sales", '+
        'AVG(sample_orders."Profit") AS "avg__Profit" '+
        'FROM sample_orders GROUP BY "Category", "Sub_Category", Product_Name '+
        'ORDER BY "sum__Sales" DESC LIMIT 50000'

  return (dispatch) => {
    getSunburstData(testQuery, options)
      .then(result => {
        console.log('got query result ', result)
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