const sass = require('sass');
const path = require('path');
const process = require('process');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

async function compileSass(relativeFilePath) {
  const rootDir = process.cwd();
  const absoluteFilePath = path.join(rootDir, relativeFilePath);

  let output;
  try {
    output = sass.compile(absoluteFilePath);
    output = await postcss([autoprefixer, cssnano]).process(output.css, { from: undefined });
    return output;
  } catch (e) {
    console.log('🚀  -> file: sassPlugin.js  -> line 25  -> e', e);
  }
}

const compileSassShortcode = function (eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode('compileSass', compileSass);
  eleventyConfig.addLiquidShortcode('compileSass', compileSass);
  eleventyConfig.addJavaScriptFunction('compileSass', compileSass);
};

module.exports = compileSassShortcode;
