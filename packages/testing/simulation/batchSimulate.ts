import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { onboardingScenario } from './scenarios/onboardingScenario';
import { PERSONAS, Persona } from './personas';
import { SimUser, SimContext, ScenarioResult } from './scenarioTypes';
import * as queries from './queries';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

// Load all config files from configs directory
const configsDir = path.resolve(__dirname, './batchConfigs');
const resultsDir = path.resolve(__dirname, '../../../results');
if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir);

const configFiles = fs.readdirSync(configsDir).filter(f => f.endsWith('.json'));

// Use scenario map with string index for dynamic lookup
const scenarioMap: Record<string, any> = {
  onboarding: onboardingScenario,
};

async function runBatch() {
  const dbClient = queries.getSupabaseClient(
    SUPABASE_URL as string,
    SUPABASE_SERVICE_ROLE_KEY as string
  );
  const configs = configFiles.map(file => JSON.parse(fs.readFileSync(path.join(configsDir, file), 'utf-8')));
  const simulationRunId = uuidv4();
  const results = await runBatchSimulation(configs, dbClient, simulationRunId);
  // Output results to JSON
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const resultFile = path.join(resultsDir, `batch-${ts}.json`);
  fs.writeFileSync(resultFile, JSON.stringify({ simulationRunId, results }, null, 2));
  // Print summary table
  console.log('\nBatch Simulation Summary:');
  console.table(results);
}

async function runBatchSimulation(configs: any[], dbClient: any, simulationRunId: string) {
  const allResults = [];
  for (const config of configs) {
    const { numUsers, sites, scenario, rewardParams, personaDistribution } = config;
    // Set up site_settings in DB for each site/app
    for (const site of sites) {
      const params = rewardParams?.[site] || {};
      await queries.getSiteSettings(dbClient, site).then((res: any) => {
        if (!res.data) {
          dbClient.from('site_settings').insert([{ site, ...params }]);
        } else {
          dbClient.from('site_settings').update(params).eq('site', site);
        }
      });
    }
    // Generate users for each site/app/persona
    const users = [];
    for (const site of sites) {
      const personas = personaDistribution?.[site] || ['ascender','neothinker','immortal','hub'];
      for (let i = 0; i < Math.floor(numUsers / sites.length); i++) {
        const persona = personas[i % personas.length];
        users.push({
          id: `user_${site}_${i}`,
          site,
          persona,
          tokenBalance: { LIVE: 0, LOVE: 0, LIFE: 0, LUCK: 0 },
        });
      }
    }
    // Run the scenario, pass simulationRunId in context
    const scenarioFn = scenarioMap[scenario];
    const result = await scenarioFn.run(users, { ...config, dbClient, simulationRunId });
    allResults.push({ site: sites, scenario, simulationRunId, result });
  }
  return allResults;
}

runBatch();
