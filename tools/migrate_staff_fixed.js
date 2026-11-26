// Run with: node --env-file=.env.local tools/migrate_staff_fixed.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  // Use the service-role key only on your own PC — never commit it.
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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
