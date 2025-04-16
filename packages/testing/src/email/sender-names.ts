import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

interface SiteConfig {
  name: string;
  url: string;
  senderName: string;
  supabaseUrl: string;
  supabaseKey: string;
}

interface TestResult {
  site: string;
  status: 'success' | 'error';
  error?: string;
  expectedSenderName?: string;
  timestamp: string;
}

const sites: SiteConfig[] = [
  {
    name: 'go.neothink.io',
    url: 'https://go.neothink.io',
    senderName: 'Neothink+',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  },
  {
    name: 'joinascenders',
    url: 'https://www.joinascenders.org',
    senderName: 'Ascenders',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  },
  {
    name: 'joinimmortals',
    url: 'https://www.joinimmortals.org',
    senderName: 'Immortals',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  },
  {
    name: 'joinneothinkers',
    url: 'https://www.joinneothinkers.org',
    senderName: 'Neothinkers',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  }
];

export async function testSenderNames() {
  const results: TestResult[] = [];
  const timestamp = new Date().toISOString();
  
  for (const site of sites) {
    try {
      const supabase = createClient(site.supabaseUrl, site.supabaseKey, {
        global: {
          headers: {
            'x-site-name': site.name,
            'x-site-url': site.url,
            'x-site-platform': site.name,
            'x-sender-name': site.senderName
          }
        }
      });

      // Trigger a signup email
      const { error } = await supabase.auth.signUp({
        email: `test+${timestamp}@example.com`,
        password: 'test-password',
        options: {
          emailRedirectTo: `${site.url}/auth/callback`
        }
      });

      if (error) {
        results.push({
          site: site.name,
          status: 'error',
          error: error.message,
          timestamp
        });
      } else {
        results.push({
          site: site.name,
          status: 'success',
          expectedSenderName: site.senderName,
          timestamp
        });
      }
    } catch (error) {
      results.push({
        site: site.name,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      });
    }
  }

  // Save results to a file
  const resultsPath = path.join(__dirname, 'sender-name-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  
  console.log('Test results saved to:', resultsPath);
  console.log('Results:', results);
  
  return results;
} 