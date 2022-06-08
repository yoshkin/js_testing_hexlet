// @ts-check

import getFunction from '../functions.js';

const buildUser = getFunction();

// BEGIN (write your solution here)
test('buildUser fields', () => {
  const user1 = buildUser();
  expect(user1).toEqual(expect.objectContaining({
    email: expect.any(String),
    firstName: expect.any(String),
    lastName: expect.any(String),
  }));
});

test('buildUser random', () => {
  const user1 = buildUser();
  const user2 = buildUser();
  expect(user1).not.toEqual(user2);
});

test('buildUser override', () => {
  const newData1 = {
    email: 'test@email.com',
  };
  const user1 = buildUser(newData1);
  expect(user1).toMatchObject(newData1);
});
// END


//func

// @ts-check

// import faker from 'faker';
import Fakerator from 'fakerator';

const fakerator = Fakerator();

const getDefaultData = () => ({
  email: fakerator.internet.email(),
  firstName: fakerator.names.firstName(),
  lastName: fakerator.names.lastName(),
});

const buildUser = (data) => {
  const defaultData = getDefaultData();
  return { ...defaultData, ...data };
};

const buildUser2 = () => getDefaultData();

const buildUser3 = (data) => {
  fakerator.seed(1);
  const defaultData = getDefaultData();
  return { ...defaultData, ...data };
};

const buildUser4 = (data) => {
  const defaultData = {
    firstName: fakerator.names.firstName(),
  };
  return { ...defaultData, ...data };
};

const functions = {
  right1: buildUser,
  wrong1: buildUser2,
  wrong2: buildUser3,
  wrong3: buildUser4,
};

export default () => {
  const name = process.env.FUNCTION_VERSION || 'right1';
  return functions[name];
};
