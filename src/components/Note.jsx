import React, { Component } from 'react'
import showdown from 'showdown';

showdown.setFlavor('github')
const converter = new showdown.Converter()
const text = `# hello, markdown!
- [ ] jhjhjh  
* kjkjkj

background-color: #35363A;`

// console.log(showdown.getOptions())

export default class Note extends Component {
	constructor() {
		super()
		this.state = {
			dateCreated: Date.now(),
			rawText: text,
			editMode: false
		}
		this.changeEditMode = this.changeEditMode.bind(this)
		this.saveEdit = this.saveEdit.bind(this)
		this.barsClick = this.barsClick.bind(this)
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


	render() {
		return (

			<div id="note-wrapper">
				<h3 className="note-title">{`${this.state.rawText.match(/\w+/)} - ${new Date(this.state.dateCreated).toLocaleString()}`}
				<img className="fa-icon bars" src="./assets/img/bars.svg" alt="bars.svg" style={{ verticalAlign: 'baseline', float: 'left' }} onClick={this.barsClick} />
				<img className="fa-icon edit" src="./assets/img/edit.svg" alt="edit.svg" style={{ verticalAlign: '10%', float: 'right' }} onClick={this.changeEditMode} />
				</h3>


				{
					this.state.editMode === false &&
					<div className="note-text" dangerouslySetInnerHTML={{ __html: converter.makeHtml(this.state.rawText) }} />
				}
				{
					this.state.editMode === true &&
					<textarea className="note-editbox" defaultValue={this.state.rawText} onChange={this.saveEdit} />
				}

			</div>
		)
	}
}

