import MapDCon from '@mapd/connector/dist/browser-connector'
import {serverInfo} from "./config";

const connector = new MapdCon()
let savedConnection = null

function establishConnection(config) {
  return new Promise((resolve, reject) => {
    connector
        .protocol(config.protocol)
        .host(config.host)
        .port(config.port)
        .dbName(config.database)
        .user(config.username)
        .password(config.password)
        .connect((error, con) => {
          if (error) {
            console.log('connect error ', error)
            reject(error)
          } else if (con) {
            console.log(con)
            resolve(con)
          }
        })
  })
}

async function getConnection(config) {
  try {
    const result = await establishConnection(config)
    return result
  } catch(error) {
    return error
  }
}

async function getConnectionStatus(con) {
  try {
    let result = await con.getStatusAsync()
    return result
  } catch(error) {
    return error
  }
}

// store the connection once we've established it
function saveConnectionObj(con) {
  savedConnection = con
}

async function getSunburstData(query, options) {
  let promise = new Promise((resolve, reject) => {
    savedConnection.query(query, options, function (err, res) {
      if (err) {
        reject(err.message)
      }
      resolve(res)
    })
  })
  let result = await promise
  return result
}

export {
  getConnection,
  getConnectionStatus,
  saveConnectionObj,
  getSunburstData
}
