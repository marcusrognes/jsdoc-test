#!/usr/bin/env node

require.main.paths.unshift(require('./lib/fsFindUp')('node_modules'));

/**
 * TODO: Fix issue with running in project sub folder, for some reason babel wont transform.
 */
//console.log(require('./lib/fsFindUp')('node_modules'));
//console.log(require('./lib/fsFindUp')('.babelrc'));

const babel = require('@babel/core');
const chalk = require('chalk');
const jsdoc = require('jsdoc-api');
const fs = require('fs');
const glob = require('glob');
const testRunnerCode = fs
	.readFileSync(__dirname + '/lib/testRunner.js')
	.toString();
const program = require('commander');

const babelConfigFile = require('./lib/fsFindUp')('.babelrc');

program.version('0.0.1');

program.option('-f, --files <glob>', 'Files to match');

program.parse(process.argv);

if (!program.files) {
	throw new Error('Files missing');
}

function customPrintTest(test) {
	test.split(/\r\n|\r|\n/g).forEach(line =>
		console.log('    ' + chalk.green(line.trim())),
	);
	console.log('');
}

glob(
	program.files,
	{ ignore: '**/node_modules/**/*' },
	async (error, files) => {
		if (error) {
			throw error;
		}

		// Get the file data and documentation data from the matched files.
		const fileData = files.map(filePath => {
			const fileData = fs.readFileSync(filePath).toString();
			return {
				file: filePath,
				jsdoc: jsdoc.explainSync({ source: fileData }),
				fileData,
			};
		});

		const tests = [];

		// Get all tests within the documentation
		fileData.forEach(file => {
			file.jsdoc.forEach(comment => {
				comment.tags &&
					comment.tags.forEach(tag => {
						if (tag.title != 'test') {
							return;
						}

						let testCode = tag.value.trim();
						let describe = '';

						if (testCode.charAt(0) === '"') {
							const match = testCode.match(/\"(.*?)\"/);
							testCode = testCode.replace(match[0], '').trim();
							describe = match[1];
						}

						tests.push({
							name: comment.name,
							type: comment.kind,
							describe,
							file: file.file,
							testCode,
							fileData: file.fileData,
						});
					});
			});
		});

		console.log(`Found ${tests.length} tests`);
		let success = 0;
		let failed = 0;
		let printedHeaders = [];

		// Run all tests and wait for results
		await Promise.all(
			tests.map(async test => {
				const header = `${test.type}: ${test.name} in ${test.file}`;
				if (printedHeaders.indexOf(header) === -1) {
					console.log(chalk.green(header));
					printedHeaders.push(header);
				}

				console.log(`${test.describe || 'Running'}:`);

				customPrintTest(`${test.testCode}`);

				try {
					let code = `${testRunnerCode}
${test.fileData}

${test.testCode}
`;
					let transpiledCode = '';

					try {
						transpiledCode = await new Promise(
							(resolve, reject) => {
								babel.transform(
									code,
									{
										babelrc: !!babelConfigFile,
										filename: babelConfigFile,
									},
									(error, result) => {
										if (error) {
											return reject(error);
										}

										return resolve(result.code);
									},
								);
							},
						);
					} catch (error) {
						throw new Error(
							`Failed to run test code: ${error.message}`,
						);
					}

					eval(transpiledCode);

					success++;
				} catch (error) {
					failed++;
					console.log(
						chalk.red(
							require('util').inspect(error, {
								colors: true,
								depth: null,
							}),
						),
					);
				}
			}),
		);

		if (success)
			console.log(chalk.green(`Tests finished successfully: ${success}`));
		if (failed) console.log(chalk.red(`Tests failed: ${failed}`));

		process.exit();
	},
);
