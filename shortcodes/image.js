const Image = require('@11ty/eleventy-img');

function isImageFormatTransparent(src) {
  if (src.endsWith('.avif') || src.endsWith('.webp') || src.endsWith('.png')) return true;
}

async function processImage(
  src,
  alt,
  sizes = '100vw'
) {
  const formats = ['avif', 'webp', 'png'];
  if (!isImageFormatTransparent(src)) formats.push('jpeg');

  let metadata = await Image(src, {
    widths: [560, 840, 1100, 1650, 2100, 2500, 3100],
    formats: formats,
    outputDir: '_site/img/',
  });
  const lowQualityImageMetadata = metadata.png[0];

  return `<picture>
    ${Object.values(metadata)
      .map((imageFormat) => {
        return `<source 
                type="${imageFormat[0].sourceType}"
                srcset="${imageFormat.map((entry) => entry.srcset).join(', ')}"
                sizes="${sizes}"
          >`;
      })
      .join('\n')}
      <img
        src="${lowQualityImageMetadata.url}"
        alt="${alt}"
        loading="lazy",
        decoding="async"
      >
    </picture>`;
}

const imageShortcode = function (eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode('image', processImage);
  eleventyConfig.addLiquidShortcode('image', processImage);
  eleventyConfig.addJavaScriptFunction('image', processImage);
};

module.exports = imageShortcode;
