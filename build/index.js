"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var font_book_1 = require("./font-book");
var book1 = new font_book_1.FontBook('iconfont1');
function importSVG(svg, prev, sass) {
    var tokens = svg.split('://');
    return Promise.resolve(require(path.join(__dirname, 'protocols', tokens[0])).default.call(sass, tokens[1], prev)).then(function (cs) {
        return book1.write(cs);
    }, function (err) {
        return Promise.reject(err);
    });
}
var symbolOCallback = Symbol("sass.SymbolOCallback");
var importSvgAsIconFont = function (url, prev, done) {
    if (this[symbolOCallback] === undefined) {
        this[symbolOCallback] = this.callback;
        this.callback = function () {
            return this[symbolOCallback].apply(this, arguments);
        };
    }
    // TODO stdin == this.options.data
    var tokens = /^iconfont\+(.*)$/.exec(url) || [];
    if (tokens.length > 0) {
        if (/^face:\/\/(.*)$/.exec(tokens[1])) {
            done({
                contents: "\n          &{ font-family:\"" + book1.name + "\"; }\n          @at-root { @font-face {\n            font-family: \"" + book1.name + "\";\n            src:url(\"data:font/woff2;base64," + book1.woff2().toString('base64') + "\") format(\"woff2\");\n          }}"
            });
        }
        else {
            importSVG(tokens[1], prev, this).then(function (code) {
                return done({ contents: "&{content: \"\\0" + code.toString(16) + "\";}" });
            }, function (err) {
                return done(new Error(err.toString()));
            });
        }
        return;
    }
    else {
        return null;
    }
};
module.exports = importSvgAsIconFont;
