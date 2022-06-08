// @ts-check

import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';
import getFunction from '../functions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toHtmlList = getFunction();

// BEGIN (write your solution here)
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

let expectedResult; 
beforeAll(async () => expectedResult = await readFile('result.html')); 

test.each(['list.csv', 'list.json', 'list.yml'])('testing: %s', async (file) => {
  const html = await toHtmlList(getFixturePath(file));
  expect(html.trim()).toEqual(expectedResult.trim());
});
// END


//functions
// @ts-check

import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import papa from 'papaparse';

const parsers1 = {
  csv: (content) => papa.parse(content).data[0],
  json: JSON.parse,
  yml: yaml.load,
};

const parsers2 = {
  json: JSON.parse,
  yml: yaml.load,
  csv: () => [],
};

const parsers3 = {
  csv: (content) => papa.parse(content).data[0],
  json: JSON.parse,
  yml: () => [],
};

const parsers4 = {
  csv: (content) => papa.parse(content).data[0],
  yml: yaml.load,
  json: () => [],
};

const genSolution = (parsers) => async (filepath) => {
  const content = await fs.readFile(filepath, 'utf-8');
  const type = path.extname(filepath).slice(1);
  const items = parsers[type](content);
  const lis = items.map((item) => `  <li>${item}</li>`);
  return `<ul>\n${lis.join('\n')}\n</ul>`;
};

const functions = {
  right1: genSolution(parsers1),
  wrong1: genSolution(parsers2),
  wrong2: genSolution(parsers3),
  wrong3: genSolution(parsers4),
};

export default () => {
  const name = process.env.FUNCTION_VERSION || 'right1';
  return functions[name];
};
