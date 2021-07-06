#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
        while (_) try {
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
var fs = __importStar(require("fs"));
var readline = __importStar(require("readline"));
var clipboardy = __importStar(require("clipboardy"));
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var fileName, fileContents, filters, parameters, sqlQuery, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                fileName = process.argv[2];
                if (!fileName)
                    throw new Error('No file provided in command line arguments.');
                fileContents = fs.readFileSync(fileName).toString();
                filters = parseFiltersFromQuery(fileContents);
                return [4 /*yield*/, getParameters(filters)];
            case 1:
                parameters = _a.sent();
                sqlQuery = replaceFileVariables(fileContents, parameters);
                clipboardy.writeSync(removeExtraWhitespace(sqlQuery));
                console.log('Query has been copied to the clipboard.');
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('An error occurred: ' + error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getParameters = function (filters) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(process.argv.slice(3).length > 0)) return [3 /*break*/, 1];
                _a = process.argv.slice(3).reduce(function (acc, argv) {
                    var components = argv.split('=');
                    acc[components[0]] = components[1];
                    return acc;
                }, {});
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, getUserFilterValues(filters)];
            case 2:
                _a = _b.sent();
                _b.label = 3;
            case 3: return [2 /*return*/, _a];
        }
    });
}); };
var removeExtraWhitespace = function (str) {
    return str.replace(/\u0000/g, '');
};
var getUserFilterValues = function (filters) { return __awaiter(void 0, void 0, void 0, function () {
    var parameters, reader, _i, filters_1, filter, value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                parameters = {};
                reader = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                _i = 0, filters_1 = filters;
                _a.label = 1;
            case 1:
                if (!(_i < filters_1.length)) return [3 /*break*/, 4];
                filter = filters_1[_i];
                return [4 /*yield*/, getUserInput(reader, "Enter a value for " + filter.fieldName + ": ")];
            case 2:
                value = _a.sent();
                parameters[filter.fieldName] = value;
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                reader.close();
                return [2 /*return*/, parameters];
        }
    });
}); };
var getUserInput = function (reader, question) {
    return new Promise(function (resolve) {
        reader.question(question, function (input) {
            resolve(input);
        });
    });
};
/**
 * Parses SQL string for filters to add to Suitelet page
 * @param text - string to parse filters from
 * @returns - object containing filter name, type, and optional source (select fields only)
 */
var parseFiltersFromQuery = function (text) {
    var regexes = [/{% if (\S+) (\S+) %}/g, /{{(\S+)}}/g];
    var resultIndices = {
        filterKey: 1,
    };
    var parsedFilters = [];
    regexes.forEach(function (regex) {
        var _loop_1 = function () {
            var results = regex.exec(text);
            if (!results)
                return "break";
            var matchingFilters = parsedFilters.filter(function (filter) { return filter.fieldName === results[resultIndices.filterKey]; });
            if (matchingFilters.length > 0)
                return "continue";
            parsedFilters.push({
                fieldName: results[resultIndices.filterKey],
            });
        };
        while (true) {
            var state_1 = _loop_1();
            if (state_1 === "break")
                break;
        }
    });
    return parsedFilters;
};
/**
 * Replaces strings in double braces {{ }} with associated value for the key inside the braces
 * Example:
 * text = 'This is a {{testKey}}'
 * replacements = { testKey: 'Test' };
 * return value = 'This is a Test'
 * @param text - string containing text to be replaced
 * @param replacements - object where keys = text to replace without braces and values = replacement text
 * @returns - text string with all expressions replaced
 */
var replaceFileVariables = function (text, replacements) {
    for (var _i = 0, _a = Object.keys(replacements); _i < _a.length; _i++) {
        var key = _a[_i];
        text = text.replace(new RegExp("{{" + key + "}}", 'g'), replacements[key]);
    }
    text = replaceFileConditions(text, replacements);
    return text;
};
/**
 * Replaces if conditions based on existence of filter name in replacements
 * Example:
 *  text = `
 *    {% if testKey text %}
 *    FIRST BLOCK
 *    {% else %}
 *    SECOND BLOCK
 *    {% endif %}
 *  `
 *  replacements = { testKey: 'Test' }
 *  return value = 'FIRST BLOCK'
 * @param text - string containing text to be replaced
 * @param replacements - object where keys = text to replace and values = replacement text
 * @returns - text string with all expressions replaced
 */
var replaceFileConditions = function (text, replacements) {
    var regex = /{% if (\S+) (\S+) %}((?:(?!{%)[\S\s])+){% else %}((?:(?!{%)[\S\s])+){% endif %}/g;
    var resultIndices = {
        filterKey: 1,
        fieldType: 2,
        first: 3,
        second: 4,
    };
    var nullCount = 0;
    while (nullCount < 2) {
        var results = regex.exec(text);
        if (!results) {
            ++nullCount;
            continue;
        }
        nullCount = 0;
        var matchLength = results[0].length;
        text = text.substr(0, results.index) +
            (replacements[results[resultIndices.filterKey]] ?
                padWithWhitespace(results[resultIndices.first], matchLength) :
                padWithWhitespace(results[resultIndices.second], matchLength)) +
            text.substr(results.index + results[0].length);
    }
    return text;
};
var padWithWhitespace = function (text, length) {
    while (text.length < length) {
        text = text + '\u0000';
    }
    return text;
};
main();
