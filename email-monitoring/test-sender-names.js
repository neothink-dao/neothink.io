const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sites = [
  {
    name: 'go.neothink.io',
    url: 'https://go.neothink.io',
    senderName: 'Neothink+',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    senderEmail: 'team@auth.neothink.io'
  }
];

async function testSenderNames() {
  const results = [];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  for (const site of sites) {
    try {
      console.log(`Testing ${site.name}...`);
      
      const supabase = createClient(site.supabaseUrl, site.supabaseKey, {
        global: {
          headers: {
            'x-site-name': site.name,
            'x-site-url': site.url,
            'x-site-platform': site.name,
            'x-sender-name': site.senderName,
            'x-sender-email': site.senderEmail
          }
        }
      });

      // Trigger a reset password email
      const { error } = await supabase.auth.resetPasswordForEmail('josh@neothink.io', {
        redirectTo: `${site.url}/auth/callback`,
        data: {
          site_name: site.senderName,
          site_url: site.url,
          platform: site.name,
          sender_name: site.senderName,
          sender_email: site.senderEmail
        }
      });

      if (error) {
        console.log(`Error for ${site.name}:`, error.message);
        results.push({
          site: site.name,
          status: 'error',
          error: error.message,
          timestamp
        });
      } else {
        console.log(`Success for ${site.name}`);
        results.push({
          site: site.name,
          status: 'success',
          expectedSenderName: site.senderName,
          expectedSenderEmail: site.senderEmail,
          timestamp
        });
      }
    } catch (error) {
      console.log(`Error for ${site.name}:`, error.message);
      results.push({
        site: site.name,
        status: 'error',
        error: error.message,
        timestamp
      });
    }
  }

  // Save results to a file
  const resultsPath = path.join(__dirname, 'sender-name-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  
  console.log('\nTest results saved to:', resultsPath);
  console.log('Results:', JSON.stringify(results, null, 2));
}

testSenderNames(); 