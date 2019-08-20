import Component from '../myreact/component';
import createElement from '../myreact/h';

export default class Form extends Component {
	state = {val: ''};
	onChange = e => {
		this.setState({val: e.target.value});
	};

	render() {
		const {val} = this.state;
		return (
			<div className="test">
				<input type="text" value={val} onInput={this.onChange} />
				<div style={{color: val === 'wgc' ? 'green' : 'red'}}>{this.state.val}</div>
				<div className="under-form-children">{this.props.children}</div>
			</div>
		);
	}
}
