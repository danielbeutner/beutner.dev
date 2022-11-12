const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginNavigation = require('@11ty/eleventy-navigation');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const filters = require('./utils/filters.js');
const transforms = require('./utils/transforms.js');
const shortcodes = require('./utils/shortcodes.js');
const markdownIt = require('markdown-it');
const markdownItImages = require('./utils/markdown-it-images.js');

const isProd = process.env.ELEVENTY_ENV === 'production';

module.exports = function (config) {
  // Plugins
  config.addPlugin(pluginRss);
  config.addPlugin(pluginNavigation);
  config.addPlugin(pluginSyntaxHighlight);

  // Template Filter
  config.addNunjucksFilter('dateToRfc3339', pluginRss.dateToRfc3339);

  // Layout aliases
  config.addLayoutAlias('base', 'base.njk');
  config.addLayoutAlias('post', 'post.njk');
  config.addLayoutAlias('snippet', 'snippet.njk');

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

  // Asset Watch Targets and copy
  config.addWatchTarget('./src/assets');
  config.addPassthroughCopy('src/assets/fonts/*');

  // Pass-through files
  config.addPassthroughCopy('src/site.webmanifest');

  // Markdown
  config.setLibrary(
    'md',
    markdownIt({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true,
    }).use(markdownItImages)
  );

  // Deep merge (default is "true" in 1.x)
  config.setDataDeepMerge(true);
  // Liquid options (default from 1.x)
  config.setLiquidOptions({ dynamicPartials: true, strictFilters: true });

  // Collections: Posts
  config.addCollection('posts', function (collection) {
    return collection
      .getFilteredByGlob('src/posts/**/*.md')
      .filter((item) => item.data.permalink !== false)
      .filter((item) => !(item.data.draft && isProd));
  });

  // Collections: Snippets
  config.addCollection('snippets', function (collection) {
    return collection.getFilteredByGlob('src/snippets/*.md');
  });

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
