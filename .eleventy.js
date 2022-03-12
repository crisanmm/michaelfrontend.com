const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const faviconPlugin = require('eleventy-favicon');
const htmlmin = require('html-minifier');
const compileSassShortcode = require('./shortcodes/compileSass');
const imageShortcode = require('./shortcodes/image');
const bundleJSShortcode = require('./shortcodes/bundleJS');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, { alwaysWrapLineHighlights: true });
  eleventyConfig.addPlugin(compileSassShortcode);
  eleventyConfig.addPlugin(imageShortcode);
  eleventyConfig.addPlugin(bundleJSShortcode);
  eleventyConfig.addPlugin(faviconPlugin);

  eleventyConfig.addPassthroughCopy('src/img/icons');
  eleventyConfig.addPassthroughCopy('src/styles/fonts');

  eleventyConfig.addWatchTarget('src/styles');
  eleventyConfig.addWatchTarget('src/js');

  eleventyConfig.addTransform('process-html', async function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
  });
};
