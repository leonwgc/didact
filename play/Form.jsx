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
				<input type="text" value={val} onInput={this.onChange} style={{width: '160px', height: '20px', padding: '2px 4px', border: '1px solid #ccc'}} />
				<div style={{color: val === 'wgc' ? 'green' : 'red', margin: '20px 0'}}>{this.state.val}</div>
				<div className="under-form-children" style={{color: val === 'wgc' ? 'red' : 'blue'}}>
					{this.props.children}
				</div>
			</div>
		);
	}
}
