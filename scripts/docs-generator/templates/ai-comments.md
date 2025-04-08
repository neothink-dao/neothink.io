# AI-Friendly Code Comment Templates

## Component Template
```typescript
/**
 * @component ComponentName
 * @description Brief description of the component's purpose
 * 
 * @features - List of features this component is part of
 * @database - Tables and queries used by this component
 * @dependencies - External dependencies and internal components used
 * @related - Related components or features
 * @tests - Location of test files
 * @docs - Links to relevant documentation
 * 
 * @ai-context This section provides additional context for AI analysis
 * - State management approach
 * - Component lifecycle considerations
 * - Performance optimizations
 * - Error handling strategy
 * 
 * @example
 * ```tsx
 * <ComponentName prop1={value1} prop2={value2} />
 * ```
 */
```

## Database Table Template
```sql
/**
 * @table TableName
 * @description Brief description of the table's purpose
 * 
 * @relationships
 * - List of relationships with other tables
 * - Foreign key constraints
 * 
 * @indexes
 * - List of indexes and their purposes
 * 
 * @components
 * - Components that interact with this table
 * 
 * @features
 * - Features that use this table
 * 
 * @migrations
 * - List of related migration files
 * 
 * @ai-context
 * - Data integrity considerations
 * - Performance considerations
 * - Access patterns
 */
```

## Feature Template
```typescript
/**
 * @feature FeatureName
 * @description Brief description of the feature
 * 
 * @components
 * - List of components used in this feature
 * 
 * @database
 * - Tables and queries used
 * - Data flow description
 * 
 * @dependencies
 * - External dependencies
 * - Internal dependencies
 * 
 * @tests
 * - Test file locations
 * - Test coverage requirements
 * 
 * @docs
 * - Links to feature documentation
 * 
 * @ai-context
 * - Feature complexity considerations
 * - Integration points
 * - State management approach
 * - Error handling strategy
 */
```

## Function Template
```typescript
/**
 * @function functionName
 * @description Brief description of the function's purpose
 * 
 * @params
 * - param1: {Type} Description
 * - param2: {Type} Description
 * 
 * @returns {Type} Description of return value
 * 
 * @throws List of possible errors
 * 
 * @dependencies
 * - External dependencies
 * - Internal dependencies
 * 
 * @usage
 * - Where and how this function is used
 * 
 * @ai-context
 * - Performance considerations
 * - Error handling approach
 * - Side effects
 * - Async behavior
 * 
 * @example
 * ```typescript
 * const result = functionName(param1, param2);
 * ```
 */
```

## Type Definition Template
```typescript
/**
 * @type TypeName
 * @description Brief description of the type
 * 
 * @properties
 * - prop1: {Type} Description
 * - prop2: {Type} Description
 * 
 * @usage
 * - Where and how this type is used
 * 
 * @related
 * - Related types or interfaces
 * 
 * @ai-context
 * - Type constraints
 * - Validation requirements
 * - Common patterns
 * 
 * @example
 * ```typescript
 * const instance: TypeName = {
 *   prop1: value1,
 *   prop2: value2
 * };
 * ```
 */
```

## Best Practices for AI-Friendly Comments

1. **Consistency**
   - Use consistent formatting and structure
   - Maintain the same level of detail across similar elements
   - Use standard JSDoc tags where applicable

2. **Context**
   - Always include @ai-context section
   - Explain "why" not just "what"
   - Document relationships and dependencies

3. **Examples**
   - Provide clear, practical examples
   - Include common use cases
   - Show error handling when relevant

4. **Relationships**
   - Document connections to other code
   - Explain integration points
   - List related components/features

5. **Updates**
   - Keep comments in sync with code
   - Document major changes
   - Update examples when APIs change 