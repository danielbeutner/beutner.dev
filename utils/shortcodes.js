const path = require('node:path');
const Image = require('@11ty/eleventy-img');

module.exports = {
  image: function (
    src,
    alt,
    sizes = '100vw',
    className,
    formats = ['jpeg', 'webp', 'avif'],
    widths = [null, 320, 768],
    urlPath = '/assets/images/',
    outputDir = path.join('public', 'assets', 'images')
  ) {
    if (alt === undefined) {
      throw new Error(`You need to set an "alt" attribute for ${src}`);
    }

    const options = {
      widths,
      formats,
    };

    if (urlPath !== undefined) {
      options.urlPath = urlPath;
    }

    if (outputDir !== undefined) {
      options.outputDir = outputDir;
    }

    // Generate images but we don't wait for it
    Image(src, options);

    const imageAttributes = {
      alt,
      decoding: 'async',
      loading: 'lazy',
      sizes,
    };

    if (className !== undefined) {
      imageAttributes.class = className;
    }

    let imageMetadata = Image.statsSync(src, options);

    return Image.generateHTML(imageMetadata, imageAttributes);
  },
};
