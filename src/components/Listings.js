import React, { Component } from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom"
import axios from "axios"
import qs from "query-string"
import Item from "./Item.js"
import firebase from "firebase/app"
import FadeIn from "react-fade-in"
import Card from "@material-ui/core/Card"
import { ListingResultsLoader } from "./ContentPlaceholder.js"
import LoadingDotsIcon from "./LoadingDotsIcon"
export default class Listings extends Component {
  constructor() {
    super()
    this.state = {
      itemsData: "",
      view: "box",
      search: "",
      loading: true
    }
    this.formRef = React.createRef()
    this.handleChange = this.handleChange.bind(this)
    this.filteredData = this.filteredData.bind(this)
  }

  addPriceIcon = index => {
    if (this.state.filteredData[index] !== undefined) {
      const { match, history, location } = this.props
      if (match.params.category === "Resources" || match.params.category === "Events" || match.params.listings === "Roommates") {
        return ""
      } else if (match.params.category === "Sale" || (match.params.category === "Housing" && this.state.filteredData[index].listing !== "Roommates")) {
        return "$"
      }
    }
  }
  loopItems = () => {
    const { match, history, location } = this.props
    let listingArray = []
    let noResult = "No Results Found."
    if (this.state.filteredData !== undefined) {
      if (this.state.loading) {
        return <ListingResultsLoader className="results-loader listings-results-loader" />
      }

      let newArray = this.state.filteredData.filter(item => {
        if (!match.params.listings) {
          return match.params.uc === item.school && match.params.category === item.category
        } else {
          return match.params.uc === item.school && match.params.category === item.category && match.params.listings === item.listing
        }
      })
      if (newArray.length === 0) {
        return <div className="noresult">{noResult}</div>
      }
      // else {
      //   return (
      //     <div className="noresult" key={i}>
      //       {noResult}
      //     </div>
      //   )
      // }
      return this.state.filteredData.map((item, i) => {
        var postKeys = Object.keys(item) //keys of individual posts
        if (match.params.uc !== item.school && match.params.listing !== item.listing) {
        }

        if (match.params.uc === item.school) {
          if (match.params.listings === item.listing) {
            listingArray.push(item)
            const newTo = {
              pathname: `/${match.params.uc}/${match.params.category}/${match.params.listings}/${i}`,
              state: { item, priceIcon: this.addPriceIcon(), listingArray }
            }
            return (
              <section className="listloop" key={i}>
                <Link to={newTo}>
                  <div className="item" onClick={() => <Item globalState={this.state} item={item} />}>
                    <div className="image" style={{ backgroundImage: `url('${item.img}')` }}>
                      <p className="price">
                        {this.addPriceIcon(i)}
                        {item.price}
                      </p>
                      <div className="item-desc">
                        <h4>{item.title}</h4>
                        <h6 className="dateposted">Item Posted: {item.date}</h6>
                      </div>
                    </div>
                  </div>
                </Link>
              </section>
            )
          } else if (match.params.category === item.category && match.params.listings === undefined) {
            const newTo = {
              pathname: `/${match.params.uc}/${match.params.category}/${item.listing}/${i}`,
              state: { item, priceIcon: this.addPriceIcon(), listingArray, location: `/${match.params.uc}/${match.params.category}` }
            }
            return (
              <section className="listloop" key={i}>
                <Link to={newTo}>
                  <div className="item" onClick={() => <Item globalState={this.state} item={item} />}>
                    <div className="image" style={{ backgroundImage: `url('${item.img}')` }}>
                      <p className="price">
                        {this.addPriceIcon(i)}
                        {item.price}
                      </p>
                      <div className="item-desc">
                        <h4>{item.title}</h4>
                        <h6>Item Posted: {item.date}</h6>
                      </div>
                    </div>
                  </div>
                </Link>
              </section>
            )
          }
        }
      })
    }
  }

  handleChange = event => {
    //event.target is a reference to object that dispatched the event
    const name = event.target.name
    const value = event.target.type == "checkbox" ? event.target.checked : event.target.value
    this.setState(
      {
        [name]: value
      },
      () => {
        this.filteredData()
      }
    )
  }
  filteredData() {
    if (!this.state.newData) {
      var newData = this.state.postArray.filter((item, i) => {
        var postKeys = Object.keys(item) //keys of individual posts
        //var item = item[postKeys[i]]
        var items = item.title.toLowerCase()
        var listings = item.listing.toLowerCase()
        var searchText = this.state.search.toLowerCase()
        var itemMatch = items.includes(searchText)
        var listingMatch = listings.includes(searchText)
        if (itemMatch || listingMatch) {
          return true
        }
      })
    } else {
      newData = this.state.newData.filter((item, i) => {
        var postKeys = Object.keys(item) //keys of individual posts
        //var item = item[postKeys[i]]
        var items = item.title.toLowerCase()
        var listings = item.listing.toLowerCase()
        var searchText = this.state.search.toLowerCase()
        var itemMatch = items.includes(searchText)
        var listingMatch = listings.includes(searchText)
        if (itemMatch || listingMatch) {
          return true
        }
      })
    }
    if (this.state.sort == "Oldest") {
      newData.sort((a, b) => {
        return a.dateUnix - b.dateUnix
      })
    }
    if (this.state.sort == "Newest") {
      newData.sort((a, b) => {
        return b.dateUnix - a.dateUnix
      })
    }
    if (this.state.sort == "Lowest") {
      newData.sort((a, b) => {
        return a.price - b.price
      })
    }
    this.setState(
      {
        filteredData: newData
      },
      () => {}
    )
  }

  changeView = viewName => {
    this.setState({
      view: viewName
    })
  }
  handleView = () => {
    if (this.state.view == "box") {
      return <section className="all-items box">{this.loopItems()}</section>
    } else if (this.state.view == "list") {
      return (
        <section className="all-items list">
          <div>{this.loopItems()}</div>
        </section>
      )
    }
  }
  submitForm = () => {
    const self = this
    const { match, history, location } = this.props
    const { min_price, max_price, sort } = this.state

    var newData = this.state.postArray.filter((item, i) => {
      return parseInt(item.price) >= (this.state.min_price ? this.state.min_price : 0) && parseInt(item.price) <= (this.state.max_price ? this.state.max_price : Number.MAX_SAFE_INTEGER)
    })

    this.setState({
      newData,
      filteredData: newData
    })

    //    history.push(`/${match.params.uc}/${match.params.category}?min_price=${min_price}&max_price=${max_price}&sort=${sort}`)
    //    document.location.href =
    //        `/${match.params.uc}/${match.params.category}/?min_price=${min_price}&max_price=${max_price}&sort=${sort}`

    const queryParams = qs.parse(this.props.location.search)
  }
  resetData = () => {
    const self = this
    const { match, history, location } = this.props
    const { min_price, max_price, sort } = this.state
    history.push(`/${match.params.uc}/${match.params.category}`)
    var newData = this.state.postArray.filter((item, i) => {
      return true
    })
    this.setState({
      filteredData: newData
    })
  }

  //   toggleFilter = () => {
  //      $('.filter').toggleClass('filter-active');
  //      $('.wrapper').toggleClass('wrapper-active');
  //   }

  componentDidMount() {
    const { match, history, location } = this.props
    if (match.params.category === "Resources" || match.params.category === "Events" || match.params.listings === "Roommates") {
      this.formRef.current.style.display = "none"
    }
  }
  componentDidMount() {
    var ref = firebase.database().ref("users")
    var self = this
    ref.on("value", function (data) {
      var userData = data.val()
      var keys = Object.keys(userData)
      var postArray = []
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i]
        var userPosts = userData[k].Posts
        if (userPosts !== undefined) {
          //the user has atleast 1 post
          for (var prop in userPosts) {
            postArray.push(userPosts[prop])
          }
          var postKeys = Object.keys(userPosts) //keys of individual posts
        } else {
          continue
        }
      }

      self.setState(
        {
          postArray,
          filteredData: postArray
        },
        function () {
          this.setState({ loading: false })
        }
      )
    })
  }

  componentWillUnmount() {
    const ref = firebase.database().ref("users")
    ref.off("value")
  }
  render() {
    return (
      <div className="listings-page">
        <div className="container">
          <section className="list-view">
            <section className="listing-setting">
              <div className="filterwrapper"></div>
              <div className="wrapper">
                <section id="searchview">
                  <input onChange={this.handleChange} className="search" name="search" value={this.state.search} type="text" placeholder="Search for Ads.." />
                  <div className="views">
                    <i className="fas fa-th" onClick={this.changeView.bind(null, "box")}></i>
                    <i className="fas fa-th-list" onClick={this.changeView.bind(null, "list")}></i>
                  </div>
                </section>

                <section className="filter">
                  <section className="formwrapper">
                    <div ref={this.formRef} className="form-group price">
                      <label>Price</label>
                      <div>
                        <input type="text" name="min_price" className="min_price" placeholder="0" onChange={this.handleChange} />
                        <input type="text" name="max_price" className="max_price" placeholder="1000" onChange={this.handleChange} />
                      </div>
                      <div className="button">
                        <div className="primary-btn" onClick={this.submitForm}>
                          Update
                        </div>
                        <div className="reset-btn" onClick={this.resetData.bind(this)}>
                          Reset
                        </div>
                      </div>
                    </div>

                    <div className="form-group sort">
                      <label>Sort By</label>
                      <select name="sort" className="sortBy" onChange={this.handleChange}>
                        <option value="Highest">Relevance</option>
                        <option value="Oldest">Old</option>
                        <option value="Newest">New</option>
                        <option value="Lowest">Price</option>
                      </select>
                    </div>
                  </section>
                </section>
              </div>
            </section>
            <Card>
              <section className="handleView">
                {/* <section className="all-items box">
                  <ListingResultsLoader className="results-loader listings-results-loader" />
                  <ListingResultsLoader className="results-loader listings-results-loader" />
                  <ListingResultsLoader className="results-loader listings-results-loader" />
                </section> */}
                {/* {this.state.loading ? (
                  <section className="all-items box">
                    <ListingResultsLoader className="results-loader listings-results-loader" />
                    <ListingResultsLoader className="results-loader listings-results-loader" />
                    <ListingResultsLoader className="results-loader listings-results-loader" />
                  </section>
                ) : (
                  <FadeIn>{this.handleView()}</FadeIn>
                )} */}
                {console.log("wut", this.state.loading)}
                {this.state.loading ? <LoadingDotsIcon /> : <FadeIn>{this.handleView()}</FadeIn>}
              </section>
            </Card>
          </section>
        </div>
      </div>
    )
  }
}
