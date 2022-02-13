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
exports.logFile = exports.logText = exports.onMessage = exports.init = exports.botInfo = exports.bot = void 0;
var node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
var download_1 = __importDefault(require("download"));
var extract_zip_1 = __importDefault(require("extract-zip"));
var child = __importStar(require("child_process"));
var env_config_1 = __importDefault(require("../configs/env.config"));
var path_1 = __importDefault(require("path"));
var dumpWorks_1 = require("../exec/dumpWorks");
var telegramBotReplies_config_1 = __importDefault(require("../configs/telegramBotReplies.config"));
var app_1 = require("../../app");
var utils_1 = require("../utils/utils");
var DOWNLOADED_PATH = 'downloaded';
exports.bot = new node_telegram_bot_api_1.default(env_config_1.default.TELEGRAM_BOT_TOKEN, { polling: true });
var init = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.bot.getMe()];
            case 1:
                exports.botInfo = _a.sent();
                exports.bot.on('message', exports.onMessage);
                console.log("\u2705 Telegram bot @" + exports.botInfo.username + " initialized!");
                (0, exports.logText)(telegramBotReplies_config_1.default.other.bot_started);
                return [2 /*return*/];
        }
    });
}); };
exports.init = init;
var onMessage = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var telegram_file, telegram_url, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (((_a = msg.from) === null || _a === void 0 ? void 0 : _a.id.toString()) != env_config_1.default.ADMIN_TELEGRAM_ID)
                    return [2 /*return*/];
                if (msg.text == '/start') {
                    (0, app_1.dumpAndSendToTelegram)();
                }
                if (!msg.document) return [3 /*break*/, 7];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                exports.bot.sendMessage(msg.from.id, telegramBotReplies_config_1.default.restore.restore_started);
                // delete previous backup
                child.exec("rm -r " + DOWNLOADED_PATH);
                return [4 /*yield*/, exports.bot.getFile(msg.document.file_id)];
            case 2:
                telegram_file = _b.sent();
                telegram_url = "https://api.telegram.org/file/bot" + env_config_1.default.TELEGRAM_BOT_TOKEN + "/" + telegram_file.file_path;
                return [4 /*yield*/, (0, download_1.default)(telegram_url, DOWNLOADED_PATH)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, extract_zip_1.default)(DOWNLOADED_PATH + "/" + path_1.default.basename(telegram_file.file_path), { dir: process.cwd() + "/" + DOWNLOADED_PATH })
                    // restore
                ];
            case 4:
                _b.sent();
                // restore
                return [4 /*yield*/, (0, dumpWorks_1.mongorestore)("" + DOWNLOADED_PATH)];
            case 5:
                // restore
                _b.sent();
                exports.bot.sendMessage(msg.from.id, telegramBotReplies_config_1.default.restore.restore_success);
                return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                exports.bot.sendMessage(msg.from.id, telegramBotReplies_config_1.default.restore.restore_fail);
                exports.bot.sendMessage(msg.from.id, err_1.message);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.onMessage = onMessage;
var logText = function (text) { return __awaiter(void 0, void 0, void 0, function () {
    var options;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                options = {
                    parse_mode: "HTML",
                };
                return [4 /*yield*/, exports.bot.sendMessage(env_config_1.default.TELEGRAM_CHAT_TO_LOG, text, options)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.logText = logText;
var logFile = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var botMe, fileOptions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.bot.getMe()];
            case 1:
                botMe = _a.sent();
                fileOptions = {
                    filename: "Mongodump " + botMe.first_name + " " + (0, utils_1.getCurrentDateFormat)() + ".zip",
                    contentType: 'application/octet-stream',
                };
                return [4 /*yield*/, exports.bot.sendDocument(env_config_1.default.TELEGRAM_CHAT_TO_LOG, path, {}, fileOptions)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.logFile = logFile;
