# @neothink/database

A robust, type-safe Supabase client and utilities for the Neothink DAO ecosystem.

---

## Overview
This package provides a platform-aware Supabase client, admin utilities, and type-safe helpers for working with the Neothink DAO's data infrastructure.

## Features
- Platform-specific Supabase client creation
- Admin client for server-side operations
- Type-safe database access
- Utility functions for sharding, error handling, and more

## Installation
```sh
pnpm add @neothink/database
```

## Usage
```ts
import { createPlatformClient, supabase, getSupabaseClient } from '@neothink/database';

const client = createPlatformClient('hub');
// ...
```

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` – Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` – (Optional) Service role key for admin operations

## API
- `createPlatformClient(platformSlug, customOptions)` – Create a client for a specific platform
- `getSupabaseClient()` – Get a cached default client
- `createAdminClient()` – Get a server-side admin client
- `supabase` – Default client for the 'hub' platform
- `supabaseAdmin` – Default admin client (server only)

## Testing
This package uses [vitest](https://vitest.dev/) for testing.

```sh
pnpm test
```

## Contributing
This project is governed by the Neothink DAO. Contributions are welcome! Please:
- Open issues or discussions before submitting large changes
- Follow the code of conduct and contribution guidelines in the main repository
- Note: This project is **not** MIT licensed. All rights and governance are reserved by the Neothink DAO.

## License & Governance
This codebase is owned, managed, and governed by the Neothink DAO. Usage, contributions, and redistribution are subject to DAO rules and governance. For more information, see the main DAO documentation or contact the maintainers. 