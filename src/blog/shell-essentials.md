---
title: Shell essentials
subtitle: Learn some of the most essential shell commands by reading this article
date: 2021-02-10
eleventyExcludeFromCollections: true
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur libero sit amet nibh viverra, et gravida tellus euismod. Sed convallis egestas est, id interdum odio. Suspendisse potenti. Morbi quis magna felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras ultricies ultricies leo, nec hendrerit nisi consequat in. Integer non est faucibus metus viverra fringilla. Vestibulum at purus et urna volutpat bibendum eu at lorem. Etiam pellentesque ut lorem sed iaculis. Donec eu nunc quis mi vehicula scelerisque. Nunc in porttitor lorem, id dignissim mauris.

<h2 class="article-subheading">Must know</h2>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur libero sit amet nibh viverra, et gravida tellus euismod. Sed convallis egestas est, id interdum odio. Suspendisse potenti. Morbi quis magna felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras ultricies ultricies leo, nec hendrerit nisi consequat in. Integer non est faucibus metus viverra 
`const a = 5;` fringilla. Vestibulum at purus et urna volutpat bibendum eu at lorem. 

```js
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const htmlmin = require('html-minifier');

const sassPlugin = require('./sassPlugin');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, { alwaysWrapLineHighlights: true });
  eleventyConfig.addPlugin(sassPlugin);
  eleventyConfig.addPassthroughCopy('src/img');
  eleventyConfig.addPassthroughCopy('src/styles/fonts');
// dsadsa
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
```

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur libero sit amet nibh viverra, et gravida tellus euismod. Sed convallis egestas est, id interdum odio. Suspendisse potenti. Morbi quis magna felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras ultricies ultricies leo, nec hendrerit nisi consequat in. Integer non est faucibus metus viverra fringilla. Vestibulum at purus et urna volutpat bibendum eu at lorem. 

{% capture shellImageUrl %}./src/img{{ page.url }}shell.png{% endcapture %}

{% image shellImageUrl, "shell" %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur libero sit amet nibh viverra, et gravida tellus euismod. Sed convallis egestas est, id interdum odio. Suspendisse potenti. Morbi quis magna felis. 
Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras ultricies ultricies leo, nec hendrerit nisi consequat in.
Integer non est faucibus metus viverra fringilla. Vestibulum at purus et urna volutpat bibendum eu at lorem. Etiam pellentesque ut lorem sed iaculis. Donec eu nunc quis mi vehicula scelerisque. Nunc in porttitor lorem, id dignissim mauris.
