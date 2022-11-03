import { getLogger, configure, Configuration, Logger } from 'log4js';
import log4jsConfig from './logger.config'

export class LoggerService  {
    private defaultLogger: Logger;
    private cachedLoggerMap: Map<string, Logger>;
    constructor() {
        configure(log4jsConfig().log4jsConfig);
        this.cachedLoggerMap = new Map();
        this.defaultLogger = this.getLogger();
        this.cachedLoggerMap.set('default', this.defaultLogger);
    }
    public log(message: any, ...optionalParams: any[]) {
        this.defaultLogger.log(message, ...optionalParams);
    }
    public error(message: any, ...optionalParams: any[]) {
        this.defaultLogger.error(message, ...optionalParams);
    }
    public warn(message: any, ...optionalParams: any[]) {
        this.defaultLogger.warn(message, ...optionalParams);
    }
    public debug?(message: any, ...optionalParams: any[]) {
        this.defaultLogger.debug(message, ...optionalParams);
    }
    public verbose?(message: any, ...optionalParams: any[]) {
        this.defaultLogger.trace(message, ...optionalParams);
    }
    // Public
    public getLogger(category?: string) {
        if (this.cachedLoggerMap.has(category)) {
            return this.cachedLoggerMap.get(category);
        }
        const logger = getLogger(category);
        const loggerProxy = new Proxy(logger, {
            get: function(target, prop) {
                if (['log', 'error', 'info', 'warn', 'debug'].indexOf(prop as string) >= 0) {
                    return target[prop].bind(target, '');
                }
                return Reflect.get(target, prop);
            },
        });
        this.cachedLoggerMap.set(category, loggerProxy);
        return loggerProxy;
    }
}
