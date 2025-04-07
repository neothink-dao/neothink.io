export type PlatformSlug = 'hub' | 'ascenders' | 'neothinkers' | 'immortals'

export interface PlatformConfig {
  name: string
  slug: PlatformSlug
  tenantId: string
  domain: string
}

export const platforms: Record<PlatformSlug, PlatformConfig> = {
  hub: {
    name: 'Hub',
    slug: 'hub',
    tenantId: '2074cd50-6cf1-467d-b520-e5c6fc7a89f2',
    domain: 'go.neothink.io'
  },
  ascenders: {
    name: 'Ascenders',
    slug: 'ascenders',
    tenantId: 'ce2cb142-075f-40cc-ad55-652ec6ea954d',
    domain: 'joinascenders.org'
  },
  neothinkers: {
    name: 'Neothinkers',
    slug: 'neothinkers',
    tenantId: 'd2a1fb8c-0fd1-45d0-a7cf-ae3caeb3e01d',
    domain: 'joinneothinkers.org'
  },
  immortals: {
    name: 'Immortals',
    slug: 'immortals',
    tenantId: '013bbaf8-8d72-495c-9024-71fb945b0277',
    domain: 'joinimmortals.org'
  }
} 