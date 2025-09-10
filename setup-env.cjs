const fs = require('fs');
const readline = require('readline');

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
  console.log('You need to provide your Supabase project credentials.');
  console.log('You can find these in your Supabase project settings > API');
  
  const supabaseUrl = await askQuestion('Enter your Supabase Project URL');
  const supabaseAnonKey = await askQuestion('Enter your Supabase Anon (public) Key');
  
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}

# Add any other environment variables below this line
`;
  
  // Try to write to .env.local
  try {
    fs.writeFileSync('.env.local', envContent);
    console.log('\n✅ Environment variables saved to .env.local');
    console.log('\nNext steps:');
    console.log('1. Run the storage initialization script:');
    console.log('   npx tsx scripts/init-storage.ts');
    console.log('2. Start the development server:');
    console.log('   npm run dev');
  } catch (error) {
    console.error('\n❌ Error writing to .env.local. Please create the file manually with these contents:');
    console.log('\n' + envContent);
  }
  
  rl.close();
}

main().catch(console.error);
