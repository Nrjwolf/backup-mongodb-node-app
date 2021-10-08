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
exports.start = void 0;
var child = __importStar(require("child_process"));
var db_config_1 = __importDefault(require("../configs/db.config"));
var BACKUP_PATH = 'backup';
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                    return __awaiter(this, void 0, void 0, function () {
                        var i, db, j, collection, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 7, , 8]);
                                    // удаляем предыдущий backup
                                    child.exec("rm -r " + BACKUP_PATH);
                                    i = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < db_config_1.default.bases.length)) return [3 /*break*/, 6];
                                    db = db_config_1.default.bases[i];
                                    j = 0;
                                    _a.label = 2;
                                case 2:
                                    if (!(j < db.collections.length)) return [3 /*break*/, 5];
                                    collection = db.collections[j];
                                    console.log("\u0414\u0430\u043C\u043F " + db.name + " " + collection);
                                    return [4 /*yield*/, mongoExport(db.name, collection)];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4:
                                    j++;
                                    return [3 /*break*/, 2];
                                case 5:
                                    i++;
                                    return [3 /*break*/, 1];
                                case 6:
                                    // делаем зип архив
                                    zip(BACKUP_PATH, 'backup');
                                    resolve(null);
                                    return [3 /*break*/, 8];
                                case 7:
                                    error_1 = _a.sent();
                                    console.error(error_1);
                                    reject(error_1);
                                    return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    });
                })];
            case 1: 
            // Делается сейв всех коллекций заданных в db.config.ts
            return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.start = start;
var mongoExport = function (dbName, collection) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                    try {
                        var commandMongoExport = "mongoexport --db " + dbName + " -c " + collection + " --out " + BACKUP_PATH + "/" + dbName + "/" + collection + ".json";
                        var foo = child.exec(commandMongoExport, function (error, stdout, stderr) {
                            resolve(null);
                        });
                    }
                    catch (error) {
                        console.error(error);
                        reject(error);
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var zip = function (folderToZip, outName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                    try {
                        var commandMongoExport = "zip -r " + outName + ".zip " + folderToZip;
                        child.exec(commandMongoExport, function (error, stdout, stderr) {
                            console.log(stdout);
                            resolve(null);
                        });
                    }
                    catch (error) {
                        console.error(error);
                        reject(error);
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
