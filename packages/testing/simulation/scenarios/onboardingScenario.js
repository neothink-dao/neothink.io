import * as queries from '../queries';
function pickTokenForPersona(persona, site) {
    // Persona + site-specific logic (can be expanded)
    if (site === 'hub')
        return persona === 'ascender' ? 'LUCK' : 'LIVE';
    if (site === 'ascenders')
        return persona === 'immortal' ? 'LIFE' : 'LUCK';
    if (site === 'neothinkers')
        return persona === 'neothinker' ? 'LOVE' : 'LIVE';
    if (site === 'immortals')
        return persona === 'immortal' ? 'LIFE' : 'LUCK';
    return 'LUCK';
}
export const onboardingScenario = {
    name: 'Onboarding & Progression',
    description: 'Simulates onboarding and progression for all personas and sites/apps, using site_settings for rewards',
    personas: ['ascender', 'neothinker', 'immortal', 'hub'],
    phases: ['discovery', 'onboarding', 'progression', 'mastery'],
    async run(users, context) {
        const { dbClient, simulationRunId } = context;
        const events = [];
        // Fetch site settings for all sites in this run
        const sites = Array.from(new Set(users.map(u => u.site)));
        const siteSettings = {};
        for (const site of sites) {
            const settings = await queries.getSiteSettings(dbClient, site);
            siteSettings[site] = settings.data || {};
        }
        for (const user of users) {
            const site = user.site;
            const persona = user.persona;
            const settings = siteSettings[site] || {};
            for (const phase of this.phases) {
                // Dynamic rewards from site_settings
                const baseReward = settings.base_reward || 100;
                const collabBonus = settings.collab_bonus || 25;
                const streakBonus = settings.streak_bonus || 50;
                const diminishingThreshold = settings.diminishing_threshold || 1000;
                // Persona/context-aware token
                const tokenType = pickTokenForPersona(persona, site);
                // Earn event
                await queries.insertGamificationEvent(dbClient, user.id, persona, site, `${phase}_reward`, tokenType, user.tokenBalance && user.tokenBalance[tokenType] > diminishingThreshold ? baseReward / 2 : baseReward, { phase }, simulationRunId);
                events.push({
                    userId: user.id,
                    persona,
                    phase,
                    site,
                    eventType: `${phase}_reward`,
                    tokenType,
                    amount: user.tokenBalance && user.tokenBalance[tokenType] > diminishingThreshold ? baseReward / 2 : baseReward,
                    timestamp: new Date().toISOString(),
                    simulationRunId,
                });
                // Collaboration event (higher frequency for testing)
                if (Math.random() > 0.3) {
                    await queries.insertGamificationEvent(dbClient, user.id, persona, site, 'collaboration', 'LOVE', collabBonus, { phase }, simulationRunId);
                    events.push({
                        userId: user.id,
                        persona,
                        phase,
                        site,
                        eventType: 'collaboration',
                        tokenType: 'LOVE',
                        amount: collabBonus,
                        timestamp: new Date().toISOString(),
                        simulationRunId,
                    });
                }
                // Simulate token sink (spend)
                if (Math.random() > 0.7) {
                    await queries.insertTokenSink(dbClient, site, 'feature_unlock', tokenType, 'Unlock feature', simulationRunId);
                    events.push({
                        userId: user.id,
                        persona,
                        phase,
                        site,
                        eventType: 'spend',
                        tokenType,
                        amount: 10,
                        timestamp: new Date().toISOString(),
                        simulationRunId,
                    });
                }
                // Simulate token conversion
                if (Math.random() > 0.8) {
                    await queries.insertTokenConversion(dbClient, user.id, tokenType, 'LUCK', 5, 1, site, simulationRunId);
                    events.push({
                        userId: user.id,
                        persona,
                        phase,
                        site,
                        eventType: 'convert',
                        tokenType,
                        amount: 5,
                        timestamp: new Date().toISOString(),
                        simulationRunId,
                    });
                }
                // Streak/milestone bonus
                if (phase === 'mastery' && Math.random() > 0.5) {
                    await queries.insertGamificationEvent(dbClient, user.id, persona, site, 'streak_bonus', 'LIFE', streakBonus, { phase }, simulationRunId);
                    events.push({
                        userId: user.id,
                        persona,
                        phase,
                        site,
                        eventType: 'streak_bonus',
                        tokenType: 'LIFE',
                        amount: streakBonus,
                        timestamp: new Date().toISOString(),
                        simulationRunId,
                    });
                }
            }
        }
        // Aggregate metrics (stub, could be expanded)
        const metrics = {
            retention: 0.95,
            engagement: 5,
            avgTimeSpent: 30,
            satisfaction: 9,
            rewardBalance: { LIVE: 1000, LOVE: 800, LIFE: 900, LUCK: 1100 },
            repetitiveTaskScore: 0.2,
            collaborationScore: 0.7,
        };
        return { events, metrics };
    },
};
//# sourceMappingURL=onboardingScenario.js.map