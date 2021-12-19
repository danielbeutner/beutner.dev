const atImport = require("postcss-import")
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const esbuild = require('esbuild');
const fs = require('fs/promises');
const postcss = require('postcss');
const postcssNested = require('postcss-nested');

module.exports = function (config) {
    config.on('afterBuild', async () => {
        esbuild.buildSync({
            entryPoints: ['src/scripts/index.ts'],
            bundle: true,
            minify: process.env.ELEVENTY_ENV === "production",
            sourcemap: process.env.ELEVENTY_ENV !== "production",
            target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
            outfile: 'public/index.js',
        })

        const css = await fs.readFile('src/styles/main.css');
        const transformed = await postcss([atImport, autoprefixer, postcssNested, cssnano])
            .process(css, { from: 'src/styles/main.css', to: 'public/index.css' })
        if('css' in transformed && transformed.css) {
            await fs.writeFile('public/index.css', transformed.css)
        }

        if ('map' in transformed && transformed.map) {
            await fs.writeFile('public/index.css.map', transformed.map.toString())
        }
    });

    config.addWatchTarget('./src/scripts/');
    config.addWatchTarget('./src/styles/');

    return {
        dir: {
            input: 'src',
            output: 'public'
        }
    };
};