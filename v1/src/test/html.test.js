import { describe, expect, it } from '@jest/globals';
import { readFile } from '../../../vef2-2022-v1-synilausn/src/lib/file';
import { template, indexCover, csvPage, indexTemplate, deildTemplate } from '../lib/html.js';

describe('html', () => {
    describe('template', () => {
        it('returns html template with the arguments within it', async () => {
            const result = template('hehe', 'hoho');
            expect(result).toEqual(`<!doctype html>
  <html lang="is">
    <head>
      <meta charset="utf-8">
      <title>hehe</title>
      <link rel="stylesheet" href="../public/styles.css">
    </head>
    <body>hoho</body>
  </html>`);
        });
    });

    describe('indexCover', () => {
        it('makes the content for the index.html according to the argument', async () => {
            const obj = [{
                title: 'test1',
                description: 'test2',
                csvPath: 'test/path',
            }];

            const data = indexCover(obj);

            expect(data).toEqual(`<section>
    <h1>HÍ Deildir</h1>
    <ul>
<li>
  <a href="test/path">test1</a>
  <p>test2</p>
</li></ul>
  </section>`);
        })
    });

    describe('csvPage', () => {
        it('makes the content for the cvs pages according to the argument', async () => {
            const obj = [{
                number: 'test1',
                name: 'test2',
                credits: 'cred',
                semester: 'test3',
                level: 'test4',
                path: 'test/path',
            }];

            const data = csvPage(obj);

            expect(data).toEqual(`<section>
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
            
          </table>
      </section>`);
        })
    });
});