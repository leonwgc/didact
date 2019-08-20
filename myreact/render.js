export default function render(element, parentDom) {
	return reconcile(parentDom, null, element);
}

function inst(element) {
	const {type, props, children} = element;
	let instance = null;
	var dom = null;
	if (typeof type === 'string') {
		if (type === 'TEXT') {
			dom = document.createTextNode(props.nodeValue);
			instance = {element, dom, childInstances: null};
		} else {
			dom = document.createElement(type);
			var propsKeys = Object.keys(props);
			var eventPropsKeys = propsKeys.filter(p => p.startsWith('on'));
			var noneEventPropsKeys = propsKeys.filter(p => !p.startsWith('on'));

			for (let p of noneEventPropsKeys) {
				if (p === 'style') {
					var v = props[p];
					for (let s of Object.keys(v)) {
						dom.style[s] = v[s];
					}
				} else {
					dom[p] = props[p];
				}
			}
			for (let p of eventPropsKeys) {
				dom[p.toLowerCase()] = props[p];
			}
			var childInstances = children.map(inst);
			var childDoms = childInstances.map(i => i.dom);
			childDoms.map(d => dom.appendChild(d));
			instance = {element, dom, childInstances};
		}
	} else {
		instance = {};
		var publicInstance = new element.type(props);
		var childElement = publicInstance.render();
		var childInstance = inst(childElement);
		instance = {publicInstance, dom: childInstance.dom, element, childInstance};
		publicInstance.instance = instance;
	}
	return instance;
}

export function reconcile(parentDom, instance, element) {
	if (!instance) {
		instance = inst(element, parentDom);
		parentDom.appendChild(instance.dom);
		return instance;
	} else if (!element) {
		parentDom.removeChild(instance.dom);
		return null;
	} else if (instance.element.type !== element.type) {
		var newInstance = inst(element, parentDom);
		parentDom.replaceChild(newInstance.dom, instance.dom);
		return newInstance;
	} else if (typeof element.type === 'string') {
		// dom diff
		if (element.type === 'TEXT') {
			if (instance.element.props.nodeValue !== element.props.nodeValue) {
				instance.dom.nodeValue = element.props.nodeValue;
			}
			return instance;
		}
		return diffDom(instance, element);
	} else {
		// component diff
		return diffComponent(instance, element, parentDom);
	}
}

function diffComponent(instance, element, parentDom) {
	instance.publicInstance.props = element.props;
	var childElement = instance.publicInstance.render();
	var oldChildInstance = instance.childInstance;
	instance.element = element;
	var childInstance = reconcile(parentDom, oldChildInstance, childElement);
	instance.childInstance = childInstance;
	instance.dom = childInstance.dom;
	return instance;
}

function diffDom(instance, element) {
	const {props, children} = element;
	const oldElement = instance.element;
	const oldProps = oldElement.props;
	const oldPropsKeys = Object.keys(oldProps);
	var dom = instance.dom;
	for (let ok of oldPropsKeys) {
		dom[ok] = null;
	}
	const newPropsKeys = Object.keys(props);
	for (let nk of newPropsKeys) {
		dom[nk] = props[nk];
	}
	instance.childInstances = diffChildren(instance, element);
	instance.element = element;
	return instance;
}

function diffChildren(instance, element) {
	const dom = instance.dom;
	const childInstances = instance.childInstances;
	const nextChildElements = element.children || [];
	const newChildInstances = [];
	const count = Math.max(childInstances.length, nextChildElements.length);
	for (let i = 0; i < count; i++) {
		const childInstance = childInstances[i];
		const childElement = nextChildElements[i];
		const newChildInstance = reconcile(dom, childInstance, childElement);
		newChildInstances.push(newChildInstance);
	}
	return newChildInstances.filter(instance => instance != null);
}
