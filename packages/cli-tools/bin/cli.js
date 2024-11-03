#!/usr/bin/env node

import { program } from 'commander';
import { create, help } from '../src/index.js';

program
    .version('1.0.0')
    .description('A CLI library for project management');

program
    .command('create <name>')
    .description('Create a new project')
    .action(create);

program
    .command('help')
    .description('Display help information')
    .action(help);

program.parse(process.argv);
