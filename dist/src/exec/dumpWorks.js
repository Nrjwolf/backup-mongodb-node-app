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
exports.mongorestore = exports.start = void 0;
var mongodb_1 = require("mongodb");
var child = __importStar(require("child_process"));
var fs = __importStar(require("fs"));
var zip_a_folder_1 = require("zip-a-folder");
var env_config_1 = __importDefault(require("../configs/env.config"));
var niceBytes_1 = require("../utils/niceBytes");
var BACKUP_PATH = 'dump';
var mongURI = env_config_1.default.MONG_URI;
var mongClient = new mongodb_1.MongoClient(mongURI, {});
/**
 *
 * @returns Collections export log
 */
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                    return __awaiter(this, void 0, void 0, function () {
                        var result, dbsResult, i, db, archivePath, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 9, , 10]);
                                    result = {
                                        log: '',
                                        archivePath: '',
                                    };
                                    // delete previous backup
                                    child.exec("rm -r " + BACKUP_PATH);
                                    return [4 /*yield*/, mongoConnect()];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, getAllDatabases()];
                                case 2:
                                    dbsResult = _a.sent();
                                    i = 0;
                                    _a.label = 3;
                                case 3:
                                    if (!(i < dbsResult.databases.length)) return [3 /*break*/, 6];
                                    db = dbsResult.databases[i];
                                    return [4 /*yield*/, mongodump(db.name)];
                                case 4:
                                    _a.sent();
                                    result.log += db.name + " " + (0, niceBytes_1.niceBytes)(db.sizeOnDisk) + "\n";
                                    _a.label = 5;
                                case 5:
                                    i++;
                                    return [3 /*break*/, 3];
                                case 6:
                                    archivePath = BACKUP_PATH + ".zip";
                                    return [4 /*yield*/, (0, zip_a_folder_1.zip)(BACKUP_PATH, archivePath)];
                                case 7:
                                    _a.sent();
                                    result.log += "\nZip archive ~ " + getFileSizeMb(archivePath) + "mb";
                                    result.archivePath = archivePath;
                                    return [4 /*yield*/, mongClient.close()];
                                case 8:
                                    _a.sent();
                                    resolve(result);
                                    console.log(result.log);
                                    return [3 /*break*/, 10];
                                case 9:
                                    error_1 = _a.sent();
                                    console.error(error_1);
                                    reject(error_1);
                                    return [3 /*break*/, 10];
                                case 10: return [2 /*return*/];
                            }
                        });
                    });
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.start = start;
var mongoConnect = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                    try {
                        mongClient
                            .connect()
                            .then(function (client) {
                            resolve(null);
                        });
                    }
                    catch (error) {
                        reject(error);
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var getAllDatabases = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                    try {
                        mongClient.db().admin().listDatabases().then(function (dbs) {
                            resolve(dbs);
                        });
                    }
                    catch (error) {
                        reject(error);
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var getAllCollections = function (dbName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mongClient.db(dbName).listCollections().toArray()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var mongodump = function (dbName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                    try {
                        var collectionPath_1 = BACKUP_PATH + "/" + dbName + "/";
                        var commandMongoExport = "mongodump --db " + dbName;
                        child.exec(commandMongoExport, function (error, stdout, stderr) {
                            resolve(collectionPath_1);
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
var mongorestore = function (dir) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                    try {
                        var commandMongoExport = "mongorestore " + dir;
                        child.exec(commandMongoExport, function (error, stdout, stderr) {
                            resolve(stdout);
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
exports.mongorestore = mongorestore;
var getFileSizeMb = function (path) {
    var stats = fs.statSync(path);
    var fileSizeInBytes = stats.size;
    var mb = fileSizeInBytes / (1024 * 1024);
    return mb.toFixed(2);
};
