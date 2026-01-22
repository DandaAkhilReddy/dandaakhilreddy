/**
 * GitHub Repository Fetcher
 * Fetches repository information from GitHub API
 */

import { Octokit } from '@octokit/rest';

/**
 * Parse GitHub URL to extract owner and repo name
 * @param {string} url - GitHub repository URL
 * @returns {{owner: string, repo: string}}
 */
export function parseGitHubUrl(url) {
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)/,
    /github\.com:([^\/]+)\/([^\/]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, '')
      };
    }
  }

  throw new Error(`Invalid GitHub URL: ${url}`);
}

/**
 * Fetch repository data from GitHub
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object>} Repository data
 */
export async function fetchRepoData(owner, repo) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN // Optional for public repos
  });

  console.log(`Fetching repository: ${owner}/${repo}...`);

  // Fetch repository details
  const { data: repoInfo } = await octokit.repos.get({ owner, repo });

  // Fetch README
  let readme = null;
  try {
    const { data: readmeData } = await octokit.repos.getReadme({ owner, repo });
    readme = Buffer.from(readmeData.content, 'base64').toString('utf8');
  } catch (e) {
    console.warn('No README found');
  }

  // Fetch package.json for dependencies (if exists)
  let packageJson = null;
  try {
    const { data: pkgData } = await octokit.repos.getContent({
      owner, repo, path: 'package.json'
    });
    packageJson = JSON.parse(Buffer.from(pkgData.content, 'base64').toString('utf8'));
  } catch (e) {
    // No package.json - might be Python or other project
  }

  // Fetch requirements.txt for Python projects
  let requirements = null;
  try {
    const { data: reqData } = await octokit.repos.getContent({
      owner, repo, path: 'requirements.txt'
    });
    requirements = Buffer.from(reqData.content, 'base64').toString('utf8');
  } catch (e) {
    // No requirements.txt
  }

  // Fetch languages
  const { data: languages } = await octokit.repos.listLanguages({ owner, repo });

  return {
    name: repoInfo.name,
    description: repoInfo.description || '',
    url: repoInfo.html_url,
    homepage: repoInfo.homepage,
    topics: repoInfo.topics || [],
    languages,
    readme,
    packageJson,
    requirements,
    createdAt: repoInfo.created_at,
    updatedAt: repoInfo.updated_at,
    stars: repoInfo.stargazers_count,
    forks: repoInfo.forks_count
  };
}

/**
 * Extract key information from README
 * @param {string} readme - README content in markdown
 * @returns {Object} Extracted information
 */
export function parseReadme(readme) {
  if (!readme) return {};

  const result = {
    features: [],
    installation: [],
    description: ''
  };

  // Extract first paragraph as description
  const paragraphs = readme.split(/\n\n+/);
  for (const para of paragraphs) {
    const cleaned = para.replace(/^#+\s+.+\n?/, '').trim();
    if (cleaned && !cleaned.startsWith('#') && !cleaned.startsWith('```') && cleaned.length > 50) {
      result.description = cleaned.replace(/\n/g, ' ').slice(0, 500);
      break;
    }
  }

  // Extract features from bullet points under "Features" heading
  const featuresMatch = readme.match(/##?\s*(?:Features|Key Features|What it does)[^\n]*\n([\s\S]*?)(?=\n##|\n$)/i);
  if (featuresMatch) {
    const bullets = featuresMatch[1].match(/^[-*]\s+(.+)$/gm);
    if (bullets) {
      result.features = bullets.slice(0, 6).map(b => b.replace(/^[-*]\s+/, '').trim());
    }
  }

  // Extract installation steps
  const installMatch = readme.match(/##?\s*(?:Installation|Getting Started|Quick Start|Setup)[^\n]*\n([\s\S]*?)(?=\n##|\n$)/i);
  if (installMatch) {
    const codeBlocks = installMatch[1].match(/```[\s\S]*?```/g);
    if (codeBlocks) {
      result.installation = codeBlocks.map(block =>
        block.replace(/```\w*\n?/g, '').trim()
      ).filter(cmd => cmd.length > 0);
    }
  }

  return result;
}

/**
 * Detect tech stack from repository data
 * @param {Object} repoData - Repository data from GitHub
 * @returns {Array} Detected tech stack
 */
export function detectTechStack(repoData) {
  const techStack = [];
  const { languages, packageJson, requirements, readme, topics } = repoData;

  // Common tech mappings
  const techMappings = {
    // Languages
    'JavaScript': { abbr: 'JS', name: 'JavaScript', description: 'Core language', color: 'linear-gradient(135deg, #f7df1e 0%, #c9b200 100%)' },
    'TypeScript': { abbr: 'TS', name: 'TypeScript', description: 'Type-safe JavaScript', color: 'linear-gradient(135deg, #3178c6 0%, #235a97 100%)' },
    'Python': { abbr: 'Py', name: 'Python', description: 'Core language', color: 'linear-gradient(135deg, #3776ab 0%, #ffd43b 100%)' },
    'Go': { abbr: 'Go', name: 'Golang', description: 'Systems programming', color: 'linear-gradient(135deg, #00add8 0%, #007d9c 100%)' },
    'Rust': { abbr: 'Rs', name: 'Rust', description: 'Systems programming', color: 'linear-gradient(135deg, #dea584 0%, #b7410e 100%)' },
    'HTML': { abbr: 'HTML', name: 'HTML5', description: 'Markup language', color: 'linear-gradient(135deg, #e34c26 0%, #f06529 100%)' },
    'CSS': { abbr: 'CSS', name: 'CSS3', description: 'Styling', color: 'linear-gradient(135deg, #264de4 0%, #2965f1 100%)' },
    // Frameworks/Libraries (from topics/dependencies)
    'react': { abbr: 'React', name: 'React', description: 'UI library', color: 'linear-gradient(135deg, #61dafb 0%, #21a1c4 100%)' },
    'nextjs': { abbr: 'Next', name: 'Next.js', description: 'React framework', color: 'linear-gradient(135deg, #000 0%, #333 100%)' },
    'nodejs': { abbr: 'Node', name: 'Node.js', description: 'Runtime', color: 'linear-gradient(135deg, #68a063 0%, #3c873a 100%)' },
    'docker': { abbr: 'Docker', name: 'Docker', description: 'Containerization', color: 'linear-gradient(135deg, #2496ed 0%, #1976d2 100%)' },
    'aws': { abbr: 'AWS', name: 'AWS', description: 'Cloud platform', color: 'linear-gradient(135deg, #ff9900 0%, #cc7a00 100%)' },
    'tensorflow': { abbr: 'TF', name: 'TensorFlow', description: 'ML framework', color: 'linear-gradient(135deg, #ff6f00 0%, #ff9800 100%)' },
    'pytorch': { abbr: 'PT', name: 'PyTorch', description: 'ML framework', color: 'linear-gradient(135deg, #ee4c2c 0%, #ff6f61 100%)' },
    'openai': { abbr: 'GPT', name: 'OpenAI', description: 'AI/LLM', color: 'linear-gradient(135deg, #412991 0%, #10a37f 100%)' },
    'langchain': { abbr: 'LC', name: 'LangChain', description: 'LLM framework', color: 'linear-gradient(135deg, #1c3c3c 0%, #2d5a5a 100%)' }
  };

  // Add from languages
  if (languages) {
    const topLangs = Object.keys(languages).slice(0, 3);
    for (const lang of topLangs) {
      if (techMappings[lang]) {
        techStack.push(techMappings[lang]);
      }
    }
  }

  // Add from topics
  if (topics) {
    for (const topic of topics) {
      const key = topic.toLowerCase();
      if (techMappings[key] && !techStack.find(t => t.name.toLowerCase() === techMappings[key].name.toLowerCase())) {
        techStack.push(techMappings[key]);
      }
    }
  }

  // Check dependencies
  if (packageJson?.dependencies) {
    const deps = Object.keys(packageJson.dependencies);
    const depMappings = {
      'react': 'react',
      'next': 'nextjs',
      '@tensorflow/tfjs': 'tensorflow',
      'openai': 'openai',
      'langchain': 'langchain'
    };
    for (const [dep, key] of Object.entries(depMappings)) {
      if (deps.includes(dep) && techMappings[key] && !techStack.find(t => t.name.toLowerCase() === techMappings[key].name.toLowerCase())) {
        techStack.push(techMappings[key]);
      }
    }
  }

  // Check requirements.txt
  if (requirements) {
    const reqLower = requirements.toLowerCase();
    const pyMappings = {
      'tensorflow': 'tensorflow',
      'torch': 'pytorch',
      'openai': 'openai',
      'langchain': 'langchain'
    };
    for (const [pkg, key] of Object.entries(pyMappings)) {
      if (reqLower.includes(pkg) && techMappings[key] && !techStack.find(t => t.name.toLowerCase() === techMappings[key].name.toLowerCase())) {
        techStack.push(techMappings[key]);
      }
    }
  }

  return techStack.slice(0, 4); // Limit to 4 items
}

export default {
  parseGitHubUrl,
  fetchRepoData,
  parseReadme,
  detectTechStack
};
