const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://luvwkuccmwidgcpfklop.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1dndrdWNjbXdpZGdjcGZrbG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTI1OTYsImV4cCI6MjA5ODU2ODU5Nn0.HuwTWwGfv_S37PVRwRnQ1HSSeI_favZHH-Yf7RFRuX8'
);

async function main() {
  const { data: staffList, error } = await supabase.from('staff').select('*');
  if (error) {
    console.error('Error fetching staff:', error);
    return;
  }

  for (const member of staffList) {
    let newDept = member.department;
    
    // Check if it's the principal
    if (member.name === 'Sobana Devi P' || (member.subject && member.subject.toLowerCase() === 'principal')) {
      newDept = 'Principal';
    } else {
      switch (member.department) {
        case 'high_school':
        case 'P.G. Assistant (HSC)':
          newDept = 'P.G ASSISTANT (HS BLOCK)';
          break;
        case 'primary':
        case 'Secondary Grade Teacher':
          newDept = 'MAIN BLOCK TEACHERS';
          break;
        case 'kindergarten':
        case 'Kindergarten Teacher':
          newDept = 'K G BLOCK TEACHERS';
          break;
        case 'sports':
        case 'Physical Education':
          newDept = 'PHY.EDU.TEACHERS';
          break;
        case 'office':
        case 'Office Staff':
          newDept = 'OFFICE STAFF';
          break;
      }
    }

    if (newDept !== member.department) {
      const { error: updateError } = await supabase.from('staff').update({ department: newDept }).eq('id', member.id);
      if (updateError) {
        console.error(`Failed to update ${member.name}:`, updateError.message);
      } else {
        console.log(`Updated ${member.name}: ${member.department} -> ${newDept}`);
      }
    }
  }

  console.log('Finished updating DB roles.');
}

main();
