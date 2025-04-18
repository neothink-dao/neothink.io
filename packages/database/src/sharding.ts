/**
 * Database Sharding Utilities for Supabase
 * 
 * This module provides utilities for implementing application-level sharding
 * to improve scalability of your Supabase database as data volume grows.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Configuration for database sharding
 */
export type ShardingConfig = {
  /**
   * Number of logical shards to divide data into
   * Using a power of 2 (e.g., 2, 4, 8, 16, 32, 64, 128, 256) is recommended
   */
  shardCount: number
  
  /**
   * Connection details for each physical database instance
   * Maps database name to connection details
   */
  dbConnections: Record<string, {
    url: string
    key: string
    /**
     * Shard IDs assigned to this database instance
     * e.g., [0, 1, 2, 3] for the first 4 shards
     */
    shardIds: number[]
  }>
}

/**
 * Determines which shard a record belongs to based on its ID
 * Uses consistent hashing to ensure data locality
 */
export function getShardId(recordId: string, shardCount: number): number {
  // Use the first 8 characters of the UUID to determine shard
  // This assumes recordId is a UUID
  const hashStr = recordId.replace(/-/g, '').substring(0, 8)
  const hashNum = parseInt(hashStr, 16)
  
  // Mod by shard count to get shard ID
  return hashNum % shardCount
}

/**
 * Returns the database connection for a specific record
 */
export function getConnectionForRecord(
  recordId: string, 
  config: ShardingConfig
): SupabaseClient | null {
  const shardId = getShardId(recordId, config.shardCount)
  
  // Find which database instance contains this shard
  for (const [dbName, dbConfig] of Object.entries(config.dbConnections)) {
    if (dbConfig.shardIds.includes(shardId)) {
      return createClient(dbConfig.url, dbConfig.key)
    }
  }
  
  return null
}

/**
 * Distributed query that retrieves data from all shards
 * Use for queries that need to span all shard databases
 */
export async function queryAllShards<T>(
  config: ShardingConfig,
  queryFn: (client: SupabaseClient) => Promise<{ data: T[] | null, error: any }>
): Promise<T[]> {
  const results: T[] = []
  const errors: any[] = []
  
  // Create promises for all database instances
  const queries = Object.entries(config.dbConnections).map(async ([dbName, dbConfig]) => {
    try {
      const client = createClient(dbConfig.url, dbConfig.key)
      const { data, error } = await queryFn(client)
      
      if (error) {
        errors.push({ db: dbName, error })
        return
      }
      
      if (data) {
        results.push(...data)
      }
    } catch (err) {
      errors.push({ db: dbName, error: err })
    }
  })
  
  // Wait for all queries to complete
  await Promise.all(queries)
  
  // Log errors for monitoring
  if (errors.length > 0) {
    console.error('Errors occurred during cross-shard query:', errors)
  }
  
  return results
}

/**
 * Example usage:
 * 
 * ```ts
 * // Configuration for a setup with 8 logical shards across 2 physical databases
 * const shardingConfig: ShardingConfig = {
 *   shardCount: 8,
 *   dbConnections: {
 *     'neothink-primary': {
 *       url: process.env.SUPABASE_URL!,
 *       key: process.env.SUPABASE_KEY!,
 *       shardIds: [0, 1, 2, 3] // First 4 shards on primary DB
 *     },
 *     'neothink-secondary': {
 *       url: process.env.SUPABASE_SECONDARY_URL!,
 *       key: process.env.SUPABASE_SECONDARY_KEY!,
 *       shardIds: [4, 5, 6, 7] // Last 4 shards on secondary DB
 *     }
 *   }
 * }
 * 
 * // Writing to the correct shard based on record ID
 * async function createFeedback(feedback: { id: string, content: string, user_id: string }) {
 *   const client = getConnectionForRecord(feedback.id, shardingConfig)
 *   if (!client) {
 *     throw new Error(`Could not determine database for feedback ID: ${feedback.id}`)
 *   }
 *   
 *   return client
 *     .from('feedback')
 *     .insert(feedback)
 * }
 * 
 * // Reading from a specific shard based on record ID
 * async function getFeedback(feedbackId: string) {
 *   const client = getConnectionForRecord(feedbackId, shardingConfig)
 *   if (!client) {
 *     throw new Error(`Could not determine database for feedback ID: ${feedbackId}`)
 *   }
 *   
 *   return client
 *     .from('feedback')
 *     .select('*')
 *     .eq('id', feedbackId)
 *     .single()
 * }
 * 
 * // Querying across all shards for analytics
 * async function getAllFeedbackForApp(appName: string) {
 *   return queryAllShards(shardingConfig, (client) => {
 *     return client
 *       .from('feedback')
 *       .select('*')
 *       .eq('app_name', appName)
 *   })
 * }
 * ```
 * 
 * Implementation Notes:
 * 1. This approach doesn't replace database-level sharding but provides application-level 
 *    sharding when your Supabase instance approaches scale limits.
 * 2. Consider using multiple Supabase projects/regions for different apps in your monorepo.
 * 3. UUID IDs work well with this sharding approach for even distribution.
 * 4. Remember to update indexes and RLS policies in all database instances.
 */ 