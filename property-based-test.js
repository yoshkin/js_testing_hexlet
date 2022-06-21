import fc from 'fast-check';

// Тестируемый код
const contains = (text, pattern) => text.indexOf(pattern) >= 0;

// Описываем свойства

test('string should always contain itself', () => {
  fc.assert(
    fc.property(
      fc.string(),
      text => contains(text, text)
    )
  );
});

test('string should always contain its substring', () => {
  fc.assert(
    fc.property(
      fc.string(), fc.string(), fc.string(),
      (a, b, c) => contains(a + b + c, b)
    )
  );
});


// @ts-check

import fc from 'fast-check';
import getFunction from '../functions.js';

const sort = getFunction();

// BEGIN (write your solution here)
test('prop based test', () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (data) => {
      const sorted = sort(data);
      expect(sorted.length).toEqual(data.length);
      expect(sorted).toBeSorted();
    })
  );
})
// END


// @ts-check

const functions = {
  right1: (data) => data.slice().sort((a, b) => a - b),
  wrong1: (data) => data.slice().sort((a, b) => b - a),
  wrong2: (data) => data.slice().reverse(),
};

export default () => {
  const name = process.env.FUNCTION_VERSION || 'right1';
  return functions[name];
};
