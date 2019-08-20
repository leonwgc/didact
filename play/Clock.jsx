import Component from '../myreact/component';
import createElement from '../myreact/h';

export default class Clock extends Component {
	constructor(props) {
		super(props);
	}
	state = {count: 1};
	onClick = () => {
		this.setState({count: this.state.count + 1});
	};
	render() {
		return (
			<div onClick={this.onClick}>
				{'you clicked'} {':'}
				{this.state.count} {'times'}
			</div>
		);
	}
}
