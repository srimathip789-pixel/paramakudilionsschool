const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://luvwkuccmwidgcpfklop.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1dndrdWNjbXdpZGdjcGZrbG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTI1OTYsImV4cCI6MjA5ODU2ODU5Nn0.HuwTWwGfv_S37PVRwRnQ1HSSeI_favZHH-Yf7RFRuX8'
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
