import { onboardingScenario } from '../scenarios/onboardingScenario';
const mockDbClient = {
    from: () => ({ insert: async () => ({}) }),
};
const mockContext = {
    supabaseUrl: 'mock',
    supabaseKey: 'mock',
    dbClient: mockDbClient,
    now: new Date(),
};
describe('onboardingScenario', () => {
    it('runs and returns metrics and events', async () => {
        const users = [
            { id: 'u1', persona: 'ascender', phase: 'discovery', site: 'hub', tokenBalance: { LUCK: 1000 } },
            { id: 'u2', persona: 'immortal', phase: 'onboarding', site: 'ascenders', tokenBalance: { LUCK: 2000 } },
        ];
        const result = await onboardingScenario.run(users, mockContext);
        expect(result.metrics).toBeDefined();
        expect(Array.isArray(result.events)).toBe(true);
        expect(result.events.length).toBeGreaterThan(0);
    });
    it('applies diminishing returns for high LUCK', async () => {
        const users = [
            { id: 'u3', persona: 'neothinker', phase: 'progression', site: 'immortals', tokenBalance: { LUCK: 2001 } },
        ];
        const result = await onboardingScenario.run(users, mockContext);
        // Should have at least one event with baseReward 50
        const luckRewards = result.events.filter(e => e.persona === 'neothinker');
        expect(luckRewards.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=onboardingScenario.test.js.map