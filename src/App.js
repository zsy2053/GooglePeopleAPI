import React, { Component } from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import { Button, Modal, FormControl, DropdownButton, MenuItem } from 'react-bootstrap'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'
import * as actions from './action/index'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      user: {
        first_name: '',
        last_name: '',
        gender: '',
        email: '',
        show_table: false
      }
    }
    this.handleHide = this.handleHide.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.deleteContact = this.deleteContact.bind(this)
    this.handleInfoChange = this.handleInfoChange.bind(this)
    this.createNewContact = this.createNewContact.bind(this)
    this.options = {
      onRowClick: actions.displayMessage,
      onDeleteRow: this.deleteContact
    }
  }
  componentDidMount() {
    let self = this
    actions.new_script('https://apis.google.com/js/client.js')
    setTimeout(function () {
      if (localStorage.getItem("data_global")) {
        self.setState({
          show_table: true
        })
      } else {
        self.setState({
          show_table: false
        })
      }
    }, 0)
  }

  handleHide() {
    this.setState({
      show: false
    })
  }

  handleInfoChange(event, sk) {
    let tmp_state = this.state.user
    let key = ''
    let value = ''
    if (event === "male" || event === "female") {
      value = event
      key = sk.currentTarget.name
    } else {
      key = event.currentTarget.id
      value = event.target.value
    }
    switch (key){
      case "first_name":
          tmp_state.first_name = value
          break
      case "last_name":
          tmp_state.last_name = value
          break
      case "email":
          tmp_state.email = value
          break
      case "gender":
          tmp_state.gender = value
          break
      default:
          break
    }
    this.setState({
      user: tmp_state
    })
  }

  deleteContact(value) {
    actions.deleteContact(value)
  }

  onSubmit() {
    actions.createContact(this.state.user)
  }

  createNewContact() {
    this.setState({
      show: true
    })
  }

  titleCase(input) {
  	input = input.charAt(0).toUpperCase() + input.slice(1);
  	return input
  }

  renderTable() {
    if (this.state.show_table) {
      const tmp_arr = JSON.parse(localStorage.getItem("data_global"))
      return (
              <div>
              <h3 id="title">Check the dot on the left hand side then click the delete button to delete it</h3>
              <BootstrapTable
                options={this.options}
                data={tmp_arr}
                pagination={true}
                deleteRow={ true }
                selectRow={ { mode: 'radio' } }
                >
              <TableHeaderColumn isKey dataField="resourceName">Resource Name</TableHeaderColumn>
              <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='gender'>Gender</TableHeaderColumn>
              <TableHeaderColumn dataField='birthday'>Birthday</TableHeaderColumn>
             </BootstrapTable>
             <Button bsStyle="success" onClick={this.createNewContact}>Create New Contact</Button>
             </div>
           )
    } else {
      return <div></div>
    }
  }

  render() {
    return (
      <div className="App">
      <div id="buttongroup">
        <Button bsStyle="primary" onClick={actions.handleAuthClick} id="authorize_button">Sign In</Button>
        <Button bsStyle="info" className="button is-link" onClick={actions.handleSignoutClick} id="signout_button">Sign Out</Button>
      </div>
      <Modal
        show={this.state.show}
        onHide={this.handleHide}
        container={this}
        aria-labelledby="contained-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">
            Create New Contact
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl type="text" onChange={this.handleInfoChange} id="first_name" label="Enter First Name" placeholder="First Name" />
          <br />
          <FormControl type="text" onChange={this.handleInfoChange} id="last_name" label="Enter Last Name" placeholder="Last Name" />
          <br />
          <FormControl type="text" onChange={this.handleInfoChange} id="email" label="Enter Email" placeholder="Email" />
          <br/>
          <DropdownButton
            bsStyle="default"
            title={this.state.user.gender ? this.titleCase(this.state.user.gender) : "Select Gender"}
            id="gender"
            onSelect={this.handleInfoChange}
          >
            <MenuItem name="gender" eventKey="male">Male</MenuItem>
            <MenuItem name="gender" eventKey="female">Female</MenuItem>
          </DropdownButton>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onSubmit}>Submit</Button>
          <Button onClick={this.handleHide}>Close</Button>
        </Modal.Footer>
      </Modal>
      {this.renderTable()}
      </div>
    );
  }
}

export default App;
