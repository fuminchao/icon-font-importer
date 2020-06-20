"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var https = __importStar(require("https"));
function handleHttps(svg, prev) {
    return new Promise(function (r, j) {
        var req = https.request('https://' + svg, function (res) {
            r({
                sourceUrl: 'https://' + svg,
                open: function () { return res; },
            });
        });
        req.on('error', j);
        req.end();
    });
}
;
exports.default = handleHttps;
