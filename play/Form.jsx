import Component from '../myreact/component';
import createElement from '../myreact/h';

export default class Form extends Component {
	state = {val: ''};
	onChange = e => {
		this.setState({val: e.target.value});
	};

	render() {
		return (
			<div>
				<input type="text" value={this.state.val} onInput={this.onChange} />
				<div>{this.state.val}</div>
			</div>
		);
	}
}
