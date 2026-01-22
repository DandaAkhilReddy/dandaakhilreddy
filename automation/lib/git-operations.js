/**
 * Git Operations
 * Handles git add, commit, and push operations
 */

import simpleGit from 'simple-git';

/**
 * Commit and push changes to the repository
 * @param {string} repoPath - Path to the repository
 * @param {string} projectTitle - Title of the project for commit message
 * @param {string} filename - Generated HTML filename
 * @returns {Promise<void>}
 */
export async function gitCommitAndPush(repoPath, projectTitle, filename) {
  const git = simpleGit(repoPath);

  console.log('Staging changes...');

  // Stage specific files
  const filesToAdd = [
    `projects/${filename}`,
    'browse.html'
  ];

  for (const file of filesToAdd) {
    try {
      await git.add(file);
      console.log(`  Staged: ${file}`);
    } catch (e) {
      console.warn(`  Warning: Could not stage ${file}`);
    }
  }

  // Create commit
  const commitMessage = `Add ${projectTitle} project page

- Created projects/${filename}
- Added project card to browse.html

Co-Authored-By: Portfolio Automation <automation@dandaakhilreddy.com>`;

  console.log('Creating commit...');
  await git.commit(commitMessage);

  // Push to remote
  console.log('Pushing to remote...');
  try {
    await git.push('origin', 'main');
    console.log('Successfully pushed to origin/main');
  } catch (e) {
    // Try master if main fails
    try {
      await git.push('origin', 'master');
      console.log('Successfully pushed to origin/master');
    } catch (e2) {
      console.error('Failed to push. You may need to push manually.');
      throw e2;
    }
  }
}

/**
 * Check if there are uncommitted changes
 * @param {string} repoPath - Path to the repository
 * @returns {Promise<boolean>}
 */
export async function hasUncommittedChanges(repoPath) {
  const git = simpleGit(repoPath);
  const status = await git.status();
  return !status.isClean();
}

/**
 * Get current branch name
 * @param {string} repoPath - Path to the repository
 * @returns {Promise<string>}
 */
export async function getCurrentBranch(repoPath) {
  const git = simpleGit(repoPath);
  const branchSummary = await git.branchLocal();
  return branchSummary.current;
}

export default {
  gitCommitAndPush,
  hasUncommittedChanges,
  getCurrentBranch
};
