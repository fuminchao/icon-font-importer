"use strict";
import * as sass from 'node-sass';
import * as https from 'https';

function handleHttps(this: sass.AsyncContext, svg: string, prev: string) {

  return new Promise((r, j) => {

    const req = https.request('https://' + svg, (res) => {
      r(Object.assign(res, {sourceUrl: 'https://' + svg}));
    });

    req.on('error', j);

    req.end();
  });
};

export default handleHttps;