import Component from '../myreact/component';
import createElement from '../myreact/h';
import Form from './Form';

export default class Box extends Component {
	render() {
		return (
			<Form>
				<div style={{border: '1px solid #ccc'}}>
					<div>form inner1</div>
					<div>form inner2</div>
				</div>
			</Form>
		);
	}
}
