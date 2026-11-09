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
  
  const depts = new Set(data.map(d => d.department));
  console.log('Unique departments currently in DB:', Array.from(depts));
  
  // Also count them
  for (const dept of depts) {
      console.log(`${dept}: ${data.filter(d => d.department === dept).length}`);
  }
}

main();
