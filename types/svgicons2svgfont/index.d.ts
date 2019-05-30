import { Readable, Writable, Duplex } from "stream";

interface IOption {
  fontName?: string,
  normalize?: boolean,
  fontHeight?: number,
  centerHorizontally?: boolean,
  log?: () => void,
}

export default class svgicons2svgfont extends Duplex {
  constructor(option: IOption);
}