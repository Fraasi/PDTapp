/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react'
import * as ReactModal from 'react-modal'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './modal.css'

ReactModal.setAppElement('#root')
const modalCustomStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    height: '55vh',
    overflow: 'visible'
  }
}

class DateInputButton extends Component {
  render() {
    return (
      <button
        type="button"
        className="date-input-button"
        onClick={this.props.onClick}
      >
        {this.props.value}
      </button>
    )
  }
}

class DatePick extends Component {
  render() {
    return (
      <DatePicker
        {...this.props}
        customInput={<DateInputButton />}
        required
        dateFormat="dd/MM/yyyy HH:mm"
        showTimeSelect
        timeCaption="Time"
        timeFormat="HH:mm"
        timeIntervals={30}
        showMonthDropdown
        showWeekNumbers
        shouldCloseOnSelect // doesn't work, oh well?
        popperModifiers={{
          offset: {
            enabled: true,
            offset: '-40px, 0px'
          }
        }}
      />
    )
  }
}

export default class Modal extends Component {
  constructor(props) {
    super(props);
    const {
      title = '', start, end, desc, id
    } = this.props.modalEvent
    this.state = {
      title,
      start,
      end,
      desc,
      id,
    }
  }

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value })
  }

  handleStartDateChange = (newStartDate) => {
    this.setState({ start: newStartDate })
  }

  handleEndDateChange = (newEndDate) => {
    this.setState({ end: newEndDate })
  }

  handleDescChange = (e) => {
    this.setState({ desc: e.target.value })
  }

  handleDeleteButton = () => {
    this.props.handleEventDelete()
    this.props.closeModal()
  }

  handleSubmitButton = (e) => {
    e.preventDefault()
    if (this.state.start > this.state.end) {
      alert('Error, time paradox!!!\nEvent end date can not be earlier than event start date!')
      return
    }
    this.props.handleEventSave(this.state)
    this.props.closeModal()
  }

  render() {
    const { modalIsOpen, closeModal, isNewEvent } = this.props
    const {
 title, start, end, desc
} = this.state
    return (
      <ReactModal
        isOpen={modalIsOpen}
        style={modalCustomStyles}
        shouldCloseOnOverlayClick
        onRequestClose={closeModal}
        closeTimeoutMS={200}
      >
        <form onSubmit={this.handleSubmitButton} className="form-wrapper">
          <div>
            <label>
              Event title
              <input type="text" value={title} onChange={this.handleTitleChange} placeholder="No title" required autoFocus />
            </label>
          </div>
          <br />
          <div>
            <label>
              Event start
              <DatePick
                selected={start}
                onChange={this.handleStartDateChange}
              />
            </label>
          </div>
          <br />
          <div>
            <label>
              Event end
              <DatePick
                selected={end}
                onChange={this.handleEndDateChange}
              />
            </label>
          </div>
          <br />
          <div>
            <textarea onChange={this.handleDescChange} value={desc} placeholder="Event description" />
          </div>
          <div className="modal-buttons">
            {!isNewEvent && <button type="button" onClick={this.handleDeleteButton}>Delete event</button>}
            <button type="button" onClick={closeModal}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </ReactModal>
    )
  }
}
