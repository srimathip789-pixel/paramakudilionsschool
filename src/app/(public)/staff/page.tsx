'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, BookOpen, GraduationCap, Trophy, Briefcase } from 'lucide-react';

interface StaffMember {
  id?: string;
  name: string;
  department: string;
  subject?: string;
  qualification: string;
  experience?: string;
  photo_url?: string;
  display_order?: number;
}

const defaultStaff: StaffMember[] = [
  // Principal
  { name: 'SOBANA DEVI P', department: 'Principal', qualification: 'M.A., M.A., B.Ed., DCA.', subject: 'General Administration' },
  
  // P.G. Assistants
  { name: 'Mrs. Indhu Rani N', department: 'P.G. Assistant (HSC)', qualification: 'M.Sc., M.Ed.', subject: 'Physics' },
  { name: 'Mrs. Manimekala. N', department: 'P.G. Assistant (HSC)', qualification: 'M.Sc., B.Ed., M.Phil.', subject: 'Chemistry' },
  { name: 'Mrs. Dhana Lakshmi R', department: 'P.G. Assistant (HSC)', qualification: 'M.A., M.Phil., B.Ed.', subject: 'English' },
  { name: 'Mrs. Ramjan Begam. S', department: 'P.G. Assistant (HSC)', qualification: 'M.Sc., B.Ed.', subject: 'Mathematics' },
  { name: 'Mr. Poochethu Pandiyan. P', department: 'P.G. Assistant (HSC)', qualification: 'M.A., B.Ed., M.Phil.', subject: 'Tamil' },
  { name: 'Mr. Shanmuga Velu. J', department: 'P.G. Assistant (HSC)', qualification: 'M.Sc., B.Ed.', subject: 'Computer Science' },
  { name: 'Mr. Paul Raj. R', department: 'P.G. Assistant (HSC)', qualification: 'M.Sc., B.Ed.', subject: 'Biology' },
  { name: 'Mr. Ram Kumar. G', department: 'P.G. Assistant (HSC)', qualification: 'M.Sc., B.Ed.', subject: 'Mathematics' },
  { name: 'Mrs. Tamil Selvi S A', department: 'P.G. Assistant (HSC)', qualification: 'M.A., B.Ed.', subject: 'Social Science' },
  { name: 'Mr. Muraleeswaran K', department: 'P.G. Assistant (HSC)', qualification: 'M.A., B.Ed.', subject: 'History' },
  { name: 'Mr. Venkatesh S', department: 'P.G. Assistant (HSC)', qualification: 'M.Sc., B.Ed.', subject: 'Science' },
  { name: 'Mr. Jesuraj A', department: 'P.G. Assistant (HSC)', qualification: 'M.Sc., B.Ed.', subject: 'Commerce' },
  { name: 'Ms. Sivaranjani V', department: 'P.G. Assistant (HSC)', qualification: 'MCA.', subject: 'Computer Science' },
  { name: 'Mr. Panchu K', department: 'P.G. Assistant (HSC)', qualification: 'M.A., B.Ed.', subject: 'Tamil' },
  { name: 'Mr. Mahendran S', department: 'P.G. Assistant (HSC)', qualification: 'M.Com., B.Ed.', subject: 'Accountancy' },

  // Secondary Grade Teachers
  { name: 'Mrs. Geetha. N', department: 'Secondary Grade Teacher', qualification: 'M.Sc., B.Ed.' },
  { name: 'Mrs. Gomathi Jeyam S', department: 'Secondary Grade Teacher', qualification: 'M.A., B.Ed.' },
  { name: 'Mrs. Anitha Arockiyam M', department: 'Secondary Grade Teacher', qualification: 'B.A.' },
  { name: 'Mrs. Nagavani S', department: 'Secondary Grade Teacher', qualification: 'B.Sc., B.Ed.' },
  { name: 'Mr. Sasikumar S', department: 'Secondary Grade Teacher', qualification: 'M.A., M.Ed.' },
  { name: 'Mrs. Rubika B', department: 'Secondary Grade Teacher', qualification: 'M.A., D.T.Ed., B.Ed.' },
  { name: 'Mrs. Hemalatha I', department: 'Secondary Grade Teacher', qualification: 'M.Sc., B.Ed.' },
  { name: 'Mr. Saravanakumar K', department: 'Secondary Grade Teacher', qualification: 'M.A., B.Ed.' },
  { name: 'Mr. Muthumari S', department: 'Secondary Grade Teacher', qualification: 'M.A., B.Ed.' },
  { name: 'Mrs. Regadevi M', department: 'Secondary Grade Teacher', qualification: 'B.Sc., B.Ed.' },
  { name: 'Mrs. Karthika S', department: 'Secondary Grade Teacher', qualification: 'B.Sc., B.Ed.' },
  { name: 'Mrs. Amutha S', department: 'Secondary Grade Teacher', qualification: 'B.A., B.Ed.' },
  { name: 'Mrs. Sebastin Dhivya A', department: 'Secondary Grade Teacher', qualification: 'M.Sc., B.Ed.' },
  { name: 'Mrs. Indumathi G', department: 'Secondary Grade Teacher', qualification: 'M.A., B.Ed.' },
  { name: 'Mrs. Eswari. M', department: 'Secondary Grade Teacher', qualification: 'M.A., B.Ed.' },

  // Kinder Garten
  { name: 'Mrs. Theivanai M', department: 'Kindergarten Teacher', qualification: 'B.Com., D.T.Ed.' },
  { name: 'Mrs. Sangeetha S', department: 'Kindergarten Teacher', qualification: 'B.A., D.T.Ed., B.Ed.' },
  { name: 'Mrs. Usha P', department: 'Kindergarten Teacher', qualification: 'D.T.Ed., B.A., B.Ed.' },
  { name: 'Mrs. Munia Jothi. R.M.', department: 'Kindergarten Teacher', qualification: 'M.A., B.Ed.' },
  { name: 'Mrs. Renuga Devi C', department: 'Kindergarten Teacher', qualification: 'M.A., D.T.Ed., B.Ed.' },
  { name: 'Mrs. Thilagavathi K', department: 'Kindergarten Teacher', qualification: 'M.A., B.Ed.' },
  { name: 'Mrs. Pushpa Devi P', department: 'Kindergarten Teacher', qualification: 'M.Sc., B.Ed.' },
  { name: 'Mrs. Rathikka R', department: 'Kindergarten Teacher', qualification: 'B.Sc., B.Ed.' },
  { name: 'Mrs. Umamaheswari G', department: 'Kindergarten Teacher', qualification: 'M.A., B.Ed.' },
  { name: 'Mrs. Muneeswari G', department: 'Kindergarten Teacher', qualification: 'M.A., B.Ed., D.T.Ed.' },
  { name: 'Mrs. Maria Gracy', department: 'Kindergarten Teacher', qualification: 'D.T.Ed., B.A., B.Ed.' },
  { name: 'Mrs. Seetha P', department: 'Kindergarten Teacher', qualification: 'M.Sc., B.Ed.' },
  { name: 'Ms. Abinaya B', department: 'Kindergarten Teacher', qualification: 'M.A., B.Ed.' },
  { name: 'Mrs. Mohana Eswari S', department: 'Kindergarten Teacher', qualification: 'PRAVEEN (HINDI)' },
  { name: 'Mrs. Saranya M', department: 'Kindergarten Teacher', qualification: 'M.Sc., B.Ed., D.T.Ed., PCP' },
  { name: 'Ms. Sathiya Kala R', department: 'Kindergarten Teacher', qualification: 'M.Sc., B.Ed.' },
  { name: 'Mrs. Sharmila Devi K', department: 'Kindergarten Teacher', qualification: 'B.Sc., B.Ed.' },

  // PE Teachers
  { name: 'Mr. Saravana Kumar. D', department: 'Physical Education', qualification: 'M.Com., B.P.Ed.' },
  { name: 'Mrs. Valarmathi. K', department: 'Physical Education', qualification: 'B.A., M.P.Ed., M.Phil.' },
  { name: 'Mr. Sanjay Durai J', department: 'Physical Education', qualification: 'B.Sc., ISM' },

  // Office Staff
  { name: 'Mr. Kannan K', department: 'Office Staff', qualification: 'B.Com.', subject: 'Manager' },
  { name: 'Mr. Kannan K S', department: 'Office Staff', qualification: 'B.Com.' }
];

export default function StaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadStaff() {
      if (typeof supabase.from !== 'function') {
        setStaffList(defaultStaff);
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .order('display_order', { ascending: true })
          .order('name', { ascending: true });
        
        if (data && data.length > 0 && !error) {
          const mappedData = data.map((item: StaffMember) => {
            let newDept = item.department;
            if (item.name === 'Sobana Devi P' || (item.subject && item.subject.toLowerCase() === 'principal')) {
              newDept = 'Principal';
            } else {
              switch (item.department) {
                case 'high_school':
                case 'P.G. Assistant (HSC)': newDept = 'P.G Assistant (HS Block)'; break;
                case 'primary':
                case 'Secondary Grade Teacher': newDept = 'Main Block Teachers'; break;
                case 'kindergarten':
                case 'Kindergarten Teacher': newDept = 'K G Block Teachers'; break;
                case 'sports':
                case 'Physical Education': newDept = 'Phy.Edu.Teachers'; break;
                case 'office':
                case 'Office Staff': newDept = 'Office Staff'; break;
              }
            }
            return { ...item, department: newDept };
          });
          setStaffList(mappedData);
        } else {
          setStaffList(defaultStaff);
        }
      } catch (err) {
        console.error(err);
        setStaffList(defaultStaff);
      } finally {
        setLoading(false);
      }
    }
    loadStaff();
  }, []);

  const departments = [
    { key: 'Principal', label: 'Principal', icon: GraduationCap },
    { key: 'P.G Assistant (HS Block)', label: 'P.G Assistant (HS Block)', icon: BookOpen },
    { key: 'Main Block Teachers', label: 'Main Block Teachers', icon: Users },
    { key: 'K G Block Teachers', label: 'K G Block Teachers', icon: Users },
    { key: 'Phy.Edu.Teachers', label: 'Phy.Edu.Teachers', icon: Trophy },
    { key: 'Office Staff', label: 'Office Staff', icon: Briefcase }
  ];

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Banner */}
      <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-16 px-4 md:px-8 text-center">
        <div className="absolute inset-0 bg-black/35 z-0"></div>
        <div className="max-w-4xl mx-auto z-10 relative flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-accent-500/30">
            Dedicated Mentors
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight">
            Our Staff Details
          </h2>
          <p className="text-slate-200 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
            Meet the experienced educators, administrators, and coordinators driving academic excellence at our school.
          </p>
        </div>
      </section>

      {/* Main Directory */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full flex flex-col gap-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-500 font-bold">Loading Faculty Directory...</span>
          </div>
        ) : (
          departments.map((dept) => {
            const members = staffList.filter(m => m.department === dept.key);
            if (members.length === 0) return null;

            const Icon = dept.icon;

            return (
              <div key={dept.key} className="flex flex-col gap-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-heading text-lg md:text-xl font-extrabold text-primary-900">
                    {dept.label} ({members.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((member, idx) => (
                    <div 
                      key={member.id || idx} 
                      className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-primary-600/30 transition-all flex items-center gap-4"
                    >
                      {/* Photo wrapper */}
                      <div className="w-16 h-16 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 overflow-hidden relative border border-slate-100 font-extrabold text-xl shadow-sm">
                        {member.photo_url ? (
                          <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <h4 className="font-extrabold text-primary-900 text-sm leading-snug">{member.name}</h4>
                        <div className="flex flex-wrap gap-1 items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          <span>{member.qualification}</span>
                        </div>
                        {member.subject && (
                          <span className="text-xs text-secondary-700 font-semibold">{member.subject}</span>
                        )}
                        {member.experience && (
                          <span className="text-[10px] text-slate-400 font-bold">{member.experience} Exp</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

    </div>
  );
}
