import React, { Component } from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom"
import Item from "./Item.js"
import firebase from "firebase/app"
import $ from "jquery"
import toastr from "toastr"
import { Img } from "react-image"
import FadeIn from "react-fade-in"
import Card from "@material-ui/core/Card"
import { ImgLoader, ImgTextLoader, ResultLoader } from "./ContentPlaceholder"
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline"
import EditIcon from "@material-ui/icons/Edit"

export default class ManagePosts extends Component {
  constructor() {
    super()
    this.state = { loading: true }
  }
  getUserData = () => {
    var currentUser = firebase.auth().currentUser
    console.log("ayy", currentUser)
    this.setState(
      {
        currentUserName: JSON.parse(localStorage.getItem("classifiedsToken")).displayName,
        currentUserEmail: JSON.parse(localStorage.getItem("classifiedsToken")).email,
        currentUserPhoto: JSON.parse(localStorage.getItem("classifiedsToken")).photoURL
      },
      () => {}
    )
  }
  clearFileInput = () => {
    var newUpload = document.createElement("input")

    newUpload.type = "file"
    newUpload.id = $("#imagefile").id
    newUpload.accept = $("#imagefile").accept
    //newUpload.style.cssText = $('#imagefile').style.cssText;

    newUpload.parentNode.replaceChild(newUpload, $("#imagefile"))
  }
  componentWillMount() {
    if (firebase.auth().currentUser) {
      var currentUser = firebase.auth().currentUser
      this.getUserData()

      var ref = firebase.database().ref("people/" + currentUser.uid + "/posts")
      var self = this
      ref.on("value", function (data) {
        var userData = data.val()
        if (userData !== null) {
          var keys = Object.keys(userData)
        }
        var refArray = []
        for (var key in keys) {
          refArray.push(firebase.database().ref("people/" + currentUser.uid + "/posts/" + key))
        }
        var postArray = []

        if (userData !== undefined) {
          //the user has atleast 1 post
          for (var prop in userData) {
            postArray.push(userData[prop])
          }
        } else {
        }

        self.setState(
          {
            postArray,
            refArray,
            refKeys: keys
          },
          function () {
            setTimeout(() => this.setState({ loading: false }), 1000)
          }
        )
      })
    }
  }
  editPost = index => {
    var self = this
    if (this.state.postArray[index].category === "Events" || this.state.postArray[index].category === "Resources") {
      $(".pricing").css("display", "none")
    } else {
      $(".pricing").css("display", "block")
    }

    $("[name= 'title']").val(this.state.postArray[index].title)
    $("[name= 'description']").val(this.state.postArray[index].description)
    $("[name= 'name']").val(this.state.postArray[index].name)
    $("[name= 'price']").val(this.state.postArray[index].price)
    $("[name= 'phone']").val(this.state.postArray[index].phone)
    $("[name= 'note']").val(this.state.postArray[index].note)

    var imgURL = null
    $(".editimage").on("change", function (event) {
      var userId = firebase.auth().currentUser.uid
      let imageUpload = document.getElementById("imagefile")
      var file = event.target.files[0]
      var filename = file.name
      var storageRef = firebase.storage().ref("/Appimg/" + filename)
      var uploadTask = storageRef.put(file)
      uploadTask.on(
        "state_changed",
        function (snapshot) {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          self.setState({
            progress: progress
          })
          if (progress === 100) {
            setTimeout(function () {
              //toastr.success('Your image has been successfully uploaded.')
            }, 1000)
          }
        },
        function (error) {
          console.log(error)
        },
        function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            imgURL = downloadURL
            self.setState({
              imgURL
            })
          })
        }
      )
    })
    $(".update").on("click", function () {
      var title = $("#title").val()
      var price = $("[name= 'price']").val()
      var description = $("#editdesc").val()
      var name = $(".name").val()
      var phone = $(".phonenum").val()
      var note = $(".notes").val()
      console.log("my price", price)
      console.log(self.state)
      console.log("my references", self.state.refArray[index])
      var editRef = firebase.database().ref("people/" + firebase.auth().currentUser.uid + "/posts/" + self.state.refKeys[index])
      //editRef.remove()
      editRef.update({
        dateUnix: self.state.postArray[index].dateUnix,
        date: self.state.postArray[index].date,
        school: self.state.postArray[index].school,
        category: self.state.postArray[index].category,
        listing: self.state.postArray[index].listing,
        title,
        price,
        description,
        name,
        phone,
        note,
        img: self.state.imgURL != null ? self.state.imgURL : self.state.postArray[index].img
      })

      //toastr.success('Your have successfully edited your post.')
    })
  }
  deletePost = index => {
    var currentUser = firebase.auth().currentUser
    var ref = firebase.database().ref("people/" + currentUser.uid + "/posts")
    var self = this
    ref.once("value", function (data) {
      var userData = data.val()
      if (typeof Object.keys(userData) !== "undefined" && Object.keys(userData).length > 0) {
        var keys = Object.keys(userData)
      }
      firebase
        .database()
        .ref("people/" + currentUser.uid + "/posts/" + keys[index])
        .remove()
    })
    //this.state.refArray[index].remove()
    toastr.success("Your post has been successfully deleted.")
  }

  managePost = () => {
    if (this.state.postArray !== undefined) {
      if (this.state.postArray.length === 0) {
        return <div className="noresult">You do not have any active posts.</div>
      }
      return this.state.postArray.map((item, i) => {
        const newTo = {
          pathname: `/${item.school}/${item.category}/${item.listing}/${i}`,
          state: { item, priceIcon: item.category === "Sale" || item.category === "Housing" ? "$" : "" }
        }

        return (
          <FadeIn key={i}>
            <section className="listloop viewPost box">
              <Card>
                <Link className="link" to={newTo}>
                  <div className="item" onClick={() => <Item globalState={this.state} item={item} />}>
                    <div className="image" style={{ backgroundImage: `url('${item.img}')` }}>
                      <p className="price">
                        {item.category === "Sale" || (item.category === "Housing" && item.listing !== "Roommates") ? "$" : ""}
                        {item.price}
                      </p>
                      <div className="item-desc">
                        <h5>{item.title}</h5>
                        <h6 className="dateposted">Item Posted: {item.date}</h6>
                      </div>
                    </div>
                  </div>
                </Link>
                <span className="editdelete">
                  <a
                    href="#popupEdit"
                    onClick={() => {
                      $("#imagefile").val("")
                      this.editPost(i)
                    }}
                  >
                    <EditIcon />
                  </a>
                  <DeleteOutlineIcon onClick={() => this.deletePost(i)} />
                </span>
              </Card>
            </section>
          </FadeIn>
        )
      })
    }
  }
  checkValidity = event => {
    var name_value = $.trim($(".name").val())
    var phone_value = $.trim($(".phonenum").val())
    var title_value = $.trim($("#title").val())
    var price_value = $.trim($("[name='price']").val())
    var desc_value = $.trim($("#editdesc").val())
    var phoneregex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    if (name_value === "" || phone_value === "" || title_value === "" || desc_value === "") {
      $(".update").attr("disabled", true)
    } else if (phone_value.match(phoneregex) && desc_value.length >= 40) {
      if ($(".pricing").css("display") === "block") {
        if (price_value === "") {
          $(".update").attr("disabled", true)
        } else if (price_value.match(/^\d+$/)) {
          $(".update").attr("disabled", false)
        }
      } else if ($(".pricing").css("display") === "none") {
        $(".update").attr("disabled", false)
      }
    } else {
      $(".update").attr("disabled", true)
    }
  }
  imgPlaceholder = () => <Img src={this.state.currentUserPhoto} loader={<img src={<imgLoader />} />} alt="User Photo" />
  render() {
    console.log(this.state.currentUserPhoto)
    return (
      <div className="managePost" id="managerUser">
        <Card>
          <section>
            <div className="manageUser">
              {/* <div className="userImg">
                <ImgLoader className="img-loader" />
              </div>
              <div className="username">
                <ImgTextLoader />
              </div> */}
              {!this.state.currentUserPhoto ? (
                <>
                  <div className="userImg">
                    <ImgLoader className="img-loader" />
                  </div>
                  <div className="username">
                    <ImgTextLoader />
                  </div>
                </>
              ) : (
                <FadeIn>
                  <div className="userImg">
                    <img src={this.state.currentUserPhoto} alt="User Photo" />
                  </div>
                  <div className="username">{this.state.currentUserName}</div>
                </FadeIn>
              )}
            </div>
            <div className="changePosts">
              <h4>Your Posts</h4>
              <section className="list-view">
                {this.state.loading ? (
                  <>
                    <ResultLoader className="results-loader" />
                    <ResultLoader className="results-loader" />
                    <ResultLoader className="results-loader" />
                    <ResultLoader className="results-loader" />
                    <ResultLoader className="results-loader" />
                    <ResultLoader className="results-loader" />
                    <ResultLoader className="results-loader" />
                    <ResultLoader className="results-loader" />
                  </>
                ) : (
                  this.managePost()
                )}
                {/* <ResultLoader className="results-loader" />
                <ResultLoader className="results-loader" />
                <ResultLoader className="results-loader" />
                <ResultLoader className="results-loader" />
                <ResultLoader className="results-loader" />
                <ResultLoader className="results-loader" />
                <ResultLoader className="results-loader" />
                <ResultLoader className="results-loader" /> */}
              </section>
            </div>
            <div className="popup" id="popupEdit">
              <div className="popup__content" id="popupwrapper">
                <a href="#EditCancel" className="popup__close">
                  &times;
                </a>
                <h3>Edit</h3>
                <form autoComplete="off">
                  <div className="mainwrapper">
                    <section className="first">
                      <div className="wrapper">
                        <input className="pt-input" onChange={this.checkValidity} name="title" id="title" type="text" placeholder="Title" />
                        <label>Title</label>
                      </div>
                      <div className="wrapper">
                        <textarea className="pt-input" onChange={this.checkValidity} id="editdesc" rows="8" cols="37" name="description" type="text" placeholder="Description"></textarea>
                        <label>Description</label>
                      </div>
                      <div className="wrapper pricing">
                        <input className="pt-input price" onChange={this.checkValidity} type="text" name="price" placeholder="Price" />
                        <label>Price</label>
                      </div>
                    </section>
                    <section className="second">
                      <div className="wrapper">
                        <input className="pt-input name" onChange={this.checkValidity} name="name" type="text" placeholder="Name" />
                        <label>Name</label>
                      </div>
                      <div className="wrapper">
                        <input className="pt-input phonenum" onChange={this.checkValidity} name="phone" type="text" placeholder="Phone Number" />
                        <label>Phone Number</label>
                      </div>

                      <div className="wrapper">
                        <input className="pt-input notes" name="note" type="text" placeholder="Note" />
                        <label>Note</label>
                      </div>
                    </section>
                    <div className="blackbox" id="drop-area">
                      <label className="stylefile">
                        {" "}
                        Change Image
                        <input type="file" id="imagefile" className="editimage" accept="image/*"></input>
                      </label>
                      <progress id="uploader" value={this.state.progress} max="100">
                        0%
                      </progress>
                    </div>

                    <a href="#managerUser">
                      <input type="submit" className="submit update" value="Update"></input>
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </Card>
      </div>
    )
  }
}
