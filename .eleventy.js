const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const Image = require('@11ty/eleventy-img');
const htmlmin = require('html-minifier');
const sassPlugin = require('./sassPlugin');

function isImageFormatTransparent(src) {
  if (src.endsWith('.avif') || src.endsWith('.webp') || src.endsWith('.png')) return true;
}

async function imageShortcode(src, alt, sizes) {
  const formats = ['avif', 'webp', 'png'];
  if (!isImageFormatTransparent(src)) formats.push('jpeg');

  let metadata = await Image(src, {
    widths: [280, 560, 840, 1100, 1650, 2100, 2500, 3100],
    formats: formats,
    outputDir: '_site/img/',
  });
  console.log('🚀  -> file: .eleventy.js  -> line 19  -> metadata', metadata);

  let imageAttributes = {
    alt,
    sizes,
    loading: 'lazy',
    decoding: 'async',
  };

  const image = Image.generateHTML(metadata, imageAttributes, { whitespaceMode: 'inline' });
  console.log('🚀  -> file: .eleventy.js  -> line 28  -> image', image);
  return image;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, { alwaysWrapLineHighlights: true });
  eleventyConfig.addPlugin(sassPlugin);

  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);
  eleventyConfig.addLiquidShortcode('image', imageShortcode);
  eleventyConfig.addJavaScriptFunction('image', imageShortcode);

  eleventyConfig.addPassthroughCopy('src/img');
  eleventyConfig.addPassthroughCopy('src/styles/fonts');

  eleventyConfig.addWatchTarget('src/styles');

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
