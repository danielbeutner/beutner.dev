const esbuild = require('esbuild');
const { getSize } = require('../../../utils/helper');

const OUTPUT_FILE_PATH = '/assets/scripts/main.js';
const ENTRY_POINT = __dirname + '/main.ts';
const isProd = process.env.ELEVENTY_ENV === 'production';

class Scripts {
  data() {
    const config = {
      entryPoints: [ENTRY_POINT],
      bundle: true,
      minify: isProd,
      sourcemap: isProd,
      target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
      outfile: OUTPUT_FILE_PATH,
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
      const code = result.outputFiles[0].text;

      console.log('built %s (%s kB)', OUTPUT_FILE_PATH, getSize(code));

      return code.toString();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

module.exports = Scripts;
