import { LitElement, css, html, unsafeCSS } from 'lit'
import sharedStyles from './components.css?inline';

export class StatusMessage extends LitElement {

	static properties = {
		text: { type: String },
		appStyles: { type: String },
	};

	constructor() {
		super()
		this.text = ''
		this.appStyles = ''
	}

	render() {
		// return html`<div>${crossOriginIsolated ? '🔵' : '🌕'} ${this.text}</div>`;
		return html`
		<span class="group">
		  <span class="tag black">WebR</span>
		  <span id="msg" class="tag ${crossOriginIsolated ? 'primary' : 'gray'}">${this.text}</span>
  	</span>
		`
	}

	static styles = [
		unsafeCSS(this.appStyles),
		unsafeCSS(sharedStyles),
		css`
			/* Component-specific styles */
			:host {
				display: block;
			}
		`
	];

}

window.customElements.define('status-message', StatusMessage)
