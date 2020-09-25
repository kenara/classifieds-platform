import React, { createContext, useContext, useReducer } from "react"

const StateContext = React.createContext()

class StateProvider extends React.Component {
  // Context state
  state = {
    user: null,
    setUser: user => {
      this.setState({
        user
      })
    }
  }

  // Method to update state

  render() {
    return <StateContext.Provider value={this.state}>{this.props.children}</StateContext.Provider>
  }
}

export { StateProvider }
export default StateContext
