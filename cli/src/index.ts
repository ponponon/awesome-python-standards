#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

program
  .name('aps')
  .description('CLI to install Awesome Python Standards skill for AI coding assistants')
  .version('1.1.0');

const PLATFORMS = [
  { name: 'Claude Code', value: 'claude' },
  { name: 'OpenCode', value: 'opencode' },
  { name: 'Codex CLI', value: 'codex' },
  { name: 'Cursor', value: 'cursor' },
  { name: 'Gemini CLI', value: 'gemini' },
  { name: 'GitHub Copilot CLI', value: 'copilot' },
  { name: 'Factory Droid', value: 'droid' },
  { name: 'Roo Code', value: 'roo' },
  { name: 'TRAE', value: 'trae' },
];

const GITHUB_REPO = 'ponponon/awesome-python-standards';
const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

program
  .command('init')
  .description('Initialize Awesome Python Standards for your AI coding assistant')
  .action(async () => {
    console.log(chalk.bold('\n🐍 Awesome Python Standards Installer\n'));

    const { platform } = await prompts({
      type: 'select',
      name: 'platform',
      message: 'Select your AI coding assistant:',
      choices: PLATFORMS,
    });

    if (!platform && platform !== 0) {
      console.log(chalk.yellow('\nInstallation cancelled.'));
      process.exit(0);
    }

    const selectedPlatform = PLATFORMS.find(p => p.value === platform);
    if (!selectedPlatform) {
      console.log(chalk.red('\nInvalid platform selected.'));
      process.exit(1);
    }
    const spinner = ora(`Installing for ${selectedPlatform.name}...`).start();

    try {
      const SKILL_DIR = 'awesome-python-standards';
      const SKILL_NAME = 'awesome-python-standards';

      switch (selectedPlatform.value) {
        case 'claude':
          spinner.text = 'Installing for Claude Code...';
          console.log(chalk.blue('\nRun the following command in Claude Code:'));
          console.log(chalk.white(`\n  /plugin install ${GITHUB_URL}\n`));
          console.log(chalk.gray('Or manually clone to ~/.claude/skills/'));
          break;

        case 'opencode':
          spinner.text = 'Installing for OpenCode...';
          console.log(chalk.blue('\nOption 1: Add to opencode.json plugin array:'));
          console.log(chalk.white(`\n  "plugin": ["${GITHUB_URL}"]\n`));
          console.log(chalk.blue('Option 2: Clone to skills directory:'));
          console.log(chalk.white(`\n  git clone ${GITHUB_URL} ~/.opencode/skills/${SKILL_DIR}\n`));
          break;

        case 'codex':
          spinner.text = 'Installing for Codex CLI...';
          console.log(chalk.blue('\nRun the following in Codex CLI:'));
          console.log(chalk.white('\n  /plugins'));
          console.log(chalk.white(`  Search: ${SKILL_NAME}\n`));
          break;

        case 'cursor':
          spinner.text = 'Installing for Cursor...';
          console.log(chalk.blue('\nIn Cursor Agent chat, run:'));
          console.log(chalk.white(`\n  /add-plugin ${SKILL_NAME}\n`));
          console.log(chalk.gray('Or manually clone to ~/.cursor/skills/'));
          break;

        case 'gemini':
          spinner.text = 'Installing for Gemini CLI...';
          console.log(chalk.blue('\nRun the following command:'));
          console.log(chalk.white(`\n  gemini extensions install ${GITHUB_URL}\n`));
          console.log(chalk.gray('Or manually clone to ~/.gemini/skills/'));
          break;

        case 'copilot':
          spinner.text = 'Installing for GitHub Copilot CLI...';
          console.log(chalk.blue('\nRun the following commands:'));
          console.log(chalk.white('\n  copilot plugin marketplace add obra/superpowers-marketplace'));
          console.log(chalk.white(`  copilot plugin install ${SKILL_NAME}@superpowers-marketplace\n`));
          break;

        case 'droid':
          spinner.text = 'Installing for Factory Droid...';
          console.log(chalk.blue('\nRun the following commands:'));
          console.log(chalk.white(`\n  droid plugin marketplace add ${GITHUB_URL}`));
          console.log(chalk.white(`  droid plugin install ${SKILL_NAME}@${SKILL_NAME}\n`));
          break;

        case 'roo':
          spinner.text = 'Installing for Roo Code...';
          console.log(chalk.blue(`\nSearch for "${SKILL_NAME}" in the Roo Code plugin marketplace.\n`));
          break;

        case 'trae':
          spinner.text = 'Installing for TRAE...';
          console.log(chalk.blue('\nRefer to TRAE documentation for plugin installation.\n'));
          break;
      }

      spinner.succeed(chalk.green('Installation instructions displayed!'));
      
      console.log(chalk.bold('\n📖 Usage:'));
      console.log(chalk.white('  Ask your AI assistant: "帮我按照 Python 后端开发规范写代码"'));
      console.log(chalk.white('  Or: "What are the best practices for Python backend development?"\n'));

    } catch (error) {
      spinner.fail(chalk.red('Installation failed'));
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('info')
  .description('Show information about Awesome Python Standards')
  .action(() => {
    console.log(chalk.bold('\n🐍 Awesome Python Standards\n'));
    console.log(chalk.white('A comprehensive Python backend development skill for AI coding assistants.\n'));
    console.log(chalk.bold('Contents:'));
    console.log(chalk.white('  • Type hints best practices (Python 3.10+)'));
    console.log(chalk.white('  • Pydantic V2 data modeling'));
    console.log(chalk.white('  • FastAPI development patterns'));
    console.log(chalk.white('  • ORM conventions (SQLModel, SQLAlchemy, Peewee)'));
    console.log(chalk.white('  • Project organization'));
    console.log(chalk.white('  • Code quality tools\n'));
    console.log(chalk.bold('Supported Platforms:'));
    PLATFORMS.forEach(p => console.log(chalk.white(`  • ${p.name}`)));
    console.log(chalk.bold('\nRepository:'));
    console.log(chalk.blue(`  ${GITHUB_URL}\n`));
  });

program.parse();
