const path = require('node:path');
const shortcodes = require('./shortcodes.js');

module.exports = function images_plugin(md, mdOptions) {
  const defaultImageRenderer = md.renderer.rules.image;

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    if (env.page.inputPath === undefined) return;

    const { dir: sourceDir } = path.parse(env.page.inputPath);
    const token = tokens[idx];
    const [, srcFileName] = token.attrs.find(([key]) => key === 'src');
    const src = path.join(sourceDir, srcFileName);
    const outputDir = path.join('public', env.page.url);
    const alt = '';
    const className = 'lazy-loading';
    const sizes = undefined;
    const formats = undefined;
    const urlPath = undefined;
    const widths = undefined;

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
