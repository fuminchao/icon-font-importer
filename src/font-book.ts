import SvgFont from 'svgicons2svgfont';
import { WritableStreamBuffer } from 'stream-buffers';
import { Readable } from 'stream';
import svg2ttf from 'svg2ttf';
import ttf2woff2 from 'ttf2woff2';
import {once} from 'lodash-decorators';

const ttf2woff = require('ttf2woff');

import {noop} from 'lodash';

export class FontBook {

  private fontStream: SvgFont;
  private glyphIndex: number;
  private svgStream: WritableStreamBuffer;

  private glyphs: {[sourceUrl: string]: number} = {};

  constructor(public readonly name: string) {

    this.fontStream = new SvgFont({
      fontName: name,
      normalize: true,
      fontHeight: 2000,
      centerHorizontally: true,
      log: noop,
    });

    this.svgStream = new WritableStreamBuffer();
    this.fontStream.pipe(this.svgStream);

    this.glyphIndex = parseInt('E000', 16) - 1;
  }


  write(g: GlyphStream): Promise<number> {

    if (!this.glyphs[g.sourceUrl]) {

      const index = ++this.glyphIndex;
      this.glyphs[g.sourceUrl] = index;

      return Promise.resolve(g.open()).then(sm => {

        (sm as any).metadata = {
          unicode: [String.fromCharCode(this.glyphIndex)],
          name: 'i' + this.glyphIndex,
        };
        return sm;

      }).then(sm => new Promise((r, j) => {

        this.fontStream.write(sm, (err) => {
          if (err) {
            j(err);
          } else {
            r(this.glyphIndex);
          }
        });
      }));

    } else {
      return Promise.resolve(this.glyphs[g.sourceUrl]);
    }

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

export interface GlyphStream {
  sourceUrl: string,
  open(): Readable,
}