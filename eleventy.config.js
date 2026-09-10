import format from "date-fns/format";
import htmlmin from "html-minifier";
import markdownIt from "markdown-it";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import * as toc from "eleventy-plugin-toc-util";

const md = markdownIt();
import _ from "lodash";

export default async function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin/");

  // -------------------------------------------------------------------------------------------------------------------------------------

  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

  // -------------------------------------------------------------------------------------------------------------------------------------

  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  // -------------------------------------------------------------------------------------------------------------------------------------

  eleventyConfig.addFilter("toJson", function (value) {
    return JSON.stringify(value, null, 0); // Pretty print for readability
  });

  eleventyConfig.addFilter("slice", (array, number) => {
    return array.slice(0, number);
  });

  eleventyConfig.addFilter("unquote", (string) => {
    return string.slice(0, -1).substring(1);
  });

  eleventyConfig.addFilter("date", function (date, dateFormat) {
    return format(date, dateFormat);
  });

  eleventyConfig.addFilter("markdownify", function (content) {
    return md.render(String(content));
  });

  eleventyConfig.addFilter("assign", function (object, pair) {
    return Object.assign({}, object, pair);
  });

  eleventyConfig.addFilter("attachId", (html) => toc.attachId(html, "h2"));
  eleventyConfig.addFilter("attachAnchor", (html) => toc.attachIdAnchor(html, "h2", ""));
  eleventyConfig.addFilter("toc", (html) => toc.createToc(html, "h2"));

  eleventyConfig.addFilter("tagsList", function (tags) {
    let trimmedTags = [];

    tags.forEach((tag) => {
      if (tag !== "post") {
        trimmedTags = (trimmedTags.push(tag), trimmedTags);
      }
    });
    return trimmedTags;
  });

  // -------------------------------------------------------------------------------------------------------------------------------------

  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
      });
    }

    return content;
  });

  // -------------------------------------------------------------------------------------------------------------------------------------

  eleventyConfig.addCollection("postsByTag", (collectionApi) => {
    const posts = collectionApi.getFilteredByTag("post");
    let ret = {};

    for (let post of posts) {
      for (let tag of post.data.tags) {
        if (tag === "post") {
        } else {
          ret[tag] ??= [];
          ret[tag].push(post);
        }
      }
    }

    // Now sort, and reconstruct the object
    ret = Object.fromEntries(Object.entries(ret).sort((a, b) => b[1].length - a[1].length));

    return ret;
  });

  eleventyConfig.addCollection("postsByYear", (collection) => {
    const posts = collection.getFilteredByTag("post").reverse();
    const years = posts.map((post) => post.date.getFullYear());
    const uniqueYears = [...new Set(years)];
    const postsByYear = uniqueYears.reduce((prev, year) => {
      const filteredPosts = posts.filter((post) => post.date.getFullYear() === year);
      return [...prev, [year, filteredPosts]];
    }, []);
    return postsByYear;
  });

  // -------------------------------------------------------------------------------------------------------------------------------------
}

export const config = {
  markdownTemplateEngine: "njk",
};
