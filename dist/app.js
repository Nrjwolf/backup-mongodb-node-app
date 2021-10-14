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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require('./src/utils/colorsLog');
var dumpWorks = __importStar(require("./src/exec/dumpWorks"));
var telegram = __importStar(require("./src/telegram/telegram"));
var utils_1 = require("./src/utils/utils");
var app_config_1 = __importDefault(require("./src/configs/app.config"));
var init = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, telegram.init()];
            case 1:
                _a.sent();
                console.log("\u2705\u2705\u2705 Initialization COMPLETE!".green());
                runProcess();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log("\u274C\u274C\u274C Initialization FAILED!".red());
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var runProcess = function () { return __awaiter(void 0, void 0, void 0, function () {
    var delayTimeHours, delayTime, dumpLog;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                delayTimeHours = app_config_1.default.DUMP_PROCESS_INTERVAL // run every n hours
                ;
                delayTime = delayTimeHours * (60 * (60 * 1000));
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 6];
                return [4 /*yield*/, dumpWorks.start()];
            case 2:
                dumpLog = _a.sent();
                return [4 /*yield*/, telegram.logText("<pre>" + dumpLog.log + "</pre>")];
            case 3:
                _a.sent();
                return [4 /*yield*/, telegram.logFile(dumpLog.archivePath)];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, utils_1.delay)(delayTime)];
            case 5:
                _a.sent();
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); };
init();
