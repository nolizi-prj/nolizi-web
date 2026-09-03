import{strict as assert}from"node:assert";import{readFile}from"node:fs/promises";import{test}from"node:test";
const html=await readFile("site/index.html","utf8");const css=await readFile("site/styles.css","utf8");
test("builds Nolizi",()=>{assert.match(html,/<title>Nolizi/);assert.match(html,/https:\/\/nolizi\.com\//);assert.match(html,/Collection of <em>Knowledge<\/em>/);assert.doesNotMatch(html,/Pumasi/i)});
test("has every landing section",()=>{for(const id of["products","how","pricing","cta"])assert.match(html,new RegExp(`id="${id}"`))});
test("uses the supplied visual system",()=>{assert.match(css,/--mauve:#8d6f8f/);assert.match(css,/Iowan Old Style/);assert.match(css,/mandala\.gif/);assert.match(css,/@media\(max-width:640px\)/)});
