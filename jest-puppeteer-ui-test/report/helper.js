"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.deepClone = exports.readErrorInfos = exports.reportError = exports.dataDirPath = void 0;
var path = require("path");
var fs = require("fs-extra");
exports.dataDirPath = path.resolve('', './static/data');
var getJestGlobalData = function (globalContext) {
    var testPath = '';
    var currentTestName = '';
    var context = globalContext || global;
    __spreadArray([], Object.getOwnPropertySymbols(context), true).forEach(function (key) {
        if (context[key] && context[key].state && context[key].matchers) {
            var state = context[key].state || {};
            testPath = state.testPath;
            currentTestName = state.currentTestName;
        }
    });
    return { testPath: testPath, testName: currentTestName };
};
var generateRandomString = function () { return "".concat(Date.now()).concat(Math.random()); };
/**
 *
 * @param {string} message
 * @param {object} context. Optional. It contains custom configs
 */
var reportError = function (_a) {
    var status = _a.status, context = _a.context;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, testPath, testName, createTime, fileName, attachObject;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = getJestGlobalData(context), testPath = _b.testPath, testName = _b.testName;
                    createTime = Date.now();
                    fileName = generateRandomString();
                    attachObject = {
                        createTime: createTime,
                        testPath: testPath,
                        testName: testName,
                        description: status,
                    };
                    console.log("ahahahah");
                    console.log(attachObject);
                    console.log("".concat(exports.dataDirPath, "/").concat(fileName, ".json"));
                    return [4 /*yield*/, fs.writeJSON("".concat(exports.dataDirPath, "/").concat(fileName, ".json"), attachObject)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.reportError = reportError;
var readErrorInfos = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, exist, attachData, dataList, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, fs.pathExists(exports.dataDirPath)];
            case 2:
                exist = _a.sent();
                if (!exist) {
                    console.info('Temp folder not exist, means that attach Infos may append unsuccessful');
                    return [2 /*return*/, result];
                }
                return [4 /*yield*/, fs.readdir(exports.dataDirPath)];
            case 3:
                attachData = _a.sent();
                return [4 /*yield*/, Promise.all(attachData.map(function (data) {
                        return fs.readJSON("".concat(exports.dataDirPath, "/").concat(data), { throws: false });
                    }))];
            case 4:
                dataList = _a.sent();
                dataList.forEach(function (attachObject) {
                    if (!attachObject)
                        return;
                    var testPath = attachObject.testPath, testName = attachObject.testName, filePath = attachObject.filePath, description = attachObject.description, fileName = attachObject.fileName, createTime = attachObject.createTime, extName = attachObject.extName;
                    var attachMappingName = testName || 'jest-html-reporters-file-attach';
                    if (!result[testPath])
                        result[testPath] = [];
                    if (description == "Errored")
                        result[testPath].push(testName);
                    /*result[testPath][attachMappingName].push({
                      filePath: filePath,
                      description: description || '',
                      createTime,
                      extName,
                    });*/
                });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.error(err_1);
                console.error('[jest-html-reporters]: parse attach failed!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/, result];
        }
    });
}); };
exports.readErrorInfos = readErrorInfos;
var usingStructure = {
    keys: [
        'numFailedTestSuites',
        'numFailedTests',
        'numPassedTestSuites',
        'numPassedTests',
        'numPendingTestSuites',
        'numPendingTests',
        'numRuntimeErrorTestSuites',
        'numTodoTests',
        'numTotalTestSuites',
        'numTotalTests',
        'startTime',
        'success',
        [
            'testResults',
            {
                keys: [
                    'numFailingTests',
                    'numPassingTests',
                    'numPendingTests',
                    'numTodoTests',
                    'perfStats',
                    'testFilePath',
                    'failureMessage',
                    [
                        'testResults',
                        {
                            keys: [
                                'ancestorTitles',
                                'duration',
                                'failureMessages',
                                'fullName',
                                'status',
                                'title',
                            ],
                        },
                    ],
                ],
            },
        ],
    ],
};
var basisClone = function (obj, structure) {
    if (typeof obj !== 'object')
        return obj;
    if (Array.isArray(obj)) {
        return obj.map(function (item) { return basisClone(item, structure); });
    }
    var keys = structure.keys;
    var res = {};
    keys.forEach(function (item) {
        if (typeof item === 'string') {
            res[item] = obj[item];
        }
        else {
            var key = item[0], innerStructure = item[1];
            res[key] = basisClone(obj[key], innerStructure);
        }
    });
    return res;
};
var deepClone = function (obj) {
    var res = basisClone(obj, usingStructure);
    return JSON.parse(JSON.stringify(res));
};
exports.deepClone = deepClone;
// For options
var PUBLIC_PATH = 'publicPath';
var constants = {
    ENVIRONMENT_CONFIG_MAP: {
        JEST_HTML_REPORTERS_PUBLIC_PATH: PUBLIC_PATH,
    },
    DEFAULT_OPTIONS: (_a = {},
        _a[PUBLIC_PATH] = process.cwd(),
        _a),
};
function getEnvOptions() {
    var options = {};
    for (var name_1 in constants.ENVIRONMENT_CONFIG_MAP) {
        if (process.env[name_1]) {
            options[constants.ENVIRONMENT_CONFIG_MAP[name_1]] = process.env[name_1];
        }
    }
    return options;
}
var getOptions = function (reporterOptions) {
    if (reporterOptions === void 0) { reporterOptions = {}; }
    return Object.assign({}, constants.DEFAULT_OPTIONS, reporterOptions, getEnvOptions());
};
exports.getOptions = getOptions;
