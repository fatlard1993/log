"use-strict";

class Log {
	constructor(opts = {}){
		const tag = opts.tag = opts.tag || '_default_';

		if(opts.defaults){
			if(typeof opts.defaults.verbosity === 'number') Log.prototype.defaults.verbosity = opts.verbosity = opts.defaults.verbosity;
			if(typeof opts.defaults.color === 'boolean') Log.prototype.defaults.color = opts.color = opts.defaults.color;
			if(typeof opts.defaults.colorMap === 'object') Log.prototype.defaults.colorMap = opts.colorMap = Object.assign(Log.prototype.defaults.colorMap, opts.defaults.colorMap);
		}

		Object.defineProperty(opts, 'newTag', {
			set: function(newTag){
				if(newTag === this.tag) return;

				if(Log.prototype.loggers[newTag]){
					Log.prototype.loggers[this.tag].opts = Object.assign(Log.prototype.loggers[newTag].opts, Log.prototype.loggers[this.tag].opts);

					Log.prototype.loggers[newTag] = Log.prototype.loggers[this.tag];
				}

				Log.prototype.loggers[newTag] = Log.prototype.loggers[this.tag];

				delete Log.prototype.loggers[this.tag];

				this.tag = newTag;
			}
		});

		if(Log.prototype.loggers[tag]){
			Log.prototype.loggers[tag].opts = Object.assign(Log.prototype.loggers[tag].opts, opts);

			return Log.prototype.loggers[tag];
		}

		if(typeof opts.verbosity === 'undefined') opts.verbosity = Log.prototype.defaults.verbosity;
		if(typeof opts.color === 'undefined') opts.color = Log.prototype.defaults.color;

		const isNode = typeof window === 'undefined';

		const createLogger = (method) => {
			if(!console || typeof console[method] !== 'function') return;

			return function(verbosity){
				const hasVerbosity = !arguments.length || (arguments.length === 1 && typeof verbosity === 'number');

				if(hasVerbosity && !verbosity) verbosity = 0;

				const colorMap = Object.assign(opts.colorMap || {}, Log.prototype.defaults.colorMap), mappedColor = colorMap[method] || colorMap[tag];
				const args = Array.from(arguments);

				if(hasVerbosity) args.splice(0, 1);

				if(!opts.silentTag && opts.tag !== '_default_') args.unshift(`[${opts.tag}]`);

				if(opts.color && mappedColor){
					if(typeof args[0] === 'string') args[0] = `${colorMap.reset}${mappedColor}${args[0]}`;

					else args.unshift(mappedColor);
				}

				else if(isNode && method === 'error') args.unshift('[ERROR]');

				if(opts.color && !hasVerbosity) args.push(colorMap.reset);

				const logFunc = console[method].bind(this, ...args);

				if(hasVerbosity) return verbosity < opts.verbosity ? logFunc : () => {};

				else if(!hasVerbosity && opts.verbosity) logFunc();
			};
		};

		const logger = new Proxy(createLogger('log'), { get(target, method){ return typeof target[method] !== 'undefined' ? target[method] : createLogger(method); } });

		logger.opts = opts;

		Log.prototype.loggers[tag] = logger;

		return logger;
	}
}

Log.prototype.loggers = {};
Log.prototype.defaults = {
	verbosity: 0,
	color: false,
	colorMap: {
		reset: '\x1b[0m',
		info: '\x1b[34m',
		warn: '\x1b[33m',
		error: '\x1b[31m'
	}
};

if(typeof module === 'object') module.exports = Log;