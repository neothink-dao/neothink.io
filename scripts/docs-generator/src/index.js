import { generateSchemaDoc } from './generators/schema';
import { generateRelationshipDiagrams } from './generators/relationships';
import { validateDocLinks } from './validators/links';
import { updateAIMetadata } from './generators/ai-metadata';
import { restructureDocumentation } from './restructure';
import { validateAIFriendlyStructure } from './validators/ai-structure';
import { logger } from './utils/logger';
async function main() {
    try {
        logger.info('Starting documentation generation process...');
        // Step 1: Generate database schema documentation
        logger.info('Generating schema documentation...');
        await generateSchemaDoc();
        // Step 2: Generate relationship diagrams
        logger.info('Generating relationship diagrams...');
        await generateRelationshipDiagrams();
        // Step 3: Validate documentation links
        logger.info('Validating documentation links...');
        await validateDocLinks();
        // Step 4: Update AI metadata
        logger.info('Updating AI metadata...');
        await updateAIMetadata();
        // Step 5: Restructure documentation if needed
        logger.info('Restructuring documentation...');
        await restructureDocumentation();
        // Step 6: Validate AI-friendly structure
        logger.info('Validating AI-friendly structure...');
        await validateAIFriendlyStructure();
        logger.info('Documentation generation completed successfully!');
    }
    catch (error) {
        logger.error('Error during documentation generation:', error);
        process.exit(1);
    }
}
if (require.main === module) {
    main();
}
export { main };
//# sourceMappingURL=index.js.map