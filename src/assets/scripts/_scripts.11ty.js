const swc = require('@swc/core');
const { config } = require('@swc/core/spack');
const { getSize, createDebug } = require('../../../utils/helper');

const debug = createDebug('scripts');
const OUTPUT_FILE_PATH = '/assets/scripts/main.js';
const isProd = process.env.ELEVENTY_ENV === 'production';

class Scripts {
  data() {
    const spackConfig = config({
      mode: isProd ? 'production' : 'none',
      target: 'browser',
      entry: {
        main: __dirname + '/main.ts',
      },
      module: {},
    });

    return {
      permalink: OUTPUT_FILE_PATH,
      eleventyExcludeFromCollections: true,
      spackConfig,
    };
  }

  async transform(spackConfig) {
    const output = await swc.bundle(spackConfig);

    return output;
  }

  async render({ spackConfig }) {
    debug('bundling scripts...');
    try {
      const {
        main: { code },
      } = await this.transform(spackConfig);

      debug('built %s (%s kB)', OUTPUT_FILE_PATH, getSize(code));

      return code;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

module.exports = Scripts;
