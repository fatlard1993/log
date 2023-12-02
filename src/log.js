export const loggers = {};
export let defaults = {
	verbosity: 0,
	color: false,
	silentTag: false,
	methodTag: false,
	tag: '__default',
	colorMap: {},
};
export const methodMap = {};

const DEFAULT_COLOR_MAP = {
	__reset: '\x1b[0m',
	info: '\x1b[34m',
	warn: '\x1b[33m',
	error: '\x1b[31m',
};

class Log {
	constructor(options = {}) {
		if (options.defaults) defaults = { ...defaults, ...options.defaults };

		this.options = { ...defaults, ...options };

		const { tag } = this.options;

		if (loggers[tag]) {
			loggers[tag].options = { ...loggers[tag].options, ...options };

			return loggers[tag];
		}

		const metaLogger = this;

		const defaultLogger = new Proxy(this.makeLogger('log'), {
			get(target, key) {
				return Reflect.get(target, key) ?? metaLogger[key] ?? metaLogger.makeLogger(key);
			},
		});

		defaultLogger.options = this.options;

		loggers[tag] = defaultLogger;

		return defaultLogger;
	}

	makeLogger(method) {
		const metaLogger = this;

		return function (...args) {
			const { colorMap, silentTag, methodTag, tag, verbosity, color: useColor } = metaLogger.options;

			const isVerbosityCall = !args.length || (args.length === 1 && typeof args[0] === 'number');
			const thisVerbosity = isVerbosityCall ? args.shift() || 0 : 0;
			const willShow = !!console && thisVerbosity < verbosity;
			const isNativeConsoleMethod = typeof console[method] === 'function';

			if (willShow) {
				const colors = { ...DEFAULT_COLOR_MAP, ...colorMap };
				const color = colors[tag] || colors[method] || colors[methodMap[method]];

				if (!silentTag) {
					let tagText = '';

					if (tag !== '__default') tagText += `[${tag}]`;
					if (methodTag || !isNativeConsoleMethod) tagText += `[${method}]`;

					if (tagText) args.unshift(tagText);
				}

				if (useColor && color) args.unshift(color);
				else if (method === 'error') args.unshift('[ERROR]');

				args.unshift(colors.__reset);
			}

			if (!isNativeConsoleMethod) method = methodMap[method] || 'log';

			const logFunction = willShow ? console[method].bind(this, ...args) : () => {};

			if (isVerbosityCall) return logFunction;
			else if (!isVerbosityCall && verbosity > 0) logFunction();
		};
	}

	setTag(newTag) {
		const { tag } = this.options;

		if (newTag === tag) return;

		if (loggers[newTag]) loggers[tag].options = { ...loggers[newTag].options, ...loggers[tag].options };

		loggers[newTag] = loggers[tag];

		if (loggers[tag].options.colorMap[tag])
			loggers[newTag].options.colorMap[newTag] = loggers[tag].options.colorMap[tag];

		loggers[tag] = undefined;

		this.options.tag = newTag;
	}
}

export default Log;
