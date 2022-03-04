const path = require('node:path');
const shortcodes = require('./shortcodes.js');

module.exports = function images_plugin(md, mdOptions) {
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    if (env.page.inputPath === undefined) return;

    const { dir: sourceDir } = path.parse(env.page.inputPath);
    const token = tokens[idx];
    const [, srcFileName] = token.attrs.find(([key]) => key === 'src');
    const [, altContent] = token.attrs.find(([key]) => key === 'alt');
    const src = path.join(sourceDir, srcFileName);
    const outputDir = path.join('public', env.page.url);

    // Arguments needed for images in markdown files.
    const alt = altContent.length > 0 ? altContent : token.content;

    // Needs to empty since the file is living next door to the generated html file
    const urlPath = '';

    // Used for the lazy loading feature
    const className = 'lazy-loading';

    // Skipping arguments and using their defaults
    const sizes = undefined;
    const formats = undefined;
    const widths = undefined;

    // reusing shortcode 'image' to generate the HTML right away
    return shortcodes.image(
      src,
      alt,
      sizes,
      className,
      formats,
      widths,
      urlPath,
      outputDir
    );
  };
};
