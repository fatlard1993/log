var log;

const logHelp = {
	DBG: 0,
	colorMap: {
		reset: '\x1b[0m',
		info: '\x1b[34m',
		warn: '\x1b[33m',
		error: '\x1b[31m'
	},
	noop: function(){},
	consoleWrap: function(method){
		return function _log(verbosity){
			var hasVerbosity = !arguments.length || (arguments.length === 1 && typeof verbosity === 'number');

			if(hasVerbosity && !verbosity) verbosity = 0;

			if(console && console[method]){
				var logFunc = logHelp.isNode ? logHelp.generateColorLogger(method) : console[method].bind(console);

				if(hasVerbosity) return verbosity < logHelp.DBG ? logFunc : logHelp.noop;

				else if(!hasVerbosity && logHelp.DBG) logFunc.apply(null, arguments);
			}
		};
	},
	generateColorLogger: function(method){
		return function _colorLog(){
			if(logHelp.mapColors && logHelp.colorMap[method]){
				Array.prototype.unshift.call(arguments, logHelp.colorMap[method]);
				Array.prototype.push.call(arguments, logHelp.colorMap.reset);
			}

			else if(method === 'error') Array.prototype.unshift.call(arguments, method);

			console[method].apply(null, arguments);
		};
	}
};

if(typeof Proxy === 'function'){
	log = new Proxy(logHelp.consoleWrap('log'), { get(target, method){ return logHelp.consoleWrap(method); } });
}

else{
	log = logHelp.consoleWrap('log');
	log.info = logHelp.consoleWrap('info');
	log.warn = logHelp.consoleWrap('warn');
	log.error = logHelp.consoleWrap('error');

	log.warn()('[log] Enabled limited non ES6 support, only log(v)(args), log.info(v)(args), log.warn(v)(args) and log.error(v)(args) are available');
}

if(typeof window === 'undefined'){
	module.exports = log;

	logHelp.isNode = true;
	logHelp.mapColors = process.env.COLOR || process.env.DEV;

	logHelp.DBG = process.env.DBG || process.env.DEV || (process.env.QUIET ? 0 : 1);
}

log()('[log] Verbosity set to: '+ logHelp.DBG);