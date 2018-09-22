import React, { Component } from 'react'
import showdown from 'showdown'
import Store from 'electron-store'

showdown.setFlavor('github')
const converter = new showdown.Converter()
// console.log(showdown.getOptions())
const store = new Store({ name: 'pdtapp-config' })

export default class Notebook extends Component {
	constructor() {
		super()
		this.state = {
			notes: store.get('notes'),
			noteView: 'list',						// 'list', 'note', 'edit'
			currentNote: null,
		}
		this.changeEditMode = this.changeEditMode.bind(this)
		this.handleEditing = this.handleEditing.bind(this)
		this.listBarsClick = this.listBarsClick.bind(this)
		this.addNewNote = this.addNewNote.bind(this)
		this.deleteNote = this.deleteNote.bind(this)
		this.handleHotKeys = this.handleHotKeys.bind(this)
	}

	componentDidMount() {
		document.addEventListener('keyup', this.handleHotKeys)
	}

	componentWillUnmount() {
		this.saveToStore()
		document.removeEventListener('keyup', this.handleHotKeys)
	}

	handleHotKeys(e) {
		if (e.ctrlKey && e.shiftKey && e.key === 'N') {
			this.addNewNote()
		} else if (e.ctrlKey && e.key === 'l') {
			this.listBarsClick()
		} else if ((this.state.noteView === 'edit' || this.state.noteView === 'note') && e.ctrlKey && e.key === 'Enter') {
			this.changeEditMode()
		} else if (this.state.noteView !== 'edit' && Number(e.key) > 0 && Number(e.key) <= 9 && Number(e.key) <= this.state.notes.length) {
			this.selectedNote(Number(e.key) - 1)
		} else if ((this.state.noteView === 'edit' || this.state.noteView === 'note') && e.ctrlKey && e.key === 'd') {
			this.deleteNote()
		}
	}

	listBarsClick() {
		this.setState({
			noteView: 'list'
		}, () => {
			this.saveToStore()
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
				this.saveToStore()
			})
		}
	}

	saveToStore() {
		store.set('notes', this.state.notes)
	}

	handleEditing(e) {
		e.persist()
		const temp = this.state.notes
		console.log('title: ', e.target.value)
		temp[this.state.currentNote].rawText = e.target.value
		temp[this.state.currentNote].title = e.target.value.match(/\w+/)[0] ? e.target.value.match(/\w\w+/)[0] : 'tit'
		this.setState({
			notes: temp
		})
	}

	addNewNote() {
		const text = '<!-- Untitled -->'
		if (this.state.noteView === 'edit') {
			document.querySelector('.note-editbox').value = text
		}
		const newNote = {
			title: 'Untitled',
			dateCreated: Date.now(),
			rawText: text,
		}
		this.setState({
			notes: [...this.state.notes, newNote],
			noteView: 'edit',
			currentNote: this.state.notes.length
		})
	}

	deleteNote() {
		const conf = confirm('Are you sure you want to delete this note?')
		if (!conf) return

		this.setState((prevState) => {
			prevState.notes.splice(this.state.currentNote, 1)
			return {
				currentNote: null,
				noteView: 'list',
				notes: prevState.notes
			}
		})
	}

	selectedNote(index) {
		this.setState({
			currentNote: index,
			noteView: 'note'
		})
	}

	handleDate(date = Date.now()) {
		return new Date(date).toLocaleString('de', { hour12: false }).replace(/\./g, '/')
	}

	parseTitle() {
		return this.state.noteView === 'list' ?
			`${this.state.notes.length} notes - ${this.handleDate()}` :
			`${this.state.notes[this.state.currentNote].title} - ${this.handleDate(this.state.notes[this.state.currentNote].dateCreated)}`
	}

	render() {
		return (
			<div className="view-container" id="notebook">

				<div id="note-wrapper">
					<h3 className="note-title">

						{this.parseTitle()}

						<img className="fa-icon plus-square" src="./assets/img/plus-square.svg" alt="plus-square.svg" title="Add new note" style={{ verticalAlign: 'baseline', float: 'left' }} onClick={this.addNewNote} />

						<img className="fa-icon bars" src="./assets/img/bars.svg" alt="bars.svg" title="Notes list" style={{ verticalAlign: 'baseline', float: 'left' }} onClick={this.listBarsClick} />

						{
							this.state.noteView !== 'list' &&
							<img className="fa-icon minus-square" src="./assets/img/minus-square.svg" alt="minus-square.svg" title="Delete note" style={{ verticalAlign: '10%', float: 'right' }} onClick={this.deleteNote} />
						}

						{
							this.state.noteView !== 'list' &&
							<img className="fa-icon edit" src="./assets/img/edit.svg" alt="edit.svg" title="Open/close edit" style={{ verticalAlign: '10%', float: 'right' }} onClick={this.changeEditMode} />
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
						<div className="note-text" dangerouslySetInnerHTML={{ __html: converter.makeHtml(this.state.notes[this.state.currentNote].rawText) }} />
					}
					{
						this.state.noteView === 'edit' &&
						<textarea className="note-editbox" defaultValue={this.state.notes[this.state.currentNote].rawText} onChange={this.handleEditing} autoFocus />
					}

				</div>
			</div>
		)
	}
}
