import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
for (const variant of ['', '-no-otp']) {
  const result = await build({
    entryPoints: [`src/worker${variant}.js`],
    outfile: `dist/worker${variant}.js`,
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    external: ['node:*'],
    legalComments: 'linked',
    metafile: true,
  });
  await writeFile(`dist/worker${variant}.meta.json`, JSON.stringify(result.metafile, null, 2));
  console.log(`Built dist/worker${variant}.js`);
}
