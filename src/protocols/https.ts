"use strict";
import * as sass from 'node-sass';
import * as https from 'https';

function handleHttps(this: sass.AsyncContext, svg: string, prev: string) {

  return new Promise((r, j) => {

    const req = https.request('https://' + svg, r);
    req.on('error', j);

    req.end();
  });
};

export default handleHttps;