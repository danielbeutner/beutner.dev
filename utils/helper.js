const debug = require('debug');

const NAMESPACE = 'btnr';

function getSize(string) {
  const buffer = Buffer.from(string, 'utf8');

  return Number(buffer.byteLength / Math.pow(1024, 1))
    .toFixed(2)
    .toString();
}

function createDebug(name, namespace = NAMESPACE) {
  return debug(`${namespace}:${name}`);
}

module.exports = {
  createDebug,
  getSize,
};
