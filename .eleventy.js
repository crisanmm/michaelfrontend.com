const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const htmlmin = require('html-minifier');
const svgContents = require('eleventy-plugin-svg-contents');
const postcss = require('postcss');
const { execSync } = require('child_process');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(svgContents);

  eleventyConfig.addPassthroughCopy('src/styles');
  eleventyConfig.addPassthroughCopy('src/img');

  eleventyConfig.addTransform('process-html', async function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
  });

  // eleventyConfig.on('eleventy.after', async () => {
  //   execSync('npx postcss src/styles/all.scss --output _site/styles/all.css');
  // });
};
