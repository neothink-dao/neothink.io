#!/usr/bin/env node

/**
 * @function ai-validator
 * @description Script to validate AI annotations in codebase
 * 
 * @ai-context
 * - Scans codebase for AI-friendly annotations
 * - Validates annotations against defined standards
 * - Reports missing or incomplete annotations
 * - Helps maintain AI-friendly documentation
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

// Configuration
const CONFIG = {
  componentTags: ['@component', '@description', '@ai-context', '@props', '@related'],
  databaseTags: ['@table', '@description', '@ai-context', '@columns', '@relationships', '@security'],
  functionTags: ['@function', '@description', '@ai-context', '@param', '@returns', '@related'],
  relationshipTags: ['@relationship', '@description', '@ai-context', '@implementation'],
  ignorePatterns: ['node_modules', '.next', '.turbo', 'dist', '.git'],
  fileExtensions: ['js', 'jsx', 'ts', 'tsx', 'sql']
};

// Stats tracking
const stats = {
  filesScanned: 0,
  componentsFound: 0,
  functionsFound: 0,
  databaseFound: 0,
  relationshipsFound: 0,
  compliantComponents: 0,
  compliantFunctions: 0,
  compliantDatabase: 0,
  compliantRelationships: 0,
  issues: []
};

/**
 * Check if a file should be scanned
 */
function shouldScanFile(filePath) {
  const ext = path.extname(filePath).substring(1);
  if (!CONFIG.fileExtensions.includes(ext)) return false;
  
  return !CONFIG.ignorePatterns.some(pattern => filePath.includes(pattern));
}

/**
 * Extract comment blocks from a file
 */
function extractCommentBlocks(content) {
  const multilineComments = [];
  const regex = /\/\*\*([\s\S]*?)\*\//g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    multilineComments.push(match[1].trim());
  }

  return multilineComments;
}

/**
 * Check if a comment has the required tags
 */
function validateTags(comment, requiredTags) {
  const presentTags = requiredTags.filter(tag => comment.includes(tag));
  return {
    compliant: presentTags.length === requiredTags.length,
    presentTags,
    missingTags: requiredTags.filter(tag => !comment.includes(tag))
  };
}

/**
 * Identify the type of comment and validate it
 */
function analyzeComment(comment, filePath, lineNumber) {
  if (comment.includes('@component')) {
    stats.componentsFound++;
    const result = validateTags(comment, CONFIG.componentTags);
    if (result.compliant) stats.compliantComponents++;
    else recordIssue('component', filePath, lineNumber, result.missingTags);
    return;
  }
  
  if (comment.includes('@function')) {
    stats.functionsFound++;
    const result = validateTags(comment, CONFIG.functionTags);
    if (result.compliant) stats.compliantFunctions++;
    else recordIssue('function', filePath, lineNumber, result.missingTags);
    return;
  }
  
  if (comment.includes('@table')) {
    stats.databaseFound++;
    const result = validateTags(comment, CONFIG.databaseTags);
    if (result.compliant) stats.compliantDatabase++;
    else recordIssue('database', filePath, lineNumber, result.missingTags);
    return;
  }
  
  if (comment.includes('@relationship')) {
    stats.relationshipsFound++;
    const result = validateTags(comment, CONFIG.relationshipTags);
    if (result.compliant) stats.compliantRelationships++;
    else recordIssue('relationship', filePath, lineNumber, result.missingTags);
    return;
  }
}

/**
 * Record an issue for reporting
 */
function recordIssue(type, filePath, lineNumber, missingTags) {
  stats.issues.push({
    type,
    filePath,
    lineNumber,
    missingTags
  });
}

/**
 * Scan a file for AI annotations
 */
function scanFile(filePath) {
  stats.filesScanned++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const comments = extractCommentBlocks(content);
    
    // Get approximate line numbers for comments
    const lines = content.split('\n');
    
    comments.forEach(comment => {
      // Find line number (approximate)
      const commentStart = content.indexOf(comment);
      const linesBefore = content.substring(0, commentStart).split('\n');
      const lineNumber = linesBefore.length;
      
      analyzeComment(comment, filePath, lineNumber);
    });
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
  }
}

/**
 * Generate a report of the validation results
 */
function generateReport() {
  const compliance = {
    components: stats.componentsFound > 0 ? 
      (stats.compliantComponents / stats.componentsFound * 100).toFixed(1) : 0,
    functions: stats.functionsFound > 0 ? 
      (stats.compliantFunctions / stats.functionsFound * 100).toFixed(1) : 0,
    database: stats.databaseFound > 0 ? 
      (stats.compliantDatabase / stats.databaseFound * 100).toFixed(1) : 0,
    relationships: stats.relationshipsFound > 0 ? 
      (stats.compliantRelationships / stats.relationshipsFound * 100).toFixed(1) : 0,
    overall: ((stats.compliantComponents + stats.compliantFunctions + stats.compliantDatabase + stats.compliantRelationships) / 
      (stats.componentsFound + stats.functionsFound + stats.databaseFound + stats.relationshipsFound) * 100 || 0).toFixed(1)
  };
  
  console.log(chalk.bold('\n✅ AI Documentation Validation Report'));
  console.log(chalk.bold('===============================\n'));
  
  console.log(`Files scanned: ${chalk.green(stats.filesScanned)}`);
  console.log(`\nAnnotated items found:`);
  console.log(`- Components: ${chalk.yellow(stats.componentsFound)} (${compliance.components}% compliant)`);
  console.log(`- Functions: ${chalk.yellow(stats.functionsFound)} (${compliance.functions}% compliant)`);
  console.log(`- Database: ${chalk.yellow(stats.databaseFound)} (${compliance.database}% compliant)`);
  console.log(`- Relationships: ${chalk.yellow(stats.relationshipsFound)} (${compliance.relationships}% compliant)`);
  console.log(`\nOverall compliance: ${chalk.cyan(compliance.overall)}%`);
  
  if (stats.issues.length > 0) {
    console.log(chalk.bold('\n⚠️ Issues Found:'));
    console.log(chalk.bold('===============\n'));
    
    stats.issues.forEach(issue => {
      console.log(`${chalk.cyan(issue.filePath)}:${chalk.yellow(issue.lineNumber)} - ${chalk.magenta(issue.type)}`);
      console.log(`  Missing tags: ${chalk.red(issue.missingTags.join(', '))}`);
    });
  }
  
  console.log('\n');
}

/**
 * Main function
 */
async function main() {
  try {
    // Check for --update-only flag
    const updateOnly = process.argv.includes('--update-only');
    
    if (updateOnly) {
      console.log(chalk.bold('🔄 Updating .ai-context.json timestamp only...'));
      updateAiContextTimestamp();
      return;
    }
    
    console.log(chalk.bold('🔍 Scanning codebase for AI annotations...'));
    
    // Get list of files to scan
    const files = glob.sync('**/*.{js,jsx,ts,tsx,sql}', {
      ignore: CONFIG.ignorePatterns.map(pattern => `**/${pattern}/**`)
    });
    
    // Scan each file
    files.forEach(filePath => {
      if (shouldScanFile(filePath)) {
        scanFile(filePath);
      }
    });
    
    // Generate report
    generateReport();
    
    // Update timestamp
    updateAiContextTimestamp();
    
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Update the timestamp in .ai-context.json
 */
function updateAiContextTimestamp() {
  try {
    const aiContextPath = path.resolve('.ai-context.json');
    if (fs.existsSync(aiContextPath)) {
      const aiContext = JSON.parse(fs.readFileSync(aiContextPath, 'utf8'));
      aiContext.lastUpdated = new Date().toISOString();
      fs.writeFileSync(aiContextPath, JSON.stringify(aiContext, null, 2));
      console.log(chalk.green('Updated .ai-context.json timestamp'));
    }
  } catch (err) {
    console.error(`Error updating .ai-context.json: ${err.message}`);
  }
}

// Run the script
main(); 