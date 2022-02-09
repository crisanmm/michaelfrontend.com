---
title: Shell essentials
subtitle: Learn some of the most essential shell commands by reading this article
date: 2021-02-10
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur libero sit amet nibh viverra, et gravida tellus euismod. Sed convallis egestas est, id interdum odio. Suspendisse potenti. Morbi quis magna felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras ultricies ultricies leo, nec hendrerit nisi consequat in. Integer non est faucibus metus viverra fringilla. Vestibulum at purus et urna volutpat bibendum eu at lorem. Etiam pellentesque ut lorem sed iaculis. Donec eu nunc quis mi vehicula scelerisque. Nunc in porttitor lorem, id dignissim mauris.

<h2 class="article-subheading">Must know</h2>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur libero sit amet nibh viverra, et gravida tellus euismod. Sed convallis egestas est, id interdum odio. Suspendisse potenti. Morbi quis magna felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras ultricies ultricies leo, nec hendrerit nisi consequat in. Integer non est faucibus metus viverra fringilla. Vestibulum at purus et urna volutpat bibendum eu at lorem. 

```js
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

```

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur libero sit amet nibh viverra, et gravida tellus euismod. Sed convallis egestas est, id interdum odio. Suspendisse potenti. Morbi quis magna felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras ultricies ultricies leo, nec hendrerit nisi consequat in. Integer non est faucibus metus viverra fringilla. Vestibulum at purus et urna volutpat bibendum eu at lorem. 

<img src="/img{{ page.url }}/shell.png" alt="shell" class="image">

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur libero sit amet nibh viverra, et gravida tellus euismod. Sed convallis egestas est, id interdum odio. Suspendisse potenti. Morbi quis magna felis. 
Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras ultricies ultricies leo, nec hendrerit nisi consequat in.
Integer non est faucibus metus viverra fringilla. Vestibulum at purus et urna volutpat bibendum eu at lorem. Etiam pellentesque ut lorem sed iaculis. Donec eu nunc quis mi vehicula scelerisque. Nunc in porttitor lorem, id dignissim mauris.
