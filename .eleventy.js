const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginNavigation = require('@11ty/eleventy-navigation');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const filters = require('./utils/filters.js');
const transforms = require('./utils/transforms.js');
const shortcodes = require('./utils/shortcodes.js');
const markdownIt = require('markdown-it');
const UpgradeHelper = require('@11ty/eleventy-upgrade-help');

module.exports = function (config) {
  // Helper for upgrading to 1.x
  config.addPlugin(UpgradeHelper);

  // Plugins
  config.addPlugin(pluginRss);
  config.addPlugin(pluginNavigation);
  config.addPlugin(pluginSyntaxHighlight);

  // Template Filter
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

  // Deep merge (default is "true" in 1.x)
  config.setDataDeepMerge(true);
  // Liquid options (default from 1.x)
  config.setLiquidOptions({ dynamicPartials: true, strictFilters: true });

  // Collections: Posts
  config.addCollection('posts', function (collection) {
    return collection
      .getFilteredByGlob('src/posts/**/*.md')
      .filter((item) => item.data.permalink !== false)
      .filter((item) => !(item.data.draft && IS_PRODUCTION));
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
