import React, { Component } from 'react'
import showdown from 'showdown';

showdown.setFlavor('github')
const converter = new showdown.Converter()
// console.log(showdown.getOptions())

export default class Note extends Component {
	constructor() {
		super()
		this.state = {
			notes: [
				{
					title: 'title',
					dateCreated: 123456743,
					rawText: '### otsikko'
				},
				{
					title: 'title2',
					dateCreated: 123423456743,
					rawText: '### otsikko2'
				}
			],
			noteView: 'list',
			currentNote: null,
			// editText: ''
		}
		this.changeEditMode = this.changeEditMode.bind(this)
		this.handleEditing = this.handleEditing.bind(this)
		this.barsClick = this.barsClick.bind(this)
		this.addNewNote = this.addNewNote.bind(this)
		this.deleteNote = this.deleteNote.bind(this)
	}

	barsClick() {
		// save here?
		this.setState({
			noteView: 'list'
		})
	}

	changeEditMode() {
		if (this.state.noteView === 'note') {
			this.setState({
				noteView: 'edit'
			})
		} else if (this.state.noteView === 'edit') {
			this.setState({
				noteView: 'note'
			}, () => {
				// save to store
			})
		}
	}

	handleEditing(e) {
		e.persist()
		const temp = this.state.notes
		temp[this.state.currentNote].rawText = e.target.value
		// eslint-disable-next-line
		temp[this.state.currentNote].title = e.target.value.match(/\w\w+/)[0]
		this.setState({
			notes: temp
		})
	}


	addNewNote() {
		const infoText = '<!-- Untitled, first word on first line will be the title --> \n* click editbutton or press ctrl+enter to save and close edit box\n'

		if (this.state.editMode === true) {
			// eslint-disable-next-line
			document.querySelector('.note-editbox').value = infoText
		}
		// this.setState({ toDoNotes: [...this.state.toDoNotes, newNote]})
		// this.setState({
		// 	dateCreated: Date.now(),
		// 	rawText: infoText,
		// 	editMode: true
		// })
	}

	deleteNote() {
		// eslint-disable-next-line
		const conf = confirm('Are you sure you want to delete this note?')
		// const obj = obj.pop(this.note)
		if (!conf) return

		this.setState(prevState => ({
			currentNote: null,
			noteView: 'list',
			notes: prevState.notes.splice(this.currentNote, 1)
		}))
	}

	selectedNote(index) {
		this.setState({
			currentNote: index,
			noteView: 'note'
		})
	}

	handleDate(now = Date.now()) {
		return new Date(now).toLocaleString('de', { hour12: false }).replace(/\./g, '/')
	}

	parseTitle() {
		return this.state.noteView === 'list' ?
			`${this.state.notes.length} notes - ${this.handleDate()}` :
			`${this.state.notes[this.state.currentNote].title} - ${this.handleDate(this.state.notes[this.state.currentNote].dateCreated)}`
	}

	render() {
		return (

			<div id="note-wrapper">
				<h3 className="note-title">

					{this.parseTitle()}

					<img className="fa-icon plus-square" src="./assets/img/plus-square.svg" alt="plus-square.svg" title="Add new note" style={{ verticalAlign: 'baseline', float: 'left' }} onClick={this.addNewNote} />

					<img className="fa-icon bars" src="./assets/img/bars.svg" alt="bars.svg" title="Notes list" style={{ verticalAlign: 'baseline', float: 'left' }} onClick={this.barsClick} />

					{
						this.state.noteView !== 'list' &&
						<img className="fa-icon minus-square" src="./assets/img/minus-square.svg" alt="minus-square.svg" title="Delete note" style={{ verticalAlign: '10%', float: 'right' }} onClick={this.deleteNote} />
					}

					{
						this.state.noteView !== 'list' &&
						<img className="fa-icon edit" src="./assets/img/edit.svg" alt="edit.svg" title="Edit" style={{ verticalAlign: '10%', float: 'right' }} onClick={this.changeEditMode} />
					}

				</h3>
				{
					this.state.noteView === 'list' &&
					<ol>
					{
						this.state.notes.map((note, i) => <li key={i} onClick={this.selectedNote.bind(this, i)}>{note.title} - {this.handleDate(note.dateCreated)}</li>)
					}
					</ol>
				}
				{
					this.state.noteView === 'note' &&
					// eslint-disable-next-line
					<div className="note-text" dangerouslySetInnerHTML={{ __html: converter.makeHtml(this.state.notes[this.state.currentNote].rawText) }} />
				}
				{
					this.state.noteView === 'edit' &&
					<textarea className="note-editbox" defaultValue={this.state.notes[this.state.currentNote].rawText} onChange={this.handleEditing} autoFocus />
				}

			</div>
		)
	}
}

