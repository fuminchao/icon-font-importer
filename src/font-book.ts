import SvgFont from 'svgicons2svgfont';
import { WritableStreamBuffer } from 'stream-buffers';
import { Readable } from 'stream';
import svg2ttf from 'svg2ttf';
import ttf2woff2 from 'ttf2woff2';
import {once} from 'lodash-decorators';

const ttf2woff = require('ttf2woff');

import * as fs from 'fs';
import {noop} from 'lodash';

export class FontBook {

  private fontStream: SvgFont;
  private glyphIndex: number;
  private svgStream: WritableStreamBuffer;

  constructor(public readonly name: string) {
    console.log('NewBook');

    this.fontStream = new SvgFont({
      fontName: 'xxxxx',
      normalize: true,
      fontHeight: 2000,
      centerHorizontally: true,
      log: noop,
    });

    this.svgStream = new WritableStreamBuffer();
    this.fontStream.pipe(this.svgStream);

    // this.fontStream.pipe(fs.createWriteStream('/Users/mincfu/temp/hello.svg'))
    // .on('finish',function() {
    //   console.log('Font successfully created!')
    // })
    // .on('error',function(err) {
    //   console.log(err);
    // });

    this.glyphIndex = parseInt('E000', 16) - 1;
  }

  write(g: GlyphStream): Promise<number> {

    this.glyphIndex++;

    g.metadata = {
      unicode: [String.fromCharCode(this.glyphIndex)],
      name: 'i' + this.glyphIndex,
    };

    return new Promise((r, j) => {

      this.fontStream.write(g, (err) => {
        if (err) {
          j(err);
        } else {
          r(this.glyphIndex);
        }
      });
    });
  }

  @once
  ttf() {
    this.fontStream.end();
    const svgContent = this.svgStream.getContentsAsString('utf8');
    return Buffer.from(svg2ttf(svgContent, {}).buffer);
  }

  @once
  woff2() {
    return Buffer.from(ttf2woff2(this.ttf()).buffer);
  }

  @once
  woff() {
    return Buffer.from(ttf2woff(this.ttf()).buffer);
  }
}

export interface GlyphStream extends Readable {
  metadata: {
    unicode?: string[],
    name: string,
  }
}