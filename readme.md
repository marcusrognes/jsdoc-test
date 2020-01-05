# Proof of concept

Run test suites within jsdoc

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
