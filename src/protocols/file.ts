import * as fs from 'fs';
import * as path from 'path';
import * as sass from 'node-sass';

function handleFile(this: sass.AsyncContext, svg: string, prev: string) {

  const includePaths = Array.prototype.concat.call([], this.options.includePaths || []).join(path.delimiter);

  const findPaths = [
    path.resolve(path.dirname(prev)),
  ].concat(includePaths.split(path.delimiter).map(p => path.resolve(process.cwd(), p)));

  const foundPath = findPaths.find(p => fs.existsSync(path.resolve(p, svg)));

  if (foundPath) {
    const sourceUrl = path.resolve(foundPath, svg);
    return {sourceUrl, open: () => fs.createReadStream(path.resolve(foundPath, svg))};
  } else {
    throw new Error('X404:' + svg);
  }
};

export default handleFile;