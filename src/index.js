const fs = require('fs');
const mkdirp = require('mkdirp');
const morgan = require('koa-morgan');
const rfs = require('rotating-file-stream');

const isProduction = process.env.NODE_ENV === 'production';
const skipSuccessed = isProduction && false;

const defaultOptions = {
  size: '16M',
  interval: '1d',
  compress: 'gzip',
  path: process.cwd(),
  file: 'http.log',
  skip: (_, response) => response.statusCode < 400
};

module.exports = options => {
  const _options = Object.assign(
    {},
    defaultOptions,
    options || {}
  );

  const { file, skip, ...rfsOptions } = _options;
  if (!file || typeof file !== 'string') throw new TypeError('invalid log file name');

  const { path } = rfsOptions;
  if (!path || typeof path !== 'string') throw new TypeError('invalid path to logs');

  fs.existsSync(path) || mkdirp.sync(path);

  const settings = {
    // create a rotating write stream for http-logger
    stream: rfs(file, rfsOptions),
    skip: typeof skip === 'function' ? skip : null
  };

  return morgan('combined', _options);
};
