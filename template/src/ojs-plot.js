import { LitElement, css, html, unsafeCSS } from 'lit'
import { when } from 'lit/directives/when.js';

import sharedStyles from './components.css?inline';
import * as Plot from "@observablehq/plot";

const inspect = false // set to true for some console.log msgs

export class OJSPlot extends LitElement {

	static properties = {
		id: { type: String },
		appStyles: { type: String },
		chartTitle: { type: String },
		chartOptions: { type: Object },
	};

	constructor() {

		super()
		
		this.chart = null
		this.appStyles = ''

		this.addEventListener('chartUpdated', (e) => {
			inspect && console.log("connectedCallback event listener")
			this.chartTitle = e.detail.value.chartTitle;
			this.chartOptions = e.detail.value.chartOptions;
		});

	}

	render() {

		inspect && console.log("render")

		const renderedPlot = this.chartOptions && Plot.plot(this.chartOptions)

		return when(this.chartOptions === null,
			() => html`<div></div>`,
			() => html`<div>
			<h3 class="primary">${this.chartTitle}</h3>
			${renderedPlot}
			</div>`
		)

	}

	performUpdate() {

		super.performUpdate();

		const options = {
			detail: {
				value: {
					chartTitle: this.chartTitle,
					chartOptions: this.chartOptions,
				}
			},
			bubbles: true,
			composed: true,
		};

		inspect && console.log("performUpdate dispatching event")
		this.dispatchEvent(new CustomEvent(`chartUpdated`, options));
		inspect && console.log("performUpdate event dispatched")

	}

	static styles = [
		unsafeCSS(this.appStyles),
		unsafeCSS(sharedStyles),
		css`
			:host {
				display: flex;
				background-color: var(--light-plot-background, "white")
			}
			:host[dark] {
				background-color: var(--dark-plot-background, "#1c1c1e")
			}
			:host div {
				color: var(--light-plot-div-color, "white")
			}
			:host div[dark] {
				color: var(--dark-plot-div-color, "white")
			}
			:host svg {
				background: var(--light-plot-background)
			}
			:host[dark] svg {
				background: var(--dark-plot-background)
			}
		`
	];

}

window.customElements.define('ojs-plot', OJSPlot)
