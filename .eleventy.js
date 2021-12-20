const atImport = require("postcss-import")
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const esbuild = require('esbuild');
const fs = require('fs/promises');
const postcss = require('postcss');
const postcssNested = require('postcss-nested');
const swc = require('@swc/core')
const { config } = require('@swc/core/spack');
const { dirname } = require("path");

const TRANSFORM = 'esbuild';

async function transformJs(entryFile, outputFile) {
    try {
        if (TRANSFORM === 'esbuild') {
            await esbuild.build({
                entryPoints: [entryFile],
                bundle: true,
                minify: process.env.ELEVENTY_ENV === "production",
                sourcemap: process.env.ELEVENTY_ENV !== "production",
                target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
                outfile: outputFile,
            })
        } else {
            const outputPath = dirname(outputFile);
            const publicFolderExists = (await fs.stat(outputPath)).isDirectory()
            const spackConfig = config({
                entry: {
                    main: entryFile,
                },
                output: {
                    path: outputPath
                },
                module: {},
            })
            const bundle = await swc.bundle(spackConfig);

            if (!publicFolderExists) {
                await fs.mkdir(outputPath);
            }

            Object.keys(spackConfig.entry).forEach(async key => {
                await fs.writeFile(`${outputPath}/${key}.js`, bundle[key].code);
                await fs.writeFile(`${outputPath}/${key}.map.js`, bundle[key].map);
            })
        }
    } catch (error) {
        console.error(error);
    }
}

async function transformCss(entryFile, outputFile) {
    try {
        const css = await fs.readFile(entryFile);
        const transformed = await postcss([atImport, autoprefixer, postcssNested, cssnano])
            .process(css, { from: entryFile, to: outputFile })
        if ('css' in transformed && transformed.css) {
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
        await transformJs(__dirname + '/src/scripts/main.ts', __dirname + '/public/main.js')
        await transformCss(__dirname + '/src/styles/main.css', __dirname + '/public/main.css');
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