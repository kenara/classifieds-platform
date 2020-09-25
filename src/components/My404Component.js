import React, { Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'


export default class My404Component extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
 
  render () {
      	if (this.props.authenticated === true){
            
			return (
               <div className='errorpage' id='unauthorized'>
                   <div className='errorWrapper'>
                    <h3>Sorry!</h3>
                    <p>We could not find the page you were looking for.</p>
		<p className='errorRedirect'>Let us guide you back to the <Link to={'/Homepage'}>Homepage</Link>. </p>	 
                </div>
                </div>
			)
		} 
    return (
       <div className='errorpage' id='unauthorized'>
                   <div className='errorWrapper'>
                    <h3>Sorry!</h3>
                    <p>We could not find the page you were looking for.</p>
		<p className='errorRedirect'>Let us guide you back to the <Link to={'/'}>Homepage</Link>. </p>	 
                </div>
                </div>
            )
  }
}