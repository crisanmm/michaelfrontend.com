const path = require('path');
const esbuild = require('esbuild');

async function bundleJS(relativeFilePath) {
  const rootDir = process.cwd();
  const absoluteFilePath = path.join(rootDir, relativeFilePath);

  let output;
  try {
    output = await esbuild.build({
      entryPoints: [absoluteFilePath],
      write: false,
      minify: true,
      bundle: true,
    });
    return output.outputFiles[0].text;
  } catch (e) {}
}

const bundleJSShortcode = function (eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode('bundleJS', bundleJS);
  eleventyConfig.addLiquidShortcode('bundleJS', bundleJS);
  eleventyConfig.addJavaScriptFunction('bundleJS', bundleJS);
};

module.exports = bundleJSShortcode;
