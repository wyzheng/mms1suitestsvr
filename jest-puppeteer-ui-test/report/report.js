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
Object.defineProperty(exports, "__esModule", { value: true });
// my-custom-reporter.js
var helper_1 = require("./helper");
var fse = require("fs-extra");
var MyCustomReporter = /** @class */ (function () {
    function MyCustomReporter(globalConfig, options) {
        var _a = options.filename, filename = _a === void 0 ? '' : _a;
        this._options = (0, helper_1.getOptions)(options);
        this.init();
    }
    MyCustomReporter.prototype.onRunComplete = function (contexts, originalResults) {
        return __awaiter(this, void 0, void 0, function () {
            var results, i, j, failTag, k, failureMessage, j, caseId, pref, index, k, caseName, fileName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = (0, helper_1.deepClone)(originalResults);
                        // 更新测试结果
                        for (i = 0; i < results.testResults.length; i++) {
                            for (j = 0; j < results.testResults[i].testResults.length; j++) {
                                failTag = "";
                                for (k = 0; k < results.testResults[i].testResults[j].failureMessages.length; k++) {
                                    failureMessage = results.testResults[i].testResults[j].failureMessages[k];
                                    if (failureMessage.indexOf('Expected:') === -1) {
                                        results.testResults[i].testResults[j].status = "errored";
                                    }
                                    else if (failureMessage.indexOf('Expected:') !== -1) {
                                        failTag += "assertError#";
                                    }
                                    else if (failureMessage.indexOf("Cannot read properties of null") !== -1 || failureMessage.indexOf("TimeoutError: Waiting for selector") !== -1) {
                                        failTag += "elementNonExist#";
                                    }
                                    else if (failureMessage.indexOf("data is not ready after timeout") !== -1) {
                                        failTag += "dataTimeout#";
                                    }
                                    else if (failureMessage.indexOf("timeout") !== -1 || failureMessage.indexOf("Timeout") !== -1) {
                                        failTag += "Timeout#";
                                    }
                                    else {
                                        failTag += "unknown#";
                                    }
                                }
                                results.testResults[i].testResults[j].failureTag = failTag;
                            }
                            // 更新caseId
                            for (j = 0; j < results.testResults[i].testResults.length; j++) {
                                caseId = "";
                                pref = results.testResults[i].testFilePath.split("/");
                                pref[pref.length - 1] = pref[pref.length - 1].split(".")[0];
                                index = pref.indexOf("__tests__");
                                for (k = index + 1; k < pref.length; k++) {
                                    caseId += pref[k] + ".";
                                }
                                caseName = results.testResults[i].testResults[j].title;
                                caseId += caseName;
                                results.testResults[i].testResults[j].caseId = caseId;
                            }
                        }
                        //console.log(results.testResults[0].testResults);
                        fileName = "jest_result";
                        return [4 /*yield*/, fse.writeJSON("".concat(this._options.publicPath, "/").concat(fileName, ".json"), results)];
                    case 1:
                        _a.sent();
                        this.removeTempDir();
                        return [2 /*return*/];
                }
            });
        });
    };
    MyCustomReporter.prototype.init = function () {
        this.initAttachDir();
    };
    MyCustomReporter.prototype.initAttachDir = function () {
        this.removeTempDir();
        fse.mkdirpSync(helper_1.dataDirPath);
    };
    MyCustomReporter.prototype.removeTempDir = function () {
        fse.removeSync(helper_1.dataDirPath);
    };
    return MyCustomReporter;
}());
module.exports = MyCustomReporter;
