const atImport = require("postcss-import")
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const fs = require('fs/promises');
const postcss = require('postcss');
const postcssNested = require('postcss-nested');
const swc = require('@swc/core')
const { config } = require('@swc/core/spack');

async function transformJs(outputPath) {
    try {
        const publicFolderExists = (await fs.stat(outputPath)).isDirectory()
        const spackConfig = config({
            mode: process.env.ELEVENTY_ENV === 'production' ? 'production' : 'none',
            target: 'browser',
            entry: {
                main: __dirname + '/src/scripts/main.ts',
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
            const fileName = `${key}.js`;
            
            await fs.writeFile(`${outputPath}/${fileName}`, bundle[key].code, 'utf-8');
            await fs.writeFile(`${outputPath}/${fileName}.map`, bundle[key].map, 'utf-8');
        })
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
            await fs.writeFile(outputFile, transformed.css, 'utf-8')
        }

        if ('map' in transformed && transformed.map) {
            await fs.writeFile(`${outputFile}.map`, transformed.map.toString(), 'utf-8')
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = function (config) {
    config.on('afterBuild', async () => {
        await transformJs(__dirname + '/public')
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