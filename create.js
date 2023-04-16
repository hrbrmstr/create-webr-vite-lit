#!/usr/bin/env node

// create.js
const fs = require('fs');
const path = require('path');

const copyDirectory = (src, dest) => {
	fs.mkdirSync(dest, { recursive: true });

	const files = fs.readdirSync(src);

	for (const file of files) {
		const srcPath = path.join(src, file);
		const destPath = path.join(dest, file);
		const stat = fs.statSync(srcPath);

		if (stat.isDirectory()) {
			copyDirectory(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
};

const main = () => {
	const projectName = process.argv[ 2 ] || 'new-project';
	const templatePath = path.join(__dirname, 'template');
	const projectPath = path.resolve(process.cwd(), projectName);

	copyDirectory(templatePath, projectPath);
	console.log(`Template project created successfully in ${projectPath}`);
};

main();
