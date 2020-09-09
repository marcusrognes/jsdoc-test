# Proof of concept

Run test suites within jsdoc

Inspired by elixir doctests

## Install
```
npm i -g marcusrognes/jsdoc-test
```

## Run
```
jsdoc-test -f src/**/*.js
```

## Example run local repo

```
node index.js -f example/**/*.js
```

## Example test

Note: currenlty the only assertion available is assert(a).toBe(b);

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

- [ ] Add support for test descriptions
- [ ] Add support for jest or chai assertions. make pluggable?
