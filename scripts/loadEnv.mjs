import fs from 'node:fs';
import path from 'node:path';

const parseLine = (line) => {
  const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!match) return null;
  const key = match[1];
  let value = match[2] ?? '';
  value = value.replace(/^\s+|\s+$/g, '');
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return { key, value };
};

export function loadEnv(files = ['.env.local', '.env']) {
  for (const file of files) {
    const full = path.resolve(process.cwd(), file);
    if (!fs.existsSync(full)) continue;
    const contents = fs.readFileSync(full, 'utf8');
    contents.split(/\r?\n/).forEach((line) => {
      if (!line || line.trim().startsWith('#')) return;
      const parsed = parseLine(line);
      if (!parsed) return;
      if (!process.env[parsed.key]) {
        process.env[parsed.key] = parsed.value;
      }
    });
  }
}

