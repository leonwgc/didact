export default function h(type, props) {
	var args = [].slice.call(arguments);
	props = props || {};
	var children = args.slice(2) || [];
	children = children.filter(c => c != null && c !== false).map(c => (c instanceof Object ? c : {type: 'TEXT', props: {nodeValue: c}}));
	return {type, props, children};
}
