"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
function handleFile(svg, prev) {
    var includePaths = Array.prototype.concat.call([], this.options.includePaths || []).join(path.delimiter);
    var findPaths = [
        path.resolve(path.dirname(prev)),
    ].concat(includePaths.split(path.delimiter).map(function (p) { return path.resolve(process.cwd(), p); }));
    var foundPath = findPaths.find(function (p) { return fs.existsSync(path.resolve(p, svg)); });
    if (foundPath) {
        var sourceUrl = path.resolve(foundPath, svg);
        return { sourceUrl: sourceUrl, open: function () { return fs.createReadStream(path.resolve(foundPath, svg)); } };
    }
    else {
        throw new Error('X404:' + svg);
    }
}
;
exports.default = handleFile;
