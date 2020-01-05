const path = require('path');
const fs = require('fs');

module.exports = function fsFindUp(find) {
	const workingDir = path.resolve(process.cwd());
	const folderArray = workingDir.split(path.sep);

	for (let i = folderArray.length; i > 0; i--) {
		const dirToTest = folderArray.slice(0, i).join(path.sep);
		const tryFile = dirToTest + path.sep + find;
		if (fs.existsSync(tryFile)) {
			return tryFile;
		}
	}

	return null;
};
