import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';
export async function validateAIFriendlyStructure() {
    try {
        logger.info('Validating AI-friendly documentation structure...');
        // Get all markdown files
        const docsPath = path.join(process.cwd(), 'docs');
        const markdownFiles = await findMarkdownFiles(docsPath);
        const validationResults = [];
        // Validate each file
        for (const filePath of markdownFiles) {
            const content = await fs.readFile(filePath, 'utf8');
            const results = await validateFile(content);
            validationResults.push({
                filePath: path.relative(process.cwd(), filePath),
                results
            });
        }
        // Generate validation report
        await generateValidationReport(validationResults);
        logger.success('AI-friendly structure validation completed!');
    }
    catch (error) {
        logger.error('Error validating AI-friendly structure:', error);
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
const validationRules = [
    {
        name: 'Has Clear Title',
        validate: (content) => {
            const hasTitle = /^#\s+.+/.test(content);
            return {
                passed: hasTitle,
                message: hasTitle ? 'Document has a clear title' : 'Document should start with a top-level heading (#)',
                suggestions: hasTitle ? undefined : ['Add a top-level heading at the start of the document']
            };
        }
    },
    {
        name: 'Has Overview Section',
        validate: (content) => {
            const hasOverview = /##\s+Overview/.test(content);
            return {
                passed: hasOverview,
                message: hasOverview ? 'Document has an overview section' : 'Document should include an overview section',
                suggestions: hasOverview ? undefined : ['Add an overview section after the title']
            };
        }
    },
    {
        name: 'Has Code References',
        validate: (content) => {
            const hasCodeRefs = /`[^`]+:[0-9]+-[0-9]+`/.test(content);
            return {
                passed: hasCodeRefs,
                message: hasCodeRefs ? 'Document includes code references' : 'Document should include code references where applicable',
                suggestions: hasCodeRefs ? undefined : ['Add code references in the format `filename:line-range`']
            };
        }
    },
    {
        name: 'Has Component Dependencies',
        validate: (content) => {
            const hasDeps = /##\s+Dependencies/.test(content);
            return {
                passed: hasDeps,
                message: hasDeps ? 'Document lists component dependencies' : 'Document should list component dependencies',
                suggestions: hasDeps ? undefined : ['Add a dependencies section listing related components']
            };
        }
    },
    {
        name: 'Has Examples',
        validate: (content) => {
            const hasExamples = /##\s+Examples/.test(content) || /```[a-z]*\n[\s\S]*?\n```/.test(content);
            return {
                passed: hasExamples,
                message: hasExamples ? 'Document includes examples' : 'Document should include practical examples',
                suggestions: hasExamples ? undefined : ['Add code examples or usage examples where applicable']
            };
        }
    }
];
async function validateFile(content) {
    return validationRules.map(rule => rule.validate(content));
}
async function generateValidationReport(results) {
    var _a;
    let markdown = '# AI-Friendly Documentation Validation Report\n\n';
    markdown += '> This report is automatically generated. It helps maintain AI-friendly documentation structure.\n\n';
    for (const fileValidation of results) {
        markdown += `## ${fileValidation.filePath}\n\n`;
        const passedRules = fileValidation.results.filter(r => r.passed).length;
        const totalRules = fileValidation.results.length;
        markdown += `**Score**: ${passedRules}/${totalRules}\n\n`;
        for (const result of fileValidation.results) {
            const icon = result.passed ? '✅' : '❌';
            markdown += `${icon} ${result.message}\n`;
            if ((_a = result.suggestions) === null || _a === void 0 ? void 0 : _a.length) {
                markdown += '\nSuggestions:\n';
                for (const suggestion of result.suggestions) {
                    markdown += `- ${suggestion}\n`;
                }
                markdown += '\n';
            }
        }
        markdown += '---\n\n';
    }
    const reportPath = path.join(process.cwd(), 'docs', 'validation-report.md');
    await fs.writeFile(reportPath, markdown, 'utf8');
    logger.info(`Validation report generated at ${reportPath}`);
}
//# sourceMappingURL=ai-structure.js.map