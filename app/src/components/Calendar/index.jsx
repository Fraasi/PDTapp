/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react'
// import { Calendar } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react'
import interaction from '@fullcalendar/interaction'
import gbLocale from '@fullcalendar/core/locales/en-gb'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import momentPlugin from '@fullcalendar/moment'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'
import '@fullcalendar/list/main.css'
import Modal from './Modal.jsx'
import events from '../../assets/events.js'
import './styles.css'


export default class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events,
      modalIsOpen: false,
      isNewEvent: false,
      modalEvent: {
        title: '',
        start: null,
        end: null,
        desc: '',
        id: null
      },
    }
  }

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state
    const idx = events.indexOf(event)
    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }
    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents,
    })
  }

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => (existingEvent.id === event.id
      ? { ...existingEvent, start, end }
      : existingEvent))

    this.setState({
      events: nextEvents,
    })
  }

  selectSlot = (event) => {
    this.setState({ isNewEvent: true })
    event.start = event.slots[0]
    event.end = event.slots[event.slots.length - 1]
    this.openModal(event)
  }

  selectEvent = (event) => {
    this.setState({ isNewEvent: false })
    this.openModal(event)
  }

  openModal = (event) => {
    const id = event.id ? event.id : Date.now()
    this.setState({
      modalIsOpen: true,
      modalEvent: {
        ...event,
        id
      }
    });
  }

  getEventStyle(event, start, end, isSelected) {
    const style = {}
    const todayDate = new Date().getDate()

    if (start.getDate() === todayDate) {
      style.backgroundColor = 'green'
    } else if (start.getDate() < todayDate) {
      style.backgroundColor = 'red'
    } else if (start.getDate() > todayDate) {
      style.backgroundColor = 'blue'
    }
    if (event.bgcolor) {
      style.backgroundColor = event.bgcolor
    }

    return { style }
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  handleModalEventEdit = (key, newValue) => {
    const newData = { ...this.state.modalEvent }
    newData[key] = newValue
    this.setState({
      modalEvent: newData
    })
  }

  handleEventSave = (newEvent) => {
    const index = this.state.events.findIndex(event => event.id === newEvent.id)
    if (index > -1) {
      const newEvents = this.state.events
      newEvents[index] = { ...newEvent }
      this.setState({
        events: newEvents
      })
    } else {
      this.setState({
        events: [
          ...this.state.events,
          { ...newEvent },
        ],
      })
    }
  }

  handleEventDelete = () => {
    const index = this.state.events.findIndex(event => event.id === this.state.modalEvent.id)
    if (index > -1) {
      const newEvents = this.state.events
      newEvents.splice(index, 1)
      this.setState({
        events: newEvents
      })
    }
  }

  // full handlers
  handleDateClick = (arg) => {
    console.log('arg:', arg)
  }

  handleEventClick = (arg) => {
    console.log('arg:', arg)
    this.openModal(arg.event)
    // opens events in a popup window
    // window.open(arg.event.url, 'google-calendar-event', 'width=700,height=600');
    arg.jsEvent.preventDefault() // don't navigate in main tab
  }

  render() {
    return (
      <div className="view-container">
        <FullCalendar
          // events={events}
          eventSources={[
            // events,
            {
              googleCalendarId: process.env.CALENDAR_ID,
              className: 'gcal-event '
            }
          ]}
          plugins={[interaction, dayGridPlugin, timeGridPlugin, listPlugin, momentPlugin, googleCalendarPlugin]}
          googleCalendarApiKey={process.env.GC_APIKEY}
          defaultView="timeGridWeek"
          header={{
            left: 'title',
            center: 'listMonth,dayGridMonth,timeGridWeek', // timeGridDay',
            right: 'today prev,next'
          }}
          views={{
            timeGridWeek: {
              columnHeaderFormat: 'dd D/M',
            }
          }}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}
          minTime="10:00:00"
          maxTime="22:00:00"
          height={() => window.innerHeight - 35}
          nowIndicator
          themeSystem="darkly"
          weekNumbers
          weekNumbersWithinDays
          editable
          eventLimit
          allDaySlot={false}
          locale={gbLocale}
          firstDay={1}
          buttonIcons={false}
          dateClick={this.handleDateClick}
          eventClick={this.handleEventClick}
        />
        <Modal
          modalIsOpen={this.state.modalIsOpen}
          closeModal={this.closeModal}
          handleModalEventEdit={this.handleModalEventEdit}
          modalEvent={this.state.modalEvent}
          handleEventSave={this.handleEventSave}
          handleEventDelete={this.handleEventDelete}
          isNewEvent={this.state.isNewEvent}
          key={this.state.modalEvent.id}
        />
      </div>
    )
  }
}
