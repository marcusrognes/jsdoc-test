class Assertion {
	constructor(toAssert) {
		this.toAssert = toAssert;
	}

	toBe(value) {
		if (this.toAssert !== value) {
			throw new Error(
				`Assertion failed: ${this.toAssert} was not ${value}`,
			);
		}
	}
}

function assert(value) {
	return new Assertion(value);
}
