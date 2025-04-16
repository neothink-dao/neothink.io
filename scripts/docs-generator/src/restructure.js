import fs from 'fs/promises';
import path from 'path';
import { logger } from './utils/logger';
const DOCUMENTATION_STRUCTURE = {
    'architecture': {
        path: 'docs/architecture',
        description: 'System architecture documentation',
        required_sections: ['Overview', 'Components', 'Data Flow', 'Dependencies']
    },
    'api': {
        path: 'docs/api',
        description: 'API documentation',
        required_sections: ['Endpoints', 'Models', 'Authentication', 'Examples']
    },
    'database': {
        path: 'docs/database',
        description: 'Database documentation',
        required_sections: ['Schema', 'Relationships', 'Migrations', 'Queries']
    },
    'features': {
        path: 'docs/features',
        description: 'Feature documentation',
        required_sections: ['Overview', 'Implementation', 'Usage', 'Testing']
    },
    'platforms': {
        path: 'docs/platforms',
        description: 'Platform-specific documentation',
        required_sections: ['Overview', 'Features', 'Integration', 'Deployment']
    }
};
export async function restructureDocumentation() {
    try {
        logger.info('Starting documentation restructuring...');
        // Create directory structure
        await createDirectoryStructure();
        // Move and organize existing documentation
        await organizeExistingDocs();
        // Create index files
        await createIndexFiles();
        logger.success('Documentation restructuring completed!');
    }
    catch (error) {
        logger.error('Error restructuring documentation:', error);
        throw error;
    }
}
async function createDirectoryStructure() {
    for (const [, config] of Object.entries(DOCUMENTATION_STRUCTURE)) {
        await fs.mkdir(path.join(process.cwd(), config.path), { recursive: true });
    }
}
async function organizeExistingDocs() {
    const docsPath = path.join(process.cwd(), 'docs');
    const files = await fs.readdir(docsPath);
    for (const file of files) {
        if (!file.endsWith('.md'))
            continue;
        const filePath = path.join(docsPath, file);
        const content = await fs.readFile(filePath, 'utf8');
        // Determine the appropriate category
        const category = await determineCategory(content);
        if (!category)
            continue;
        // Create new path
        const newPath = path.join(process.cwd(), DOCUMENTATION_STRUCTURE[category].path, file);
        // Move file
        await fs.rename(filePath, newPath);
        logger.info(`Moved ${file} to ${category} category`);
        // Update content structure
        const updatedContent = await updateDocumentStructure(content, category);
        await fs.writeFile(newPath, updatedContent, 'utf8');
    }
}
async function determineCategory(content) {
    // Simple heuristic based on content keywords
    const categoryKeywords = {
        'architecture': ['architecture', 'system design', 'components', 'infrastructure'],
        'api': ['api', 'endpoint', 'request', 'response'],
        'database': ['database', 'schema', 'table', 'query'],
        'features': ['feature', 'functionality', 'implementation'],
        'platforms': ['platform', 'ascender', 'neothinker', 'immortal']
    };
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => content.toLowerCase().includes(keyword))) {
            return category;
        }
    }
    return null;
}
async function updateDocumentStructure(content, category) {
    const requiredSections = DOCUMENTATION_STRUCTURE[category].required_sections;
    let updatedContent = content;
    // Ensure document has a title
    if (!content.startsWith('# ')) {
        const title = path.basename(category).toUpperCase();
        updatedContent = `# ${title}\n\n${content}`;
    }
    // Add missing required sections
    for (const section of requiredSections) {
        if (!content.includes(`## ${section}`)) {
            updatedContent += `\n\n## ${section}\n\nTODO: Add ${section.toLowerCase()} documentation`;
        }
    }
    // Add AI-friendly metadata
    updatedContent = addAIMetadata(updatedContent, category);
    return updatedContent;
}
function addAIMetadata(content, category) {
    const metadata = `---
category: ${category}
last_updated: ${new Date().toISOString()}
ai_context: This document follows AI-friendly documentation practices
---

`;
    return metadata + content;
}
async function createIndexFiles() {
    for (const [category, config] of Object.entries(DOCUMENTATION_STRUCTURE)) {
        const indexPath = path.join(process.cwd(), config.path, 'README.md');
        const files = await fs.readdir(path.join(process.cwd(), config.path));
        let indexContent = `# ${category.charAt(0).toUpperCase() + category.slice(1)} Documentation\n\n`;
        indexContent += `${config.description}\n\n`;
        indexContent += '## Contents\n\n';
        for (const file of files) {
            if (file === 'README.md' || !file.endsWith('.md'))
                continue;
            indexContent += `- [${file.replace('.md', '')}](./${file})\n`;
        }
        await fs.writeFile(indexPath, indexContent, 'utf8');
    }
    // Create main index
    const mainIndexPath = path.join(process.cwd(), 'docs', 'README.md');
    let mainIndexContent = '# Documentation\n\n';
    mainIndexContent += 'Welcome to the documentation. This documentation follows AI-friendly practices for better analysis and understanding.\n\n';
    mainIndexContent += '## Categories\n\n';
    for (const [category, config] of Object.entries(DOCUMENTATION_STRUCTURE)) {
        mainIndexContent += `### [${category.charAt(0).toUpperCase() + category.slice(1)}](./${category})\n\n`;
        mainIndexContent += `${config.description}\n\n`;
    }
    await fs.writeFile(mainIndexPath, mainIndexContent, 'utf8');
}
//# sourceMappingURL=restructure.js.map