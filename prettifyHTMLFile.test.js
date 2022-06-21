// Протестируйте функцию, которая форматирует и изменяет указанный HTML-файл.

// // содержимое до форматирования
// // <div><p>hello <b>world</b></p></div>
// await prettifyHTMLFile('/path/to/file');
 
// // содержимое после форматирования:
// // <div>
// //     <p>hello <b>world</b></p>
// // </div>
// Подсказки
// В директории __fixtures__ лежат готовые фикстуры для тестов.

// @ts-check

import { fileURLToPath } from 'url';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import getFunction from '../functions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prettifyHTMLFile = getFunction();

// BEGIN (write your solution here)
const getFixturePath = (name) => path.join(__dirname, '..', '__fixtures__', name);

const filename = 'before.html';
const dest = path.join(os.tmpdir(), filename);
const src = getFixturePath(filename);

let expected;

beforeAll(async () => {
  expected = await fs.readFile(getFixturePath('after.html'), 'utf-8');
});

beforeEach(async () => {
  await fs.copyFile(src, dest);
});

test('prettifyHTMLFile', async () => {
  await prettifyHTMLFile(dest);
  const actual = await fs.readFile(dest, 'utf-8');
  expect(actual).toBe(expected);
});
// END
