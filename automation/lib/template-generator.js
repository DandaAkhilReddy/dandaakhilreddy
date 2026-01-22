/**
 * Template Generator
 * Generates project HTML pages from templates using Handlebars
 */

import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register Handlebars helpers
Handlebars.registerHelper('add', (a, b) => a + b);

/**
 * Generate a project HTML page from template
 * @param {Object} projectData - Project data to fill template
 * @returns {Promise<string>} Generated HTML
 */
export async function generateProjectHtml(projectData) {
  const templatePath = path.join(__dirname, '..', 'templates', 'project-template.hbs');
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);

  // Set defaults
  const data = {
    projectNumber: projectData.projectNumber || 'Project',
    date: projectData.date || formatDate(new Date()),
    title: projectData.title || projectData.name || 'Untitled Project',
    tagline: projectData.tagline || projectData.description?.slice(0, 100) || '',
    description: projectData.description || '',
    githubUrl: projectData.githubUrl || projectData.url || '',
    youtubeUrl: projectData.youtubeUrl || null,
    linkedinUrl: projectData.linkedinUrl || null,
    techStack: projectData.techStack || [],
    problems: projectData.problems || [],
    problemIntro: projectData.problemIntro || 'This project addresses several challenges:',
    solutions: projectData.solutions || [],
    solutionIntro: projectData.solutionIntro || 'The solution provides:',
    features: projectData.features || [],
    installSteps: projectData.installSteps || [],
    ctaTitle: projectData.ctaTitle || `Ready to try ${projectData.title || 'this project'}?`,
    ctaDescription: projectData.ctaDescription || 'Check out the full project on GitHub for documentation and source code.',
    nextProject: projectData.nextProject || null
  };

  return template(data);
}

/**
 * Generate filename from project title
 * @param {string} title - Project title
 * @param {string} projectNumber - Project number (e.g., "Project 7")
 * @returns {string} Filename
 */
export function generateFilename(title, projectNumber) {
  // Extract number from project number (e.g., "Project 7" -> "7")
  const numMatch = projectNumber?.match(/\d+/);
  const num = numMatch ? numMatch[0] : Date.now();

  // Convert title to slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `day-${num}-${slug}.html`;
}

/**
 * Format date as "Mon YYYY"
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Generate project card HTML for browse.html
 * @param {Object} projectData - Project data
 * @param {string} filename - Generated HTML filename
 * @returns {string} Card HTML
 */
export function generateProjectCard(projectData, filename) {
  const badgeColor = projectData.badgeColor || 'linear-gradient(135deg, #E50914 0%, #ff4d4d 100%)';

  // Get stats from techStack or provide defaults
  const stats = projectData.stats || [
    projectData.techStack?.[0]?.name || 'Modern',
    projectData.techStack?.[1]?.name || 'Stack',
    'Open Source'
  ];

  return `
                <!-- ${projectData.projectNumber} Card - ${projectData.title} -->
                <div class="daily-card featured" onclick="window.location.href='projects/${filename}'" style="cursor: pointer;">
                    <div class="daily-card-image">
                        <img src="${projectData.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop'}" alt="${projectData.title}">
                        <div class="day-badge new" style="background: ${badgeColor};">${projectData.projectNumber}</div>
                        <div class="new-ribbon">NEW</div>
                        <div class="card-gradient"></div>
                    </div>
                    <div class="daily-card-content">
                        <h3>${projectData.title}</h3>
                        <p class="card-description">${projectData.tagline || projectData.description?.slice(0, 100) || ''}</p>
                        <div class="card-stats">
                            <span class="stat-item"><strong>${stats[0]}</strong></span>
                            <span class="stat-item"><strong>${stats[1]}</strong></span>
                            <span class="stat-item"><strong>${stats[2]}</strong></span>
                        </div>
                        <div class="card-links">
                            <a href="${projectData.githubUrl}" target="_blank" class="card-link github">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                GitHub
                            </a>${projectData.youtubeUrl ? `
                            <a href="${projectData.youtubeUrl}" target="_blank" class="card-link" style="background: rgba(255, 0, 0, 0.2); color: #ff4444;">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                                Demo
                            </a>` : ''}${projectData.linkedinUrl ? `
                            <a href="${projectData.linkedinUrl}" target="_blank" class="card-link linkedin">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                Post
                            </a>` : ''}
                        </div>
                    </div>
                </div>`;
}

export default {
  generateProjectHtml,
  generateFilename,
  generateProjectCard
};
