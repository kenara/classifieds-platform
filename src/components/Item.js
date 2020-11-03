import React, { Component } from "react"
import ReactDOM from "react-dom"
import axios from "axios"
import { Link } from "react-router-dom"
import { Card } from "@material-ui/core"

export default class Item extends Component {
  constructor() {
    super()
    this.state = {
      routeState: null
    }
  }
  componentDidMount(){
    if (this.props.location.state) {
      localStorage.setItem("routeState", JSON.stringify(this.props.location.state))
      // this.setState({
      //   routeState: this.props.location.state

      // })
    } else {
      // this.setState({
      //   routeState: JSON.parse(localStorage.getItem("routeState"))

      // })
    }
  }

  render() {
   

    const { match, location, history } = this.props
    const { category, description, date, img, listing, name, note, phone, price, school, title } = location.state ? location.state.item : JSON.parse(localStorage.getItem("routeState")).item

    return (
      <div className="itempage">
        <Card>
          <div className="container">
            <section className="submenu">
              <Link to={location.state.location ? location.state.location : `/${match.params.uc}/${match.params.category}/${match.params.listings}`}>
                <i className="fas fa-arrow-left"></i> Back{" "}
              </Link>
              <nav className="sub-link">
                <span id="socialShare"></span>
              </nav>
            </section>
            <div className="wrapper">
              <section className="media-column">
                <div className="gallery">
                  <div className="slider">
                    <div
                      className="main-image"
                      style={{
                        backgroundImage: `url('${img}')`
                      }}
                    ></div>
                  </div>
                  <div className="thumbnails"></div>
                </div>
              </section>
              <section className="details-column">
                <div className="title">
                  <p>Posted {date}</p>
                  <h2>{title}</h2>
                  <h3 className="pricelist">
                    {(match.params.category === "Resources" || match.params.category === "Events") ? "" : "$"}
                    {price}
                  </h3>
                </div>
                <div className="moredetails">
                  <div className="description">
                    <label>Description</label>
                    <p id="desc">{description}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Card>
        <div className="popup" id="contactme">
          <div className="popup__content" id="popupwrapper">
            <a href="#EditCancel" className="popup__close">
              &times;
            </a>
            <h3>Contact</h3>
            <div className="wrapper">
              <section className="contactdetails">
                <div>
                  <label>Name</label>
                  <p>{name}</p>
                </div>
                <div>
                  <label>Phone Number</label>
                  <p>{phone}</p>
                </div>
                <div>
                  <label>Note</label>
                  <p>{note}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
