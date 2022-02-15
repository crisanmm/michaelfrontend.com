const sass = require('sass');
const path = require('path');
const process = require('process');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const processCss = function (eleventyConfig) {
  eleventyConfig.addFilter('sassCompile', async (filePath) => {
    const previousDirname = __dirname;
    const filePathBasename = path.basename(filePath);
    const filePathDirname = path.dirname(filePath);
    const directoryToWorkIn = path.join(previousDirname, filePathDirname);

    process.chdir(directoryToWorkIn);

    let output;
    try {
      output = sass.compile(filePathBasename);
      output = await postcss([autoprefixer, cssnano]).process(output.css, { from: undefined });
    } catch (e) {
      console.log('🚀  -> file: sassPlugin.js  -> line 25  -> e', e);
    }

    process.chdir(previousDirname);
    return output;
  });
};

module.exports = processCss;
