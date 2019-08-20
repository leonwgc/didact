const reserverdProps = ['children', 'key', 'ref'];
export default function render(element, parentDom) {
	return reconcile(parentDom, null, element);
}

function createInstance(element) {
	const {type, props} = element;
	const children = props.children;
	let instance = null;
	var dom = null;
	if (typeof type === 'string') {
		if (type === 'TEXT') {
			dom = document.createTextNode(props.nodeValue);
			instance = {element, dom, childInstances: null};
		} else {
			dom = document.createElement(type);
			var propsKeys = Object.keys(props).filter(k => reserverdProps.indexOf(k) == -1);
			var eventPropsKeys = propsKeys.filter(p => p.startsWith('on'));
			var noneEventPropsKeys = propsKeys.filter(p => !p.startsWith('on'));

			for (let p of noneEventPropsKeys) {
				if (p === 'style') {
					var v = props[p];
					for (let s of Object.keys(v)) {
						dom.style[s] = v[s];
					}
				} else {
					if (reserverdProps.indexOf(p) === -1) {
						dom[p] = props[p];
					}
				}
			}
			for (let p of eventPropsKeys) {
				dom.addEventListener(p.toLowerCase().slice(2), props[p]);
			}
			var childInstances = children.map(createInstance);
			var childDoms = childInstances.map(i => i.dom);
			childDoms.map(d => dom.appendChild(d));
			instance = {element, dom, childInstances};
		}
	} else {
		instance = {};
		var publicInstance = new element.type(props);
		var childElement = publicInstance.render();
		var childInstance = createInstance(childElement);
		instance = {publicInstance, dom: childInstance.dom, element, childInstance};
		publicInstance.instance = instance;
	}
	return instance;
}

export function reconcile(parentDom, instance, element) {
	if (!instance) {
		instance = createInstance(element, parentDom);
		parentDom.appendChild(instance.dom);
		return instance;
	} else if (!element) {
		parentDom.removeChild(instance.dom);
		return null;
	} else if (instance.element.type !== element.type) {
		var newInstance = createInstance(element, parentDom);
		parentDom.replaceChild(newInstance.dom, instance.dom);
		return newInstance;
	} else if (typeof element.type === 'string') {
		// dom diff
		if (element.type === 'TEXT') {
			if (instance.element.props.nodeValue !== element.props.nodeValue) {
				instance.dom.nodeValue = element.props.nodeValue;
				instance.element = element;
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
	const {props} = element;
	const oldElement = instance.element;
	const oldProps = oldElement.props;
	const dom = instance.dom;
	const oldPropsKeys = Object.keys(oldProps).filter(k => reserverdProps.indexOf(k) == -1);
	const newPropsKeys = Object.keys(props).filter(k => reserverdProps.indexOf(k) == -1);
	// deleted props
	const deleted = oldPropsKeys.filter(k => newPropsKeys.indexOf(k) === -1);
	// changed props
	const added = newPropsKeys.filter(k => oldPropsKeys.indexOf(k) === -1);
	const changed = newPropsKeys.filter(k => props[k] !== oldProps[k]);
	const needSet = added.concat(changed);

	const needDeleteEventPropsKeys = deleted.filter(p => p.startsWith('on'));
	const needDeleteNoneEventPropsKeys = deleted.filter(p => !p.startsWith('on'));
	const needSetEventPropsKeys = needSet.filter(p => p.startsWith('on'));
	const needSetNoneEventPropsKeys = needSet.filter(p => !p.startsWith('on'));

	for (let k of needDeleteNoneEventPropsKeys) {
		delete dom[k];
	}
	for (let k of needDeleteEventPropsKeys) {
		dom.removeEventListener(k.toLowerCase().slice(2), oldProps[k]);
	}
	for (let k of needSetNoneEventPropsKeys) {
		if (k === 'style') {
			var v = props[k];
			for (let s of Object.keys(v)) {
				dom.style[s] = v[s];
			}
		} else {
			if (reserverdProps.indexOf(k) === -1) {
				dom[k] = props[k];
			}
		}
	}

	for (let k of needSetEventPropsKeys) {
		dom.addEventListener(k.toLowerCase().slice(2), props[k]);
	}

	instance.childInstances = diffChildren(instance, element);
	instance.element = element;
	return instance;
}

function diffChildren(instance, element) {
	const dom = instance.dom;
	const childInstances = instance.childInstances;
	const nextChildElements = element.props.children || [];
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
