export default function h(type, props) {
	var args = [].slice.call(arguments);
	props = props || {};
	var children = args.slice(2) || [];
	children = children.filter(c => c != null && c !== false).map(c => (c instanceof Object ? c : {type: 'TEXT', props: {nodeValue: c, children: []}}));
	children = childrenFlatten(children);
	props.children = children;
	return {type, props};
}

function childrenFlatten(children) {
	var hasArrayChild = children.some(Array.isArray);
	if (hasArrayChild) {
		let rt = [];
		for (let c of children) {
			rt = rt.concat(c);
		}

		return rt;
	}
	return children;
}
