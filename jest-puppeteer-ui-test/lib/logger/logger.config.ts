import { Configuration } from 'log4js';
import { join } from 'path';

//const root = '/home/qspace/mms1suitestsvr/log/pptr';
const root = '/home/qspace/mms1suitestsvr/log';

const createCustomAppenders = (category = ''): Configuration['appenders'] => {
    return {
        [`${category}All`]: {
            type: 'dateFile',
            filename: join(root, category, 'trace', 'output.log'),
            pattern: 'yyyy-MM-dd-hh',
            compress: false,
            keepFileExt: true,
            alwaysIncludePattern: true,
            numBackups: 7,
            layout: {
                type: 'basic'
            },
        },
        [`${category}ErrorAppend`]: {
            type: 'dateFile',
            filename: join(root, category, 'error', 'error.log'),
            pattern: 'yyyy-MM-dd-hh',
            compress: false,
            keepFileExt: true,
            alwaysIncludePattern: true,
            numBackups: 7,
            layout: {
                type: 'basic',
            },
        },
        [`${category}Error`]: {
            type: 'logLevelFilter',
            level: 'error',
            appender: `${category}ErrorAppend`,
        },
    };
};

const createCustomCategories = (category = ''): Configuration['categories'] => {
    return {
        [category || 'default']: {
            appenders: [`${category}All`, `${category}Error`],
            level: 'info',
        },
    };
};

export default function () {
    return {
        log4jsConfig: {
            appenders: {
                ...createCustomAppenders('puppeteer'),
                ...createCustomAppenders(),
            },
            categories: {
                ...createCustomCategories('puppeteer'),
                ...createCustomCategories(),
            },
        },
        pm2: true,
    } as {
        log4jsConfig: Configuration
    };
}