const pluginRss = require('@11ty/eleventy-plugin-rss');
const filters = require('./utils/filters.js');
const transforms = require('./utils/transforms.js');
const shortcodes = require('./utils/shortcodes.js');
const markdownIt = require('markdown-it');

module.exports = function (config) {
  // Plugins
  config.addPlugin(pluginRss);
  config.addNunjucksFilter('dateToRfc3339', pluginRss.dateToRfc3339);

  // Layout aliases
  config.addLayoutAlias('base', 'base.njk');
  config.addLayoutAlias('post', 'post.njk');

  // Filters
  Object.keys(filters).forEach((filterName) => {
    config.addFilter(filterName, filters[filterName]);
  });

  // Transforms
  Object.keys(transforms).forEach((transformName) => {
    config.addTransform(transformName, transforms[transformName]);
  });

  // Shortcodes
  Object.keys(shortcodes).forEach((shortcodeName) => {
    config.addShortcode(shortcodeName, shortcodes[shortcodeName]);
  });

  // Asset Watch Targets
  config.addWatchTarget('./src/assets');

  // Pass-through files
  config.addPassthroughCopy('src/robots.txt');
  config.addPassthroughCopy('src/site.webmanifest');

  // Markdown
  config.setLibrary(
    'md',
    markdownIt({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true,
    })
  );

  // Deep merge
  config.setDataDeepMerge(true);

  // Base Config
  return {
    dir: {
      input: 'src',
      output: 'public',
      includes: 'includes',
      layouts: 'layouts',
      data: 'data',
    },
    templateFormats: ['njk', 'md', '11ty.js'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
