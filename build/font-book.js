"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var svgicons2svgfont_1 = __importDefault(require("svgicons2svgfont"));
var stream_buffers_1 = require("stream-buffers");
var svg2ttf_1 = __importDefault(require("svg2ttf"));
var ttf2woff2_1 = __importDefault(require("ttf2woff2"));
var lodash_decorators_1 = require("lodash-decorators");
var ttf2woff = require('ttf2woff');
var lodash_1 = require("lodash");
var FontBook = /** @class */ (function () {
    function FontBook(name) {
        this.name = name;
        this.glyphs = {};
        this.fontStream = new svgicons2svgfont_1.default({
            fontName: name,
            normalize: true,
            fontHeight: 2000,
            centerHorizontally: true,
            log: lodash_1.noop,
        });
        this.svgStream = new stream_buffers_1.WritableStreamBuffer();
        this.fontStream.pipe(this.svgStream);
        this.glyphIndex = parseInt('E000', 16) - 1;
    }
    FontBook.prototype.write = function (g) {
        var _this = this;
        if (!this.glyphs[g.sourceUrl]) {
            var index = ++this.glyphIndex;
            this.glyphs[g.sourceUrl] = index;
            return Promise.resolve(g.open()).then(function (sm) {
                sm.metadata = {
                    unicode: [String.fromCharCode(_this.glyphIndex)],
                    name: 'i' + _this.glyphIndex,
                };
                return sm;
            }).then(function (sm) { return new Promise(function (r, j) {
                _this.fontStream.write(sm, function (err) {
                    if (err) {
                        j(err);
                    }
                    else {
                        r(_this.glyphIndex);
                    }
                });
            }); });
        }
        else {
            return Promise.resolve(this.glyphs[g.sourceUrl]);
        }
    };
    FontBook.prototype.ttf = function () {
        this.fontStream.end();
        var svgContent = this.svgStream.getContentsAsString('utf8');
        return Buffer.from(svg2ttf_1.default(svgContent, {}).buffer);
    };
    FontBook.prototype.woff2 = function () {
        return Buffer.from(ttf2woff2_1.default(this.ttf()).buffer);
    };
    FontBook.prototype.woff = function () {
        return Buffer.from(ttf2woff(this.ttf()).buffer);
    };
    __decorate([
        lodash_decorators_1.once
    ], FontBook.prototype, "ttf", null);
    __decorate([
        lodash_decorators_1.once
    ], FontBook.prototype, "woff2", null);
    __decorate([
        lodash_decorators_1.once
    ], FontBook.prototype, "woff", null);
    return FontBook;
}());
exports.FontBook = FontBook;
