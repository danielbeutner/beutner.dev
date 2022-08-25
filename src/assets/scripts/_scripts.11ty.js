const esbuild = require('esbuild');
const { getSize } = require('../../../utils/helper');

const OUTPUT_FILE_PATH = '/assets/scripts/main.js';
const ENTRY_POINT = __dirname + '/main.ts';
const isProd = process.env.ELEVENTY_ENV === 'production';

class Scripts {
  data() {
    const config = {
      bundle: true,
      define: {
        PRODUCTION: isProd ? 'true' : 'false',
      },
      entryPoints: [ENTRY_POINT],
      minify: isProd,
      outfile: OUTPUT_FILE_PATH,
      sourcemap: !isProd ? 'inline' : false,
      target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
      write: false,
    };

    return {
      permalink: OUTPUT_FILE_PATH,
      eleventyExcludeFromCollections: true,
      config,
    };
  }

  async build(config) {
    const output = await esbuild.build(config);

    return output;
  }

  async render({ config }) {
    console.log('bundling scripts...');
    try {
      const result = await this.build(config);

      // We only use the first entry point as the script only
      // supports one file at a time
      const { text } = result.outputFiles.find(
        ({ path }) => path === OUTPUT_FILE_PATH
      );

      console.log('built %s (%s kB)', OUTPUT_FILE_PATH, getSize(text));

      return text.toString();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

module.exports = Scripts;
