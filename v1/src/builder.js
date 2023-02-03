import { readFile } from 'fs';
import { indexTemplate, deildTemplate } from './lib/html.js';
import path, { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { direxists, readAFile, readFilesFromDir, readJSON } from './lib/file.js';
import { resourceLimits } from 'worker_threads';
import { parseCSV } from './lib/parse.js';

async function main() {
  // Búa til `./dist` ef ekki til
  if (!(await direxists('./dist'))) {
    await mkdir('./dist');
  }

  const data = await readJSON('./JSON/index.json');
  const results = [];

  for(const deild of data) {
    // eslint-disable-next-line no-await-in-loop
    //const content = await readAFile(file);

        const title = deild.title;
        const description = deild.description;
        const csvPath = `${deild.csv}.html`;

        const result = {
          title,
          description,
          csvPath,
        };
        results.push(result);
      

        const filepath = join('./dist', csvPath);
        console.log(await parseCSV(join('./data', deild.csv)));
        const deildtemplate = deildTemplate(title, await parseCSV(join('./data', deild.csv)));

        // eslint-disable-next-line no-await-in-loop
        await writeFile(filepath, deildtemplate, { flag: 'w+' });
  }

  const filepath = join('./dist', 'index.html');
  const indexMaker = indexTemplate(results);

  await writeFile(filepath, indexMaker, { flag: 'w+' });
}

main().catch((err) => console.error(err));