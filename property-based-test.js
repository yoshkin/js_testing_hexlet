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
