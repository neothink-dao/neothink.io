import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';
export async function validateDocLinks() {
    try {
        logger.info('Validating documentation links...');
        const docsPath = path.join(process.cwd(), 'docs');
        const markdownFiles = await findMarkdownFiles(docsPath);
        const validationResults = [];
        for (const filePath of markdownFiles) {
            const result = await validateFileLinks(filePath);
            if (result.brokenLinks.length > 0) {
                validationResults.push(result);
            }
        }
        await generateLinkReport(validationResults);
        logger.success('Link validation completed!');
    }
    catch (error) {
        logger.error('Error validating documentation links:', error);
        throw error;
    }
}
async function findMarkdownFiles(dir) {
    const files = [];
    async function scan(directory) {
        const entries = await fs.readdir(directory, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                await scan(fullPath);
            }
            else if (entry.isFile() && entry.name.endsWith('.md')) {
                files.push(fullPath);
            }
        }
    }
    await scan(dir);
    return files;
}
async function validateFileLinks(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    const brokenLinks = [];
    // Regular expressions for different types of links
    const patterns = {
        internal: /\[([^\]]+)\]\(([^)]+\.md[^)]*)\)/g,
        codeReference: /`([^`]+:[0-9]+-[0-9]+)`/g,
        external: /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g
    };
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Check internal links
        for (const match of line.matchAll(patterns.internal)) {
            const [, , link] = match;
            const targetPath = path.join(path.dirname(filePath), link.split('#')[0]);
            try {
                await fs.access(targetPath);
            }
            catch (_a) {
                brokenLinks.push({
                    link,
                    type: 'internal',
                    line: i + 1
                });
            }
        }
        // Check code references
        for (const match of line.matchAll(patterns.codeReference)) {
            const [, reference] = match;
            const [file, lineRange] = reference.split(':');
            const [start, end] = lineRange.split('-').map(Number);
            try {
                const targetPath = path.join(process.cwd(), file);
                const fileContent = await fs.readFile(targetPath, 'utf8');
                const lineCount = fileContent.split('\n').length;
                if (start > lineCount || end > lineCount) {
                    brokenLinks.push({
                        link: reference,
                        type: 'code-reference',
                        line: i + 1
                    });
                }
            }
            catch (_b) {
                brokenLinks.push({
                    link: reference,
                    type: 'code-reference',
                    line: i + 1
                });
            }
        }
        // Check external links (optional - can be enabled if needed)
        // This would require HTTP requests to validate external links
        // Commented out to avoid unnecessary network requests
        /*
        for (const match of line.matchAll(patterns.external)) {
          const [, , link] = match;
          try {
            const response = await fetch(link);
            if (!response.ok) {
              brokenLinks.push({
                link,
                type: 'external',
                line: i + 1
              });
            }
          } catch {
            brokenLinks.push({
              link,
              type: 'external',
              line: i + 1
            });
          }
        }
        */
    }
    return {
        filePath: path.relative(process.cwd(), filePath),
        brokenLinks
    };
}
async function generateLinkReport(results) {
    let markdown = '# Documentation Link Validation Report\n\n';
    markdown += '> This report is automatically generated. It helps maintain documentation link integrity.\n\n';
    if (results.length === 0) {
        markdown += '✅ All documentation links are valid!\n';
    }
    else {
        markdown += '## Broken Links Found\n\n';
        for (const result of results) {
            markdown += `### ${result.filePath}\n\n`;
            markdown += '| Type | Line | Link | Suggestion |\n';
            markdown += '|------|------|------|------------|\n';
            for (const brokenLink of result.brokenLinks) {
                const suggestion = generateSuggestion(brokenLink);
                markdown += `| ${brokenLink.type} | ${brokenLink.line} | \`${brokenLink.link}\` | ${suggestion} |\n`;
            }
            markdown += '\n';
        }
    }
    const reportPath = path.join(process.cwd(), 'docs', 'link-validation-report.md');
    await fs.writeFile(reportPath, markdown, 'utf8');
    logger.info(`Link validation report generated at ${reportPath}`);
}
function generateSuggestion(brokenLink) {
    switch (brokenLink.type) {
        case 'internal':
            return 'Check if the referenced markdown file exists and the path is correct';
        case 'code-reference':
            return 'Verify the file exists and the line range is valid';
        case 'external':
            return 'Verify the URL is accessible and correct';
        default:
            return 'Check link validity';
    }
}
//# sourceMappingURL=links.js.map