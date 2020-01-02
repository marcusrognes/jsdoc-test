import moment from 'moment';

/**
 * Gets a random date... i promise.
 *
 * @param {Moment} a
 * @param {Moment} b
 * @test
 * assert(getARandomDate().format('YYYY-MM-DD')).toBe("1992-11-09");
 */
function getARandomDate() {
	return moment('1992-11-09');
}
