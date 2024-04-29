import type { BuildConfig } from 'bun';
import fs from 'fs';

// Build scripts
const scriptDir = `${import.meta.dir}/scripts`;
const scriptOut = `${import.meta.dir}/public/scripts`;

const buildConfig: BuildConfig = {
    target: 'browser',
    outdir: scriptOut,
    entrypoints: [`${scriptDir}/passnplay.ts`],
    minify: true
};

fs.rmSync(scriptOut, { recursive: true });

function build() {
    console.log('Building scripts...');
    Bun.build(buildConfig);
}

build();
fs.watch(`${import.meta.dir}/scripts`, build);
