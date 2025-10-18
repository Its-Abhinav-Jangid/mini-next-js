import { readdir, writeFile } from 'fs/promises';
import path from 'path';

const PAGES_DIR = path.resolve('./frontend/pages');
const OUTPUT_FILE = path.resolve('./frontend/.pages/index.js');

async function generatePagesIndex() {
  const files = await readdir(PAGES_DIR);
  const imports = [];
  const mapEntries = [];

  let counter = 0;
  for (const file of files) {
    if (!file.endsWith('.jsx')) continue;

    const route = file === 'index.jsx' ? '/' : `/${file.replace('.jsx', '')}`;
    const importName = `Page${counter++}`; // safe local variable

    imports.push(`import ${importName} from '../pages/${file}';`);
    mapEntries.push(`  '${route}': ${importName}`);
  }

  const content = `
${imports.join('\n')}

export const pages = {
${mapEntries.join(',\n')}
};
`;

  await writeFile(OUTPUT_FILE, content.trim());
  console.log(`Pages index generated at ${OUTPUT_FILE}`);
}

generatePagesIndex().catch(console.error);
