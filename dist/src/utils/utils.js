"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDateFormat = exports.delay = void 0;
var delay = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.delay = delay;
var getCurrentDateFormat = function () {
    var date = new Date();
    return date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
};
exports.getCurrentDateFormat = getCurrentDateFormat;
