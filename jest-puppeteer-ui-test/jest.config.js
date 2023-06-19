const args = require('minimist')(process.argv.slice(2));
const template = args.template;
const resPath = args.resPath;

module.exports = {
    testEnvironment: "jsdom",
    testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
    testPathIgnorePatterns: ["/node_modules/"],
    setupFilesAfterEnv: ["./jest.setup.js", 'jest-allure/dist/setup', './lib/utils/jest-extend.ts'],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    rootDir: ".",
    globals: {
        __TEMPLATE__: template
    },
    reporters: [
        "default",
        [
            "jest-html-reporters",
            {
                "pageTitle": "Jest Report",
                "publicPath": `./static/res/${resPath}`,
                "expand": true,
                "inlineSource": true
            }
        ],
        [
            "@tencent/jest-report-search/lib/report.js",
            {
                "publicPath": `./static/res/${resPath}`
            }
        ]
    ]
};

