import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue ? 
      `${question} [${defaultValue}]: ` : 
      `${question}: `;
    
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function main() {
  console.log('StreetFix Environment Setup');
  console.log('==========================');
  
  // Read existing .env.local if it exists
  const envPath = '.env.local';
  let envVars = {};
  
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const [key, ...value] = line.split('=');
      if (key && value.length > 0) {
        envVars[key.trim()] = value.join('=').trim().replace(/^['"]|['"]$/g, '');
      }
    });
    console.log('Found existing .env.local file');
  }
  
  // Get Supabase URL
  const supabaseUrl = await askQuestion(
    'Enter your Supabase Project URL',
    envVars.NEXT_PUBLIC_SUPABASE_URL || ''
  );
  
  // Get Supabase Anon Key
  const supabaseAnonKey = await askQuestion(
    'Enter your Supabase Anon (public) Key',
    envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  // Generate .env.local content
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}

# Add any other environment variables below this line
`;
  
  // Write to .env.local
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment variables saved to .env.local');
    console.log('\nNext steps:');
    console.log('1. Start the development server:');
    console.log('   npm run dev');
  } catch (error) {
    console.error('\n❌ Error writing to .env.local. Please create the file manually with these contents:');
    console.log('\n' + envContent);
  }
  
  rl.close();
}

main().catch(console.error);
