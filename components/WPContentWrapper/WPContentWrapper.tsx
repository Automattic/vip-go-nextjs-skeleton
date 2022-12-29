import { WrappedBuildError } from "next/dist/server/base-server";

export class WPContentWrapper extends HTMLElement {
	constructor() {
		super();

		const shadow = this.attachShadow({ mode: 'open' });

		const head = document.createElement('head');
		head.appendChild(getStyleLinkToUrl('http://decoupled.vipdev.lndo.site/wp-includes/css/dist/block-library/style.css'));
		head.appendChild(getStyleLinkToUrl('http://decoupled.vipdev.lndo.site/wp-includes/css/dist/block-library/theme.css'));
		head.appendChild(getStyleLinkToUrl('http://decoupled.vipdev.lndo.site/wp-json/vip-decoupled-styles/v1/styles'));

		const contentWrapper = document.createElement("body");
		contentWrapper.innerHTML = this.getAttribute('data-content');

		shadow.appendChild(head);
		shadow.appendChild(contentWrapper);

		console.log('WPContentWrapper - constructed', this);
	}

	connectedCallback() {
		console.log('WPContentWrapper - connected', this);
	}

	disconnectedCallback() {
		console.log('WPContentWrapper - disconnected', this);
	}
}

if ('customElements' in window && customElements.get('wp-content-wrapper') === undefined) {
	customElements.define('wp-content-wrapper', WPContentWrapper);
}

function getStyleLinkToUrl(stylesheetUrl: string) {
	let styleLink = document.createElement('link');
	styleLink.setAttribute('rel', 'stylesheet');
	styleLink.setAttribute('href', stylesheetUrl);

	return styleLink;
}