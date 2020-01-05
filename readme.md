# Proof of concept

Run test suites within jsdoc

Inspired by elixir doctests

## Example run

```
node index.js -f example/**/*.js
```

## Example test

```js
/**
 * Creates a hello world string
 * @param {string} thing
 * @return {string} helloWorldString;
 * @test
 * assert(hello('World')).toBe('Hello, World!');
 */
function hello(thing) {
	return `Hello, ${thing}!`;
}
```

## TODO

[ ] Add support for test descriptions
[ ] Add support for jest
