const Image = require('@11ty/eleventy-img');

module.exports = {
  image: function (
    src,
    alt,
    sizes = '100vw',
    className,
    formats = ['jpeg', 'webp'],
    widths = [null, 320, 768],
    urlPath = '',
    outputDir
  ) {
    const options = {
      widths,
      formats,
      outputDir,
      urlPath,
    };

    // Generate images but we don't wait for it
    Image(src, options);

    const imageAttributes = {
      alt,
      class: className,
      decoding: 'async',
      loading: 'lazy',
      sizes,
    };

    let imageMetadata = Image.statsSync(src, options);

    return Image.generateHTML(imageMetadata, imageAttributes);
  },
};
