const path = require('path');
const fs = require('fs');

module.exports = function babelConfigFinder() {
	const workingDir = path.resolve(process.cwd());
	const folderArray = workingDir.split(path.sep);
	const fileToFind = '.babelrc';

	for (let i = folderArray.length; i > 0; i--) {
		const dirToTest = folderArray.slice(0, i).join(path.sep);
		const tryFile = dirToTest + path.sep + fileToFind;
		if (fs.existsSync(tryFile)) {
			return tryFile;
		}
	}

	return null;
};
