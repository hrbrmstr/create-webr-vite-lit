import { LitElement, css, html, unsafeCSS } from 'lit'
import { when } from 'lit/directives/when.js';
import sharedStyles from './components.css?inline';

export class ActionButton extends LitElement {

	static properties = {
		id: { type: String },
		appStyles: { type: String },
		label: { type: String },
		onClick: { type: Function },
		disabled: { type: Boolean }
	};

	async _handleClick(e) {
		if (this.onClick) {
			await this.onClick(e)
		} 
	}

	constructor() {
		super()
		this.appStyles = ''
		this.label = ''
		this.disabled = false
		this.action = async (e) => { }
	}

	render() {

		const dis = this.disabled ? "disabled" : ""

		return when(
			this.label === '',
			() => html`<div></div>`,
			() => html`<button ${dis} @click="${this._handleClick}" id="${this.id}">${this.label}</button>`
		)
	}

	static styles = [
		unsafeCSS(this.appStyles),
		unsafeCSS(sharedStyles),
		css`
			:host {
				display: block;
			}
		`
	];

}

window.customElements.define('action-button', ActionButton)
