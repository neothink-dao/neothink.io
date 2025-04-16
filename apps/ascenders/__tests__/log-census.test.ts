import { createMocks } from 'node-mocks-http';
import handler from '../app/api/gamification/log-census/route';

describe('POST /api/gamification/log-census', () => {
  it('should reject missing required fields', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { scope: '', population: null, activity_count: null },
    });
    await handler.POST(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('should reject unauthenticated requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        scope: 'test',
        population: 100,
        activity_count: 10,
        assets: 5,
        metadata: {},
      },
    });
    // Simulate missing user
    jest.spyOn(require('@neothink/hooks/api'), 'getUser').mockReturnValueOnce({ user: null, error: 'Unauthorized' });
    await handler.POST(req, res);
    expect(res._getStatusCode()).toBe(401);
  });

  it('should accept valid census event', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        scope: 'test',
        population: 100,
        activity_count: 10,
        assets: 5,
        metadata: {},
      },
    });
    jest.spyOn(require('@neothink/hooks/api'), 'getUser').mockReturnValueOnce({ user: { id: 'user123' }, error: null });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, censusSnapshot: { id: 'snapshot1' } }),
      })
    ) as jest.Mock;
    await handler.POST(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toContain('success');
  });
});
