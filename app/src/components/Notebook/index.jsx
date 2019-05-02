import React, { Component } from 'react'
import showdown from 'showdown'
import Store from 'electron-store'
import './styles.css'
import Ibars from '../../assets/images/bars.svg'
import Iplus from '../../assets/images/plus-square.svg'
import Iminus from '../../assets/images/minus-square.svg'
import Iedit from '../../assets/images/edit.svg'

showdown.setFlavor('github')
const converter = new showdown.Converter()
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
		const { noteView, notes } = this.state
		if (e.ctrlKey && e.shiftKey && e.key === 'N') {
			this.addNewNote()
		} else if (e.ctrlKey && e.key === 'l') {
			this.listBarsClick()
		} else if ((noteView === 'edit' || noteView === 'note') && e.ctrlKey && e.key === 'Enter') {
			this.changeEditMode()
		} else if (noteView !== 'edit' && Number(e.key) > 0 && Number(e.key) <= 9 && Number(e.key) <= notes.length) {
			this.selectedNote(Number(e.key) - 1)
		} else if ((noteView === 'edit' || noteView === 'note') && e.ctrlKey && e.key === 'd') {
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
		const { noteView } = this.state
		if (noteView === 'note') {
			this.setState({
				noteView: 'edit'
			})
		} else if (noteView === 'edit') {
			this.setState({
				noteView: 'note'
			}, () => {
				this.saveToStore()
			})
		}
	}

	saveToStore() {
		const { notes } = this.state
		store.set('notes', notes)
	}

	handleEditing(e) {
		e.persist()
		const { notes, currentNote } = this.state
		const temp = [...notes]
		const firstLine = e.target.value.match(/^(.*)$/m)[1]
		const title = firstLine.match(/\w+/) === null ? 'Untitled' : firstLine.match(/\w+/)
		temp[currentNote].rawText = e.target.value
		temp[currentNote].title = title
		this.setState({
			notes: temp
		})
	}

	addNewNote() {
		const { notes, noteView } = this.state
		const text = '<!-- Untitled -->'
		if (noteView === 'edit') {
			document.querySelector('.note-editbox').value = text
		}
		const newNote = {
			title: 'Untitled',
			dateCreated: Date.now(),
			rawText: text,
		}
		this.setState({
			notes: [...notes, newNote],
			noteView: 'edit',
			currentNote: notes.length
		})
	}

	deleteNote() {
		const conf = confirm('Are you sure you want to delete this note?')
		if (!conf) return

		this.setState((prevState) => {
			const { currentNote } = this.state
			prevState.notes.splice(currentNote, 1)
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
		const { noteView, notes, currentNote } = this.state
		return noteView === 'list'
			? `${notes.length} notes - ${this.handleDate()}`
			: `${notes[currentNote].title} - ${this.handleDate(notes[currentNote].dateCreated)}`
	}

	render() {
		const { noteView, notes, currentNote } = this.state
		return (
			<div className="view-container" id="notebook">

				<div id="note-wrapper">
					<h3 className="note-title">

						{this.parseTitle()}

						<img className="fa-icon plus-square" src={Iplus} alt="plus-square.svg" title="Add new note" style={{ verticalAlign: 'baseline', float: 'left' }} onClick={this.addNewNote} />

						<img className="fa-icon bars" src={Ibars} alt="bars.svg" title="Notes list" style={{ verticalAlign: 'baseline', float: 'left' }} onClick={this.listBarsClick} />

						{
							noteView !== 'list'
							&& <img className="fa-icon minus-square" src={Iminus} alt="minus-square.svg" title="Delete note" style={{ verticalAlign: '10%', float: 'right' }} onClick={this.deleteNote} />
						}

						{
							noteView !== 'list'
							&& <img className="fa-icon edit" src={Iedit} alt="edit.svg" title="Open/close edit" style={{ verticalAlign: '10%', float: 'right' }} onClick={this.changeEditMode} />
						}

					</h3>
					{
						noteView === 'list'
						&& (
						<ol>
							{
								notes.map((note, i) => <li key={i} onClick={this.selectedNote.bind(this, i)}>{note.title} - {this.handleDate(note.dateCreated)}</li>)
							}
						</ol>
)
					}
					{
						noteView === 'note'
						&& <div className="note-text" dangerouslySetInnerHTML={{ __html: converter.makeHtml(notes[currentNote].rawText) }} />
					}
					{
						noteView === 'edit'
						&& <textarea className="note-editbox" defaultValue={notes[currentNote].rawText} onChange={this.handleEditing} autoFocus />
					}

				</div>
			</div>
		)
	}
}
