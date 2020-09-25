export const initialState = {
  user: JSON.parse(localStorage.getItem("classifiedsToken"))
}
export const actionTypes = {
  SET_USER: "SET_USER"
}

const reducer = (state, action) => {
  console.log("action says", action)
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user
      }
    default:
      return state
  }
}
export default reducer
