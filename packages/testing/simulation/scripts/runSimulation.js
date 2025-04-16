import { onboardingScenario } from '../scenarios/onboardingScenario';
import { PERSONAS } from '../personas';
import * as queries from '../queries';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}
const configPath = process.argv[2] || path.resolve(__dirname, '../simulationConfig.json');
let simConfig = {
    numUsers: 40,
    sites: ['hub', 'ascenders', 'neothinkers', 'immortals'],
    scenario: 'onboarding',
};
if (fs.existsSync(configPath)) {
    try {
        simConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
    catch (e) {
        console.warn('Failed to load config, using defaults:', e);
    }
}
const scenarioMap = { onboarding: onboardingScenario };
const scenario = scenarioMap[simConfig.scenario] || onboardingScenario;
async function main() {
    const users = [];
    const personaKeys = Object.keys(PERSONAS);
    for (let i = 0; i < simConfig.numUsers; i++) {
        const persona = personaKeys[i % personaKeys.length];
        const phaseIdx = Math.floor(i / 10);
        const phase = scenario.phases[phaseIdx] || 'discovery';
        const site = simConfig.sites[i % simConfig.sites.length];
        users.push({
            id: `simuser${i + 1}`,
            persona,
            phase,
            site,
            tokenBalance: { LUCK: 1000 + (i * 10) },
        });
    }
    const dbClient = queries.getSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const context = {
        supabaseUrl: SUPABASE_URL,
        supabaseKey: SUPABASE_SERVICE_ROLE_KEY,
        dbClient,
        now: new Date(),
    };
    const result = await scenario.run(users, context);
    for (const site of simConfig.sites) {
        const siteMetrics = await queries.getSiteMetrics(dbClient, site);
        console.log(`\nSite: ${site} Gamification Events:`);
        console.table(siteMetrics.data);
    }
    console.log('Simulation complete. Metrics:', result.metrics);
    const resultsDir = path.resolve(__dirname, '../../../results');
    if (!fs.existsSync(resultsDir))
        fs.mkdirSync(resultsDir);
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    fs.writeFileSync(path.join(resultsDir, `sim-result-${ts}.json`), JSON.stringify({ config: simConfig, metrics: result.metrics, events: result.events }, null, 2));
    console.log('Results written to', resultsDir);
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=runSimulation.js.map