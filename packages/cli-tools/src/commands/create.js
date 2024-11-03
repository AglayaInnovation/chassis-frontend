import fs from 'fs';
import path from 'path';

import { createFolderStructure,displayFolderStructure } from '../utils/create-folders.js';
import { htmlProjectStructure } from '../utils/project-structure.js';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import {execSync} from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const choices = ['templates-html', 'none'];
async function create(name) {
    const questions = [
        {
            type: 'list',
            name: 'type',
            message: 'What type of project do you want to create?',
            choices: choices
        },
        {
            type: 'input',
            name: 'description',
            message: 'Enter a brief description of your project:'
        }
    ];

    try {
        const answers = await inquirer.prompt(questions);
        const projectPath = path.join(process.cwd(), name);

        if (fs.existsSync(projectPath)) {
            console.error(`Error: A project named "${name}" already exists.`);
            process.exit(1);
        }

        fs.mkdirSync(projectPath);
        const projectStructure  = {
            'templates-html': htmlProjectStructure(name, answers.description),
            'none': {}
        }
        const basePath = path.join(process.cwd(), name);
        createFolderStructure(basePath, projectStructure[answers.type]);

        if(answers.type === 'none') {
            console.log(`Project "${name}" created successfully!`);
            console.log(`Type: ${answers.type}`);
            console.log(`Description: ${answers.description}`);
            console.log('\nCreated folder structure:');
            displayFolderStructure(basePath);
            return;
        }

        // Create project structure
        // Initialize npm and install dependencies
        process.chdir(name);
        execSync('yarn install', { stdio: 'inherit' });

        // Build Tailwind CSS
        execSync('yarn run build', { stdio: 'inherit' });

        console.log(`Project "${name}" created successfully!`);
        console.log(`Type: ${answers.type}`);
        console.log(`Description: ${answers.description}`);
        console.log('\nCreated folder structure:');
        displayFolderStructure(basePath);
    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
}

export default create;
