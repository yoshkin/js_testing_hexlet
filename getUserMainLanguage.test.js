// tests/getUserMainLanguage.test.js
// Протестируйте функцию getUserMainLanguage(username, client), которая определяет язык на котором пользователь создал больше всего репозиториев. Для реализации этой задачи, функция getUserMainLanguage() выполняет запрос через @octokit/rest, который извлекает все репозитории указанного пользователя (по первому параметру username). Каждый репозиторий в этом списке содержит указание основного языка репозитория. Эта информация используется для поиска того языка, которые используется чаще. Если список репозиториев пуст, функция возвращает null.

// Пример:
// // Запрос который выполняет функция getUserMainLanguage
// // Именно этот метод нужно будет подменить в фейковом клиенте
// const { data } = await client.repos.listForUser({ username });
// // data – список репозиториев. У каждого репозитория может быть много полей
// // но нас интересует ровно одно – language
// // Эти данные нужно подготовить в тестах для фейкового клиента
// console.log(data);
// // [{ language: 'php', ... }, { language: 'javascript', ... }, ...]
// support/OctokitFake.js
// Реализуйте фейковый клиент по такому же принципу как это было сделано в теории. Используйте этот клиент в тестах для подмены.



/////// v2

// @ts-check

import nock from 'nock';
import getFunction from '../functions.js';

const getUserMainLanguage = getFunction();

nock.disableNetConnect();

test('getUserMainLanguage', async () => {
  const data = [
    { language: 'ruby' },
    { language: 'php' },
    { language: 'java' },
    { language: 'php' },
    { language: 'js' },
  ];
  nock(/api\.github\.com/).get('/users/linus/repos').reply(200, data);

  const mainLanguage = await getUserMainLanguage('linus');
  expect(mainLanguage).toEqual('php');
});

test('getUserMainLanguage when empty', async () => {
  nock(/api\.github\.com/).get('/users/user-without-repos/repos').reply(200, []);

  const mainLanguage = await getUserMainLanguage('user-without-repos');
  expect(mainLanguage).toBeNull();
});

/////// v2

// @ts-check

import OctokitFake from '../support/OctokitFake.js';
import getFunction from '../functions.js';

const getUserMainLanguage = getFunction();

// BEGIN (write your solution here)
test('getUserMainLanguage', async () => {
  const data = [
    { language: 'ruby' },
    { language: 'php' },
    { language: 'java' },
    { language: 'php' },
    { language: 'js' },
  ];
  const client = new OctokitFake(data);
  const mainLanguage = await getUserMainLanguage('linus', client);
  expect(mainLanguage).toEqual('php');
});

test('getUserMainLanguage when empty', async () => {
  const client = new OctokitFake([]);
  const mainLanguage = await getUserMainLanguage('user-without-repos', client);
  expect(mainLanguage).toBeNull();
});
// END


// @ts-check

// BEGIN (write your solution here)
export default class OctokitFake {
  constructor(data) {
    this.data = data;
  }

  repos = {
    listForUser: () => {
      return Promise.resolve({ data: this.data }); 
    },
  }
};
// END


// @ts-check

import _ from 'lodash';
import octokitRest from '@octokit/rest';

const { Octokit } = octokitRest;

const getUserMainLanguage = async (username, client = new Octokit()) => {
  const { data } = await client.repos.listForUser({ username });
  if (data.length === 0) {
    return null;
  }
  const languages = data.map((repo) => repo.language)
    .reduce((acc, name) => {
      const count = _.get(acc, `${name}.count`, 0) + 1;
      return { ...acc, [name]: { count, name } };
    }, {});
  const { name } = _.maxBy(Object.values(languages), (lang) => lang.count);
  return name;
};

const wrong1 = async (username, client = new Octokit()) => {
  const { data } = await client.repos.listForUser({ username });
  if (data.length === 0) {
    return '';
  }
  return getUserMainLanguage(username, client);
};

const wrong2 = async (username, client = new Octokit()) => {
  const { data } = await client.repos.listForUser({ username });
  if (data.length === 0) {
    return null;
  }
  const languages = data.map((repo) => repo.language)
    .reduce((acc, name) => {
      const count = _.get(acc, `${name}.count`, 0) + 1;
      return { ...acc, [name]: { count, name } };
    }, {});
  const { name } = _.minBy(Object.values(languages), (lang) => lang.count);
  return name;
};

const functions = {
  right: getUserMainLanguage,
  wrong1,
  wrong2,
};

export default () => {
  const name = process.env.FUNCTION_VERSION || 'right';
  return functions[name];
};
