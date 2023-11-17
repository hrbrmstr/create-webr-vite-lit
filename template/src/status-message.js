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
    <div class="dib ba br2 overflow-hidden f7">
      <span class="dib pa2 bg-dark-gray white br2 br--left mr0">WebR</span><span class="dib pa2 ${crossOriginIsolated ? "bg-dark-blue" : "bg-dark-grey"} white br2 br--right ml0">${this.text}</span>
    </div>
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
