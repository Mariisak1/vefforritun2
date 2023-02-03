import path, { join } from 'path';
import { parseCSV } from './parse.js';

function template(title, content) {
    return `<!doctype html>
  <html lang="is">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <link rel="stylesheet" href="../public/styles.css">
    </head>
    <body>${content}</body>
  </html>`;
  }

function indexCover(results){
    const list = results.map((result) => `
<li>
  <a href="${result.csvPath}">${result.title}</a>
  <p>${result.description}</p>
</li>`
    )
    .join('\n');

    return `<section>
    <h1>HÍ Deildir</h1>
    <ul>${list}</ul>
  </section>`;
}

function csvPage(result){
    /* const list = result.map((res) => `

    `)*/
    console.log(result[0].number);
    return `<article>
        <h2>Upplýsingar um ${result[0].number}</h2>
      </article>`;
}


export function indexTemplate(results){
    return template('HÍ Deildir', indexCover(results));
}

export function deildTemplate(title, result){
    return template(title, csvPage(result));
}