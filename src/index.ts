"use strict";

import * as path from 'path';
import * as _ from 'lodash';

import * as sass from 'node-sass';

import { FontBook, GlyphStream } from './font-book';

const book1 = new FontBook('iconfont1');

function importSVG(svg: string, prev: string, sass: sass.Context) {

  const tokens = svg.split('://');

  return Promise.resolve(require(path.join(__dirname, 'protocols', tokens[0])).default.call(sass, tokens[1], prev)).then((cs: GlyphStream) => {
    return book1.write(cs);
  }, (err) => {
    return Promise.reject(err);
  });
}

let symbolOCallback = Symbol("sass.SymbolOCallback");

const importSvgAsIconFont: sass.AsyncImporter = function(url, prev, done) {

  if ((this as any)[symbolOCallback] === undefined) {
    (this as any)[symbolOCallback] = this.callback;

    this.callback = function () {
      return (this as any)[symbolOCallback].apply(this, arguments);
    };
  }

  // TODO stdin == this.options.data

  const tokens = /^iconfont\+(.*)$/.exec(url) || [];
  if (tokens.length > 0) {

    if (/^face:\/\/(.*)$/.exec(tokens[1])) {

      done({
        contents: `
          &{ font-family:"${book1.name}"; }
          @at-root { @font-face {
            font-family: "${book1.name}";
            src:url("data:font/woff2;base64,${book1.woff2().toString('base64')}") format("woff2");
          }}`
      });

    } else {

      importSVG(tokens[1], prev, this).then((code: number) => {
        return done({contents: `&{content: \"\\0${code.toString(16)}\";}`});
      }, (err) => {
        return done(new Error(err.toString()));
      });
    }

    return;
  } else {
    return null;
  }
};

module.exports = importSvgAsIconFont;