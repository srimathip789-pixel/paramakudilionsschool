// Run with: node --env-file=.env.local tools/check_principal.js
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

  // Find the principal
  const principals = data.filter(d => d.subject && d.subject.toLowerCase().includes('principal'));
  console.log('Principals:', principals.map(p => ({id: p.id, name: p.name, subject: p.subject, department: p.department})));

}

main();
