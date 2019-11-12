const fs = require('fs');
const mkdirp = require('mkdirp');
const morgan = require('koa-morgan');
const rfs = require('rotating-file-stream');

const defaultOptions = {
  size: '16M',
  interval: '1d',
  compress: 'gzip',
  path: process.cwd(),
  file: 'http.log',
  // Express format of input parameters, cause 'morgan' itself belongs to Express, not Koa
  skip: (_, response) => response.statusCode < 400
};

module.exports = options => {
  const _options = Object.assign(
    {},
    defaultOptions,
    options || {}
  );

  const { file, skip, ...rfsOptions } = _options;
  if (!file || typeof file !== 'string') throw new TypeError('Invalid log file name');

  const { path } = rfsOptions;
  if (!path || typeof path !== 'string') throw new TypeError('Invalid path to logs');

  fs.existsSync(path) || mkdirp.sync(path);

  const settings = {
    // create a rotating write stream for http-logger
    stream: rfs(file, rfsOptions),
    skip: typeof skip === 'function' ? skip : null
  };

  return morgan('combined', _options);
};
