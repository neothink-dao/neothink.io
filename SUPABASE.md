# Supabase Configuration Guide

## Important Security Rules

1. **NEVER commit API keys to version control**
   - Use environment variables in Vercel for sensitive data
   - Use `@` references in vercel.json (e.g., `@supabase_anon_key`)

2. **Environment Variables Setup**
   - Set these in each Vercel project's settings:
     - `NEXT_PUBLIC_SUPABASE_URL`: The project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anon/public key
     - `SUPABASE_SERVICE_ROLE_KEY`: The service role key

3. **Correct URL Format**
   - Project URL: `https://dlmpxgzxdtqxyzsmpaxx.supabase.co`
   - Always verify the project ID matches: `dlmpxgzxdtqxyzsmpaxx`

## Setup Steps for New Deployments

1. Go to Vercel project settings
2. Add the following environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://dlmpxgzxdtqxyzsmpaxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[Get from Supabase Dashboard]
   SUPABASE_SERVICE_ROLE_KEY=[Get from Supabase Dashboard]
   ```

3. In vercel.json, always use environment variable references:
   ```json
   {
     "env": {
       "NEXT_PUBLIC_SUPABASE_URL": "https://dlmpxgzxdtqxyzsmpaxx.supabase.co",
       "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
       "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key"
     }
   }
   ```

## Security Checklist

- [ ] API keys are stored as Vercel environment variables
- [ ] No API keys in version control
- [ ] Correct Supabase project URL
- [ ] Environment variables properly referenced in vercel.json
- [ ] Service role key is secured and not exposed to the client

## Troubleshooting

If you encounter authentication issues:
1. Verify the project URL is correct
2. Check that environment variables are properly set in Vercel
3. Ensure the API keys are valid and not expired
4. Confirm the keys have the correct permissions

## Important Notes

- The service role key has admin privileges - keep it secure
- The anon key is public but should still be managed via environment variables
- Regular key rotation is recommended for security
- Monitor API usage through the Supabase dashboard 