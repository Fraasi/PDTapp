/* eslint-disable */
import { existsSync } from 'fs';
import path from 'path';
import { shell } from 'electron';
import $ from 'jquery';
import fullCalendar from 'fullcalendar'

let calendarData = []
if (existsSync(path.join(__dirname, '../assets/calendar-data.js'))) {
	calendarData = require('../assets/calendar-data.js').calendarData
}

export default () => {
	const tooltip = $('#tooltip');

	// recurring yearly
	const today = new Date();
	const currYear = today.getFullYear();
	calendarData.forEach((event, i) => {
		if (event.className === 'yearly' && new Date(event.start) < today) {
			calendarData[i].start = new Date(event.start).setFullYear(currYear + 1);
			calendarData[i].end = new Date(event.end).setFullYear(currYear + 1);
		}
	});

	$('#calendar').fullCalendar({

		customButtons: {
			addEventButton: {
				text: 'Add event',
				click() {
					alert('clicked the custom button!');
				},
			},
			homeButton: {
				text: 'home',
				click() {
					alert('clicked the home button!');
				},
			},

		},
		// header: { center: 'addEventButton' },
		footer: {
			left: 'homeButton',
			center: 'month, agendaWeek, list',
			right: 'addEventButton',
		},
		views: {
			month: {
				titleFormat: 'YYYY, MMMM',
				weekNumbers: true,
			},
			agendaWeek: {
				minTime: '10:00:00',
				maxTime: '24:00:00',
				allDaySlot: false,
				slotDuration: '01:00:00',
				displayEventTime: false,
				contentHeight: 'auto',
			},
			list: {
				// show all year from now
				visibleRange(currentDate) {
					return {
						start: currentDate.clone().subtract(1, 'days'),
						end: currentDate.clone().add(1, 'year'), // exclusive end, so 3
					};
				},
			},
		},

		defaultView: 'list',
		editable: false,
		firstDay: 1,
		height: 'parent',
		events: calendarData,
		eventBackgroundColor: '#dddd',

		eventClick(event) {
			if (event.url) {
				shell.openExternal(event.url);
				return false;
			}
		},

		eventMouseover(event, jsEvent, view) {
			if (!(view.type === 'list')) {
				const html = view.type === 'agendaWeek' ?
					`${event.title}<br><br>${$.fullCalendar.moment(event.start).format('k:mm')} - ${$.fullCalendar.moment(event.end).format('k:mm')}` :
					`${event.title}<br><br>date: ${$.fullCalendar.moment(event.start).format('MMM, Do')}<br>${$.fullCalendar.moment(event.start).format('k:mm')} - ${$.fullCalendar.moment(event.end).format('k:mm')}`;

				tooltip.html(html);
				tooltip.css({
					display: 'block',
					left: jsEvent.clientX - 50,
					top: jsEvent.clientY - 110,
				});
			}
		},

		eventMouseout(event, jsEvent, view) {
			if (!(view.type === 'list')) {
				$('#tooltip').css('display', 'none');
			}
		},

		eventRender(event, element, view) {
			if ((view.type === 'month' || view.type === 'list') && event.className.includes('weekly')) {
				return false;
			}
		},
	});
}

