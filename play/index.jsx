import createElement from '../myreact/h';
import render from '../myreact/render';
import Clock from './Clock';
import Box from './Box';

render(
	<div className="wgc">
		<Clock />
		<Box />
	</div>,
	document.getElementById('root')
);
