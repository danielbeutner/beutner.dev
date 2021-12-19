const atImport = require("postcss-import")
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const esbuild = require('esbuild');
const fs = require('fs/promises');
const postcss = require('postcss');
const postcssNested = require('postcss-nested');

async function transformJs(entryFile, outputFile) {
    await esbuild.build({
        entryPoints: [entryFile],
        bundle: true,
        minify: process.env.ELEVENTY_ENV === "production",
        sourcemap: process.env.ELEVENTY_ENV !== "production",
        target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
        outfile: outputFile,
    })
}

async function transformCss(entryFile, outputFile) {
    try {
        const css = await fs.readFile(entryFile);
        const transformed = await postcss([atImport, autoprefixer, postcssNested, cssnano])
            .process(css, { from: entryFile, to: outputFile })
        if('css' in transformed && transformed.css) {
            await fs.writeFile(outputFile, transformed.css)
        }

        if ('map' in transformed && transformed.map) {
            await fs.writeFile(`${outputFile}.map`, transformed.map.toString())
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = function (config) {
    config.on('afterBuild', async () => {
        await transformJs('src/scripts/main.ts', 'public/main.js')
        await transformCss('src/styles/main.css', 'public/main.css');
    });

    config.addWatchTarget('src/scripts/');
    config.addWatchTarget('src/styles/');

    return {
        dir: {
            input: 'src',
            output: 'public'
        }
    };
};