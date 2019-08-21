const nextTick = Promise.resolve().then.bind(Promise.resolve());
const queue = [];

export default function queueUpdate(c) {
	if (!c.__dirty) {
		c.__dirty = true;
		if (queue.push(c) === 1) {
			nextTick(process);
		}
	}
}

function process() {
	while (queue.length) {
		var c = queue.shift();
		c.forceUpdate();
		c.__dirty = false;
	}
}
