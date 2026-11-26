// Run with: node --env-file=.env.local tools/check_staff.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  // Use the service-role key only on your own PC — never commit it.
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const { data, error } = await supabase.from('staff').select('*');
  if (error) {
    console.error('Error fetching staff:', error);
    return;
  }
  
  const depts = new Set(data.map(d => d.department));
  console.log('Unique departments currently in DB:', Array.from(depts));
  
  // Also count them
  for (const dept of depts) {
      console.log(`${dept}: ${data.filter(d => d.department === dept).length}`);
  }
}

main();
