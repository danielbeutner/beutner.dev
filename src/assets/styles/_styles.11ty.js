const fs = require('node:fs');
const path = require('node:path');
const atImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('postcss');
const postcssNested = require('postcss-nested');
const { getSize, createDebug } = require('../../../utils/helper');

const debug = createDebug('styles');
const FILE_NAME = 'main.css';
const OUTPUT_FILE_PATH = '/assets/styles/main.css';
const isProd = process.env.ELEVENTY_ENV === 'production';

class Styles {
  data() {
    const entryFile = path.join(__dirname, `/${FILE_NAME}`);
    const css = fs.readFileSync(entryFile).toString();

    return {
      permalink: OUTPUT_FILE_PATH,
      eleventyExcludeFromCollections: true,
      entryFile,
      css,
    };
  }

  async transform(data) {
    const plugins = [atImport, autoprefixer, postcssNested];

    if (isProd) {
      plugins.push(cssnano);
    }

    const output = await postcss(plugins).process(data.css, {
      from: data.entryFile,
      to: OUTPUT_FILE_PATH,
    });

    return output;
  }

  async render(data) {
    debug('processing styles...');
    try {
      const result = await this.transform(data);

      debug('built %s (%s kB)', OUTPUT_FILE_PATH, getSize(result.css));

      return result.css.toString();
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}

module.exports = Styles;
