import path, { join } from 'path';
import { parseCSV } from './parse.js';

export function template(title, content) {
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

export function indexCover(results){
    const list = results.map((result) => `
<li>
  <a href="${result.csvPath}">${result.title}</a>
  <p>${result.description}</p>
</li>`
    )
    .join('\n');

    return `<section>
    <div class="iwrapper">
      <h1>HÍ Deildir</h1>
      <ul>${list}</ul>
    </div>
  </section>`;
}

export function csvPage(result){
    /* const list = result.map((res) => `

    `)*/

    let list;
    for(const element of result){
        if(element !== undefined && element.hasOwnProperty('number')){
            list = result.map((res) => {
            
            if(res.hasOwnProperty('name') && res.name !== '' && res.semester !== 'Heilsárs' && !isNaN(res.credits)){
                return `
                <tr>
                    <td>${res.number}</td>
                    <td>${res.name}</td>
                    <td>${res.credits}</td>
                    <td>${res.semester}</td>
                    <td>${res.level}</td>
                    <td><a href = ${res.path}>Slóð</a></td>
                    </tr>`
            }
        })
          .join('\n');
        }

    }
    
        return `<section>
        <div class="csvwrapper">
          <h1>Námskeið</h1>
          <table>
              <tr>
                  <th>Námskeið</th>
                  <th>Nafn</th>
                  <th>Einingar</th>
                  <th>Kennslumisseri</th>
                  <th>Námsstig</th>
                  <th>Slóð á kennsluskrá</th>
              </tr>
              ${list}
            </table>
        </div>
      </section>`;
}


export function indexTemplate(results){
    return template('HÍ Deildir', indexCover(results));
}

export function deildTemplate(title, result){
    return template(title, csvPage(result));
}