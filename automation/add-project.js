#!/usr/bin/env node

/**
 * Portfolio Project Automation CLI
 * Automatically adds new projects to the portfolio from GitHub URLs
 *
 * Usage:
 *   node add-project.js add <github-url> [options]
 *
 * Options:
 *   -n, --number <number>     Project number (e.g., "Project 7")
 *   -t, --tagline <tagline>   Custom tagline
 *   -y, --youtube <url>       YouTube demo URL
 *   -l, --linkedin <url>      LinkedIn post URL
 *   --no-push                 Skip git push
 *   --dry-run                 Preview without writing files
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { parseGitHubUrl, fetchRepoData, parseReadme, detectTechStack } from './lib/github-fetcher.js';
import { generateProjectHtml, generateFilename } from './lib/template-generator.js';
import { updateBrowseHtml, getNextProjectNumber } from './lib/browse-updater.js';
import { gitCommitAndPush } from './lib/git-operations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORTFOLIO_PATH = path.resolve(__dirname, '..');

const program = new Command();

program
  .name('add-project')
  .description('Add a new project to the portfolio from a GitHub URL')
  .version('1.0.0');

program
  .command('add <github-url>')
  .description('Add a new project from GitHub URL')
  .option('-n, --number <number>', 'Project number (e.g., "Project 7")')
  .option('-t, --tagline <tagline>', 'Custom tagline')
  .option('-y, --youtube <url>', 'YouTube demo URL')
  .option('-l, --linkedin <url>', 'LinkedIn post URL')
  .option('--no-push', 'Skip git push')
  .option('--dry-run', 'Preview without writing files')
  .action(async (githubUrl, options) => {
    try {
      await addProject(githubUrl, options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

async function addProject(githubUrl, options) {
  console.log(chalk.blue('\n🚀 Portfolio Project Automation\n'));

  // 1. Parse GitHub URL
  console.log(chalk.gray('Parsing GitHub URL...'));
  const { owner, repo } = parseGitHubUrl(githubUrl);
  console.log(chalk.green(`  Repository: ${owner}/${repo}`));

  // 2. Fetch repo data
  console.log(chalk.gray('\nFetching repository data...'));
  const repoData = await fetchRepoData(owner, repo);
  console.log(chalk.green(`  Name: ${repoData.name}`));
  console.log(chalk.green(`  Description: ${repoData.description || 'No description'}`));
  console.log(chalk.green(`  Languages: ${Object.keys(repoData.languages).join(', ')}`));

  // 3. Parse README
  console.log(chalk.gray('\nParsing README...'));
  const readmeContent = parseReadme(repoData.readme);
  console.log(chalk.green(`  Found ${readmeContent.features?.length || 0} features`));
  console.log(chalk.green(`  Found ${readmeContent.installation?.length || 0} installation steps`));

  // 4. Detect tech stack
  console.log(chalk.gray('\nDetecting tech stack...'));
  const techStack = detectTechStack(repoData);
  console.log(chalk.green(`  Detected: ${techStack.map(t => t.name).join(', ') || 'None'}`));

  // 5. Determine project number
  let projectNumber = options.number;
  if (!projectNumber) {
    const nextNum = await getNextProjectNumber(PORTFOLIO_PATH);
    projectNumber = `Project ${nextNum}`;
  }
  console.log(chalk.green(`  Project Number: ${projectNumber}`));

  // 6. Interactive prompts for missing data
  console.log(chalk.blue('\n📝 Please provide additional information:\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Project title:',
      default: formatTitle(repoData.name),
      validate: input => input.length > 0 || 'Title is required'
    },
    {
      type: 'input',
      name: 'tagline',
      message: 'Tagline (short description):',
      default: options.tagline || repoData.description?.slice(0, 100) || ''
    },
    {
      type: 'editor',
      name: 'description',
      message: 'Full description (opens editor):',
      default: readmeContent.description || repoData.description || ''
    },
    {
      type: 'input',
      name: 'youtubeUrl',
      message: 'YouTube demo URL (optional):',
      default: options.youtube || ''
    },
    {
      type: 'input',
      name: 'linkedinUrl',
      message: 'LinkedIn post URL (optional):',
      default: options.linkedin || ''
    },
    {
      type: 'input',
      name: 'imageUrl',
      message: 'Card image URL (Unsplash recommended):',
      default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop'
    }
  ]);

  // 7. Build project data
  const projectData = {
    projectNumber,
    date: formatDate(new Date()),
    title: answers.title,
    tagline: answers.tagline,
    description: answers.description,
    githubUrl: repoData.url,
    youtubeUrl: answers.youtubeUrl || null,
    linkedinUrl: answers.linkedinUrl || null,
    imageUrl: answers.imageUrl,
    techStack: techStack.length > 0 ? techStack : [
      { abbr: 'Code', name: 'Open Source', description: 'Project', color: 'linear-gradient(135deg, #E50914 0%, #ff4d4d 100%)' }
    ],
    features: readmeContent.features?.map(f => ({
      title: f.split(' ').slice(0, 3).join(' '),
      description: f
    })) || [],
    problems: [],
    solutions: [],
    installSteps: readmeContent.installation?.map((code, i) => ({
      title: `Step ${i + 1}`,
      description: 'Run the following command:',
      code
    })) || [],
    ctaTitle: `Ready to try ${answers.title}?`,
    ctaDescription: 'Check out the full project on GitHub for documentation and source code.',
    stats: [
      techStack[0]?.name || 'Modern',
      techStack[1]?.name || 'Stack',
      'Open Source'
    ],
    badgeColor: techStack[0]?.color || 'linear-gradient(135deg, #E50914 0%, #ff4d4d 100%)'
  };

  // 8. Generate HTML
  console.log(chalk.blue('\n🔧 Generating project page...\n'));
  const filename = generateFilename(projectData.title, projectNumber);
  const projectHtml = await generateProjectHtml(projectData);

  if (options.dryRun) {
    console.log(chalk.yellow('DRY RUN - Would create:'));
    console.log(chalk.gray(`  File: projects/${filename}`));
    console.log(chalk.gray(`  Title: ${projectData.title}`));
    console.log(chalk.gray(`  Tech: ${techStack.map(t => t.name).join(', ')}`));
    return;
  }

  // 9. Write project file
  const projectPath = path.join(PORTFOLIO_PATH, 'projects', filename);
  await fs.writeFile(projectPath, projectHtml);
  console.log(chalk.green(`  Created: projects/${filename}`));

  // 10. Update browse.html
  console.log(chalk.gray('Updating browse.html...'));
  await updateBrowseHtml(projectData, filename, PORTFOLIO_PATH);

  // 11. Git operations
  if (options.push !== false) {
    console.log(chalk.blue('\n📤 Committing and pushing...\n'));
    try {
      await gitCommitAndPush(PORTFOLIO_PATH, projectData.title, filename);
      console.log(chalk.green('\n✅ Successfully pushed to GitHub!'));
      console.log(chalk.gray('Netlify will auto-deploy in a few minutes.'));
    } catch (error) {
      console.log(chalk.yellow('\n⚠️  Could not push automatically.'));
      console.log(chalk.gray('Please push manually: git push'));
    }
  } else {
    console.log(chalk.yellow('\n⚠️  Skipped git push (--no-push flag)'));
    console.log(chalk.gray('Run: git add . && git commit -m "Add project" && git push'));
  }

  // 12. Success summary
  console.log(chalk.blue('\n🎉 Project added successfully!\n'));
  console.log(chalk.white(`  📄 Page: projects/${filename}`));
  console.log(chalk.white(`  🔗 GitHub: ${repoData.url}`));
  if (projectData.youtubeUrl) {
    console.log(chalk.white(`  📺 YouTube: ${projectData.youtubeUrl}`));
  }
  console.log();
}

/**
 * Format repository name as title
 */
function formatTitle(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Format date as "Mon DD, YYYY"
 */
function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

program.parse();
