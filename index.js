const jsdoc = require('jsdoc-api');
const fs = require('fs');
const glob = require('glob');
const testRunnerCode = fs.readFileSync('./testRunner.js').toString();

const program = require('commander');

program.version('0.0.1');

program.option('-f, --files <glob>', 'Files to match');

program.parse(process.argv);

if (!program.files) {
	throw new Error('Files missing');
}

glob(program.files, { ignore: '**/node_modules/**/*' }, (error, files) => {
	if (error) {
		throw error;
	}

	const fileData = files.map(filePath => {
		const fileData = fs.readFileSync(filePath).toString();
		return {
			file: filePath,
			jsdoc: jsdoc.explainSync({ source: fileData }),
			fileData
		};
	});

	const tests = [];

	fileData.forEach(file => {
		file.jsdoc.forEach(comment => {
			comment.tags &&
				comment.tags.forEach(tag => {
					if (tag.title != 'test') {
						return;
					}

					tests.push({
						file: file.file,
						testCode: tag.value,
						fileData: file.fileData
					});
				});
		});
	});

	console.log(`Found ${tests.length} tests`);

	tests.forEach(test => {
		try {
			eval(`
            ${testRunnerCode}
            ${test.fileData}

            ${test.testCode}
        `);
		} catch (error) {
			console.log(error);
		}

		console.log(`Test finished: ${test.file}`);
	});

	process.exit();
});
