import createElement from '../myreact/h';
import render from '../myreact/render';
import Clock from './Clock';
import Form from './Form';

render(
	<div className="wgc">
		hello <input type="text" />
		<div style={{border: '1px solid #ccc'}}>world</div>
		<Clock />
		<Form />
	</div>,
	document.getElementById('root')
);
