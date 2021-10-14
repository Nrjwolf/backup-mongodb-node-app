"use strict";
// Thanks to https://stackoverflow.com/a/39906526
Object.defineProperty(exports, "__esModule", { value: true });
exports.niceBytes = void 0;
var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
var niceBytes = function (x) {
    var l = 0, n = parseInt(x.toString(), 10) || 0;
    while (n >= 1024 && ++l) {
        n = n / 1024;
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
};
exports.niceBytes = niceBytes;
