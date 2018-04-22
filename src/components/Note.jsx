import React, { Component } from 'react'
import showdown from 'showdown';

showdown.setFlavor('github')
const converter = new showdown.Converter()
// console.log(showdown.getOptions())

export default class Note extends Component {
	constructor() {
		super()
		this.state = {
			dateCreated: Date.now(),
			rawText: `# hello, markdown!
			- [ ] jhjhjh  
			* kjkjkj
			background-color: #35363A;`,
			editMode: false
		}
		this.changeEditMode = this.changeEditMode.bind(this)
		this.saveEdit = this.saveEdit.bind(this)
		this.barsClick = this.barsClick.bind(this)
		this.addNewNote = this.addNewNote.bind(this)
		this.deleteNote = this.deleteNote.bind(this)
	}
	componentDidMount() {
	}

	barsClick() {
		console.log('bars')
	}

	changeEditMode() {
		this.setState({
			editMode: !this.state.editMode
		}, () => {
			// console.log(this.state.editMode)
			if (!this.state.editMode) {
				// saveto store
			}
		})
	}

	saveEdit(e) {
		// console.log('save', this)
		this.setState({
			rawText: e.target.value
		})
	}

	addNewNote() {
		const infoText = '<!-- Untitled, first word on first line will be the title --> \n* click editbutton or press ctrl+enter to save and close edit box\n'

		if (this.state.editMode === true) {
			// eslint-disable-next-line
			document.querySelector('.note-editbox').value = infoText
		}

		this.setState({
			dateCreated: Date.now(),
			rawText: infoText,
			editMode: true
		})
	}

	deleteNote() {
		// eslint-disable-next-line
		const conf = confirm('Are you sure you want to delete this note?')
		console.log(conf, this)
		// const obj = obj.pop(this.note)
		let pre;
		if (conf) pre = '- [x] '
		else pre = '- [ ] '
		this.setState({
			rawText: pre + conf,
			editMode: false
		})
	}


	render() {
		return (

			<div id="note-wrapper">
				<h3 className="note-title">{`${this.state.rawText.match(/\w\w+/)} - ${new Date(this.state.dateCreated).toLocaleString('de', { hour12: false }).replace(/\./g, '/')}`}

					<img className="fa-icon plus-square" src="./assets/img/plus-square.svg" alt="plus-square.svg" style={{ verticalAlign: 'baseline', float: 'left' }} onClick={this.addNewNote} />

					<img className="fa-icon bars" src="./assets/img/bars.svg" alt="bars.svg" style={{ verticalAlign: 'baseline', float: 'left' }} onClick={this.barsClick} />

					<img className="fa-icon minus-square" src="./assets/img/minus-square.svg" alt="minus-square.svg" style={{ verticalAlign: '10%', float: 'right' }} onClick={this.deleteNote} />

					<img className="fa-icon edit" src="./assets/img/edit.svg" alt="edit.svg" style={{ verticalAlign: '10%', float: 'right' }} onClick={this.changeEditMode} />
				</h3>

				{
					this.state.editMode === false &&
					// eslint-disable-next-line
					<div className="note-text" dangerouslySetInnerHTML={{ __html: converter.makeHtml(this.state.rawText) }} />
				}
				{
					this.state.editMode === true &&
					<textarea className="note-editbox" defaultValue={this.state.rawText} onChange={this.saveEdit} autoFocus />
				}

			</div>
		)
	}
}

