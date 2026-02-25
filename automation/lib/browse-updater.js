/**
 * Browse Page Updater
 * Updates browse.html to add new project cards
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateProjectCard } from './template-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Update browse.html with a new project card
 * @param {Object} projectData - Project data
 * @param {string} filename - Generated HTML filename
 * @param {string} portfolioPath - Path to portfolio directory
 * @returns {Promise<void>}
 */
export async function updateBrowseHtml(projectData, filename, portfolioPath) {
  const browsePath = path.join(portfolioPath, 'browse.html');
  let browseContent = await fs.readFile(browsePath, 'utf-8');

  // Generate the card HTML
  const cardHtml = generateProjectCard(projectData, filename);

  // Find the insertion point - right before the closing tags of the daily-shipping section
  // We look for the pattern: </div>\n            </div>\n        </div>\n    </section>\n\n    <!-- Professional Experience -->
  const insertPattern = /(<\/div>\s*<\/div>\s*<\/div>\s*<\/section>\s*\n\s*<!-- Professional Experience -->)/;

  if (!insertPattern.test(browseContent)) {
    // Fallback: try to find just before Professional Experience section
    const fallbackPattern = /(    <\/section>\s*\n\s*<!-- Professional Experience -->)/;
    if (fallbackPattern.test(browseContent)) {
      browseContent = browseContent.replace(
        fallbackPattern,
        `${cardHtml}
            </div>
        </div>
    </section>

    <!-- Professional Experience -->`
      );
    } else {
      throw new Error('Could not find insertion point in browse.html');
    }
  } else {
    // Insert the new card before the closing tags
    browseContent = browseContent.replace(
      insertPattern,
      `${cardHtml}
            </div>
        </div>
    </section>

    <!-- Professional Experience -->`
    );
  }

  await fs.writeFile(browsePath, browseContent);
  console.log(`Updated browse.html with ${projectData.title} card`);
}

/**
 * Get the next project number by scanning existing projects
 * @param {string} portfolioPath - Path to portfolio directory
 * @returns {Promise<number>}
 */
export async function getNextProjectNumber(portfolioPath) {
  const projectsDir = path.join(portfolioPath, 'projects');

  try {
    const files = await fs.readdir(projectsDir);
    const projectFiles = files.filter(f => f.startsWith('day-') && f.endsWith('.html'));

    let maxNum = 0;
    for (const file of projectFiles) {
      const match = file.match(/day-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }

    return maxNum + 1;
  } catch (e) {
    return 1;
  }
}

export default {
  updateBrowseHtml,
  getNextProjectNumber
};
