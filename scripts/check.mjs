import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { Script } from 'node:vm';
import { existsSync } from 'node:fs';
import { ADMIN_HTML } from '../src/templates/adminHtml.js';
import { PORTAL_HTML } from '../src/templates/portalHtml.js';
import { PORTAL_NO_OTP_HTML } from '../src/templates/portalNoOtpHtml.js';

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', '.wrangler'].includes(entry.name)) continue;
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) yield* files(path);
    else yield path;
  }
}
let scripts = 0;
function checkBrowserScripts(html, filename) {
  for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    new Script(match[1], { filename });
    scripts++;
  }
}
for await (const path of files('.')) {
  if (/\.(m?js)$/.test(path)) {
    const result = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stderr);
  }
  if (/\.(html|liquid)$/.test(path)) checkBrowserScripts(await readFile(path, 'utf8'), path);
  if (path.endsWith('.md')) {
    const text = await readFile(path, 'utf8');
    for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (!target || /^[a-z]+:/i.test(target)) continue;
      if (!existsSync(resolve(dirname(path), decodeURIComponent(target)))) {
        throw new Error(`Broken local link in ${path}: ${target}`);
      }
    }
  }
}
for (const [name, html] of Object.entries({ ADMIN_HTML, PORTAL_HTML, PORTAL_NO_OTP_HTML })) {
  checkBrowserScripts(html, name);
}
console.log(`Source syntax, ${scripts} inline browser scripts, and local Markdown targets checked.`);
