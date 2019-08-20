import createElement from '../myreact/h';
import render from '../myreact/render';
import Clock from './Clock';
import Box from './Box';

render(
	<div className="wgc">
		hello <input type="text" />
		<div style={{border: '1px solid #ccc'}}>world</div>
		<Clock />
		<Box />
	</div>,
	document.getElementById('root')
);
