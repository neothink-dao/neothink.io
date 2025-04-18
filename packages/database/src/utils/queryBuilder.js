/**
 * NOTE: To avoid deep type instantiation errors with large Supabase schemas,
 * these helpers use SupabaseClient<any> and string for table names.
 * Consumers should cast results as needed for type safety at the app layer.
 */
/**
 * Builds a Supabase query with pagination, filtering and sorting
 * @param client The Supabase client
 * @param table Database table name
 * @param params Query parameters for pagination, filtering and sorting
 * @returns A configured query builder
 */
export function buildQuery(client, table, params) {
    let query = client.from(table).select('*');
    // Apply filters if provided
    if ((params === null || params === void 0 ? void 0 : params.filter) && Object.keys(params.filter).length > 0) {
        Object.entries(params.filter).forEach(([key, value]) => {
            // Handle special operators in keys (e.g., "field.gt" or "field.like")
            if (key.includes('.')) {
                const [field, operator] = key.split('.');
                switch (operator) {
                    case 'eq':
                        query = query.eq(field, value);
                        break;
                    case 'neq':
                        query = query.neq(field, value);
                        break;
                    case 'gt':
                        query = query.gt(field, value);
                        break;
                    case 'gte':
                        query = query.gte(field, value);
                        break;
                    case 'lt':
                        query = query.lt(field, value);
                        break;
                    case 'lte':
                        query = query.lte(field, value);
                        break;
                    case 'like':
                        query = query.like(field, `%${value}%`);
                        break;
                    case 'ilike':
                        query = query.ilike(field, `%${value}%`);
                        break;
                    case 'in':
                        if (Array.isArray(value)) {
                            query = query.in(field, value);
                        }
                        break;
                    case 'is':
                        query = query.is(field, value);
                        break;
                    case 'contains':
                        query = query.contains(field, value);
                        break;
                    default:
                        // Ignore unsupported operators
                        break;
                }
            }
            else {
                // Default to equality check for simple filters
                query = query.eq(key, value);
            }
        });
    }
    // Apply sorting if provided
    if (params === null || params === void 0 ? void 0 : params.sortBy) {
        const order = params.sortOrder === 'desc' ? { ascending: false } : { ascending: true };
        query = query.order(params.sortBy, order);
    }
    // Apply pagination if provided
    if ((params === null || params === void 0 ? void 0 : params.page) !== undefined && (params === null || params === void 0 ? void 0 : params.limit) !== undefined) {
        const start = (params.page - 1) * params.limit;
        query = query.range(start, start + params.limit - 1);
    }
    else if ((params === null || params === void 0 ? void 0 : params.limit) !== undefined) {
        query = query.limit(params.limit);
    }
    return query;
}
/**
 * Executes a paginated query and formats response with pagination info
 * @param client The Supabase client
 * @param table Database table name
 * @param params Query parameters for pagination, filtering and sorting
 * @returns Paginated response with data and pagination metadata
 */
export async function executePagedQuery(client, table, params = {}) {
    // Default pagination values
    const page = params.page || 1;
    const limit = params.limit || 20;
    // Build the query with pagination
    const paginatedQuery = buildQuery(client, table, Object.assign(Object.assign({}, params), { page,
        limit }));
    const { data, count, error } = await paginatedQuery;
    if (error)
        throw error;
    const totalCount = count !== null && count !== void 0 ? count : 0;
    const hasMore = totalCount > page * limit;
    return {
        data: data || [],
        total: totalCount,
        page,
        limit,
        hasMore,
    };
}
/**
 * Creates a properly structured filter for array containment
 * @param field The array field to search in
 * @param value The value to search for
 * @returns Properly structured filter object
 */
export function arrayContains(field, value) {
    if (Array.isArray(value)) {
        // To search for multiple values in an array field
        return { [`${field}.contains`]: value };
    }
    return { [`${field}.contains`]: [value] };
}
/**
 * Creates a properly structured filter for case-insensitive text search
 * @param field The text field to search in
 * @param searchTerm The search term
 * @returns Properly structured filter object
 */
export function textSearch(field, searchTerm) {
    return { [`${field}.ilike`]: `%${searchTerm}%` };
}
/**
 * Creates a properly structured filter for range queries
 * @param field The field to apply range filter to
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Properly structured filter object
 */
export function rangeFilter(field, min, max) {
    const filter = {};
    if (min !== undefined) {
        filter[`${field}.gte`] = min;
    }
    if (max !== undefined) {
        filter[`${field}.lte`] = max;
    }
    return filter;
}
/**
 * Creates a properly structured filter for date range queries
 * @param field The date field to filter
 * @param startDate Start date (inclusive)
 * @param endDate End date (inclusive)
 * @returns Properly structured filter object
 */
export function dateRangeFilter(field, startDate, endDate) {
    return rangeFilter(field, startDate, endDate);
}
//# sourceMappingURL=queryBuilder.js.map