import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const sites = [
  'joinascenders',
  'joinimmortals',
  'joinneothinkers',
  'go.neothink.io'
]

const newDependencies = {
  "@supabase/ssr": "^0.6.1",
  "@supabase/supabase-js": "^2.49.4"
}

sites.forEach(site => {
  const packageJsonPath = join(process.cwd(), site, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  
  // Update dependencies
  packageJson.dependencies = {
    ...packageJson.dependencies,
    ...newDependencies
  }
  
  // Remove old auth-helpers-nextjs if it exists
  delete packageJson.dependencies['@supabase/auth-helpers-nextjs']
  
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  console.log(`Updated dependencies for ${site}`)
}) 