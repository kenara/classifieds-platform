import React, { Component } from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom"
import axios from "./axios"

export default class Homepage1 extends Component {
  constructor() {
    super()
    this.state = {
      schoolData: [
        { name: "Berkeley", slug: "Berkeley" },
        { name: "Davis", slug: "Davis" },
        { name: "Irvine", slug: "Irvine" },
        { name: "Los Angeles", slug: "Los Angeles" },
        { name: "Merced", slug: "Merced" },
        { name: "Riverside", slug: "Riverside" },
        { name: "San Diego", slug: "San Diego" },
        { name: "Santa Barbara", slug: "Santa Barbara" },
        { name: "Santa Cruz", slug: "Santa Cruz" }
      ]
    }
  }

  render() {
    return (
      <div className="home">
        <h3>The Classified Ad Platform for University Students</h3>
        <section className="mainpage">
          <div className="gridwrapper">
            <h5>University of California</h5>
            <section className="schoollist">
              {this.state.schoolData.map((school, index) => {
                return (
                  <Link to={`${school.name}`} key={index} className="button">
                    <p>{school.name}</p>
                  </Link>
                )
              })}
            </section>
          </div>
        </section>
      </div>
    )
  }
}
