import axios from 'axios';
import factory from '../ether/factory'
import Wager from '../ether/wagers'


const FETCH_WAGERS = 'FETCH_WAGERS'
const SORTED_WAGERS = 'SORTED_WAGERS'

export function getSortedWagers(listOfWagers) {
  const action = { type: SORTED_WAGERS, list: listOfWagers }
  return action
}

export function getAllWagers() {
  return async function (dispatch) {
    try {
      const listOfWagersAddresses = await factory.methods.getDeployedwagers().call()
      const listOfWagers = await Promise.all(listOfWagersAddresses.map(async address => {
        const wager = Wager(address)
        const wagerObj = await wager.methods.getWagerSummary().call()
        const wagerInfo = {
          title: wagerObj[6],
          ante: wagerObj[0],
          address: address,
          pot: wagerObj[1],
          complete: wagerObj[7],
          description: wagerObj[8],
          manager: wagerObj[5],
          side1: wagerObj[9],
          side2: wagerObj[10]
        }
        console.log(wagerInfo.complete)
        return wagerInfo
      }))
      const action = { type: FETCH_WAGERS, list: listOfWagers }
      console.log("WE IN HERE")
      dispatch(action)
    } catch (err) {
      console.error(err)
    }
  }
}


export default function reducer(state = [], action) {

  switch (action.type) {

    case FETCH_WAGERS:
      return action.list

    case SORTED_WAGERS:
      return action.list

    default:
      return state;
  }
}
