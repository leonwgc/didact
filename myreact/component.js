import {reconcile} from './render';
import queueUpdate from './queueUpdate';

export default class Component {
	constructor(props) {
		this.props = props;
		this.state = this.state || {};
		this.__dirty = false;
		this.forceUpdate = this.forceUpdate.bind(this);
	}

	setState(partialState) {
		this.state = Object.assign({}, this.state, partialState);
		queueUpdate(this);
	}
	forceUpdate() {
		reconcile(this.instance.dom.parentNode, this.instance, this.instance.element);
	}
}
