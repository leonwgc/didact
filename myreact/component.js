import {reconcile} from './render';

export default class Component {
	constructor(props) {
		this.props = props;
		this.state = this.state || {};
	}

	setState(partialState) {
		this.state = Object.assign({}, this.state, partialState);
		reconcile(this.instance.dom.parentNode, this.instance, this.instance.element);
	}
}
