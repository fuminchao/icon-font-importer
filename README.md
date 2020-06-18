# icon-font-importer

### Sample usage
```SCSS

.icon-a-rel-path:after {
  @import 'iconfont+file://svg/font-solid.svg';
}

.test-b-abs-path:after {
  @import 'iconfont+file:///Users/xxxxx/icon-font-importer/test/svg/font-solid.svg';
}

.test-c-https:after {
  @import 'iconfont+https://developer.mozilla.org/static/general/external-link.fb3c293b9226.svg';
}

[class*=test-]:after {
  @import 'iconfont+face://woff2+woff';
}
```

```Bash
npx node-sass --output test --importer=./build/index.js test/test1.scss
```