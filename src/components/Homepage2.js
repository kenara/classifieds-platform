import React, { Component } from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom"
import axios from "./axios"
import firebase from "firebase/app"
import $, { jQuery } from "jquery"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import LoadingDotsIcon from "./LoadingDotsIcon"

export default class Homepage2 extends Component {
  constructor() {
    super()
    this.state = {
      categoriesData: [
        {
          title: "Sale",
          listings: [
            { name: "General", slug: "General" },
            { name: "Books", slug: "Books" },
            { name: "Classroom Items", slug: "Classroom Items" },
            { name: "Household Items", slug: "Household Items" },
            { name: "Clothing", slug: "Clothing" },
            { name: "Bikes", slug: "Bikes" },
            { name: "Electronics", slug: "Electronics" },
            { name: "Tickets", slug: "Tickets" },
            { name: "Cars", slug: "Cars" }
          ]
        },
        {
          title: "Housing",
          listings: [
            { name: "House for rent", slug: "House for rent" },
            { name: "Apt for rent", slug: "Apt for rent" },
            { name: "Room for rent", slug: "Room for rent" },
            { name: "Roommates", slug: "Roommates" }
          ]
        },
        {
          title: "Resources",
          listings: [
            { name: "Class Notes", slug: "Class Notes" },
            { name: "Internships", slug: "Internships" },
            { name: "Scholarships", slug: "Scholarships" },
            { name: "Tutoring", slug: "Tutoring" },
            { name: "Lost and Found", slug: "Lost and Found" }
          ]
        },
        {
          title: "Events",
          listings: [
            { name: "General", slug: "General" },
            { name: "Parties", slug: "Parties" }
          ]
        }
      ],
      search: ""
    }
    this.handleSearchInput = this.handleSearchInput.bind(this)
    this.showPosts = this.showPosts.bind(this)
  }
  loopCategories = () => {
    const { match, history } = this.props
    //if promise gave back our data...
    if (this.state.categoriesData != "") {
      //index every category title
      return this.state.categoriesData.map((category, i) => {
        //method to index every category listing
        const loopListings = () => {
          return category.listings.map((listing, index) => {
            return (
              //link to listings page on click
              <a href={`/${this.props.match.params.uc}/${category.title}/${listing.slug}`} className="link" key={index}>
                <Button>{listing.name}</Button>
              </a>
            )
          })
        }
        return (
          <Card key={i}>
            <div className="categories">
              <a href={`/${match.params.uc}/${category.title}`} className="title">
                {category.title}
              </a>
              <div className={`group-links`}>{loopListings()}</div>
            </div>
          </Card>
        )
      })
    }
  }
  handleSearchInput = event => {
    const name = event.target.name
    const value = event.target.value
    var myNode = document.getElementById("displaySearchResults")
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild)
    }
    // if (value == "") {
    //   $("#displaySearchResults").css("display", "none")
    // } else {
    //   $("#displaySearchResults").css("display", "block")
    // }

    this.setState(
      {
        [name]: value
      },
      () => {
        this.filterSearchResults()
      }
    )
  }
  filterSearchResults = () => {
    if (this.state.filteredData !== undefined) {
      var listingObj = {}
      var itemProp = {}
      var results = document.getElementById("displaySearchResults")
      var counter = 0
      var newData = this.state.filteredData.filter((item, i) => {
        if (this.props.match.params.uc === item.school) {
          var items = item.title.toLowerCase()
          var listings = item.listing.toLowerCase()
          var searchText = this.state.search.toLowerCase()
          var itemMatch = items.includes(searchText)
          var listingMatch = listings.includes(searchText)
          if (itemMatch) {
            //|| listingMatch

            if (listingObj.hasOwnProperty(item.listing)) {
              listingObj[item.listing].count += 1
            } else {
              listingObj[item.listing] = {
                count: 1,
                searchCategory: item.category,
                searchListing: item.listing
              }
            }

            console.log("my obj", listingObj)
            return true
          } else {
          }
        }
      })
      if (jQuery?.isEmptyObject(listingObj)) {
        var para = document.createElement("p")

        para.innerHTML = `No results found for your search.`
        document.getElementById("displaySearchResults").appendChild(para)
      }
      for (var prop in listingObj) {
        if (listingObj[prop].count != 0) {
          var div = document.createElement("a")
          div.class = "searchResult"
          let newTo = {
            pathname: `/${this.props.match.params.uc}/${listingObj[prop].searchCategory}/${listingObj[prop].searchListing}`,
            state: {
              searchText: this.state.search
            }
          }

          console.log("properties", listingObj[prop])
          let m = `${listingObj[prop].count} found in the ${prop} listing Wall`
          div.href = `/${this.props.match.params.uc}/${listingObj[prop].searchCategory}/${listingObj[prop].searchListing}`
          // let l = `<Link to={${newTo}}>${m}</Link>`
          div.innerHTML = `<a>${m}</a>`

          document.getElementById("displaySearchResults").appendChild(div)
        }
        $("#displaySearchResults").css("border-radius", "5px")
        $("#displaySearchResults").css("background-color", "$color-offwhite")

        this.setState(
          {
            searchData: newData
          },
          () => {
            if (this.state.searchData) {
              $("#displaySearchResults").css("display", "block")
            } else {
              $("#displaySearchResults").css("display", "none")
            }
          }
        )
      }
    }
  }

  showPosts = function (data) {
    var self = this
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
      () => {}
    )
  }

  componentWillMount() {
    var self = this
    var ref = firebase.database().ref("users")
    ref.on("value", data => this.showPosts(data))
    // axios
    //   .get("/api/categories")
    //   .then(function (response) {
    //     self.setState({
    //       categoriesData: response.data
    //     })
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   })
  }
  componentWillUnmount() {
    const ref = firebase.database().ref("users")
    ref.off("value")
  }

  render() {
    const { match, history } = this.props
    return (
      <div className="home">
        <section className="searchsection">
          <div className="search">
            <input onChange={this.handleSearchInput} type="text" name="search" placeholder="You search, we fetch..." />
            <i className="fas fa-search"></i>
          </div>
          <div id="displaySearchResults"></div>
        </section>
        <section className="category">
          <div>
            {this.state.categoriesData.map((category, index) => {
              return (
                <Card key={index}>
                  <div className="categories">
                    <Link to={`/${match.params.uc}/${category.title}`} className="title">
                      {category.title}
                    </Link>
                    <div className={`group-links`}>
                      {category.listings.map((listing, index) => {
                        return (
                          <Link to={`/${this.props.match.params.uc}/${category.title}/${listing.slug}`} className="link" key={index}>
                            <Button>{listing.name}</Button>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      </div>
    )
  }
}
