import { SCHOOL_KNOWLEDGE_BASE } from './chatbot-knowledge';

export function getFallbackResponse(query: string): string {
  const q = query.toLowerCase().trim();

  // Greeting
  if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('greetings') || q.includes('how are you')) {
    return `Hello! Welcome to the Paramakudi Lions School Enquiry Assistant. How can I help you today? You can ask me about admissions, timings, facilities, location, or contact details.`;
  }

  // Fees / Cost
  if (q.includes('fee') || q.includes('cost') || q.includes('payment') || q.includes('price') || q.includes('expensive')) {
    return `${SCHOOL_KNOWLEDGE_BASE.admissions.note} For specific fee structures, please contact the school office directly at ${SCHOOL_KNOWLEDGE_BASE.contacts.mobile}.`;
  }

  // Admissions
  if (q.includes('admission') || q.includes('apply') || q.includes('enroll') || q.includes('join') || q.includes('vacancy') || q.includes('vacancies') || q.includes('seat') || q.includes('seats')) {
    return `${SCHOOL_KNOWLEDGE_BASE.admissions.status} ${SCHOOL_KNOWLEDGE_BASE.admissions.process} Required documents: ${SCHOOL_KNOWLEDGE_BASE.admissions.requirements}. ${SCHOOL_KNOWLEDGE_BASE.admissions.note}`;
  }

  // Transport / Van
  if (q.includes('van') || q.includes('bus') || q.includes('transport') || q.includes('route') || q.includes('driver')) {
    if (q.includes('time') || q.includes('timing') || q.includes('hours') || q.includes('schedule') || q.includes('when')) {
      return `School transport (van/bus) timings are scheduled to match school hours:
• Morning Pickup: Vans start picking up students between 7:30 AM and 8:30 AM.
• Afternoon Drop-off:
  - Kindergarten: Departs school at 12:45 PM.
  - Primary & Middle School: Departs school at 3:50 PM.
  - High & Higher Secondary: Departs school at 4:50 PM.
For exact route details and specific pick-up times for your area, please contact the school office at ${SCHOOL_KNOWLEDGE_BASE.contacts.mobile}.`;
    }
    return `Paramakudi Lions School offers dedicated transport services with a fleet of 20 vans/buses covering major rural and urban routes surrounding Paramakudi. All vehicles have experienced drivers and attendants. For routes, availability, or registration, please contact the school office at ${SCHOOL_KNOWLEDGE_BASE.contacts.mobile}.`;
  }

  // Timings
  if (q.includes('timing') || q.includes('hours') || q.includes('time') || q.includes('when open') || q.includes('saturday')) {
    return `Our school timings are:
• High & Higher Secondary School: ${SCHOOL_KNOWLEDGE_BASE.timings.highAndHigherSecondary}
• Primary & Middle School: ${SCHOOL_KNOWLEDGE_BASE.timings.primaryAndMiddle}
• Kindergarten Block: ${SCHOOL_KNOWLEDGE_BASE.timings.kindergarten}
• Office / Admin Timings: ${SCHOOL_KNOWLEDGE_BASE.timings.office}
• School Transport (Van/Bus): Morning pickup starts between 7:30 AM and 8:30 AM. Afternoon drop-off starts after school hours depending on the route.`;
  }

  // Contacts
  if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('email') || q.includes('call') || q.includes('mobile')) {
    return `You can reach the school office through:
• Mobile: ${SCHOOL_KNOWLEDGE_BASE.contacts.mobile}
• Phone: ${SCHOOL_KNOWLEDGE_BASE.contacts.phone}
• Email: ${SCHOOL_KNOWLEDGE_BASE.contacts.email}
You can also send an enquiry via our Contact page.`;
  }

  // Location / Address
  if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('landmark') || q.includes('find') || q.includes('map')) {
    return `Paramakudi Lions School is located at:
${SCHOOL_KNOWLEDGE_BASE.location.address}
The landmark is in Thelichathanallur, Paramakudi. You can find the Google Map on our Contact page.`;
  }

  // Curriculum / Syllabus
  if (q.includes('curriculum') || q.includes('syllabus') || q.includes('board') || q.includes('study') || q.includes('studies') || q.includes('subject') || q.includes('class') || q.includes('classes')) {
    return `We follow the ${SCHOOL_KNOWLEDGE_BASE.curriculum} We offer classes from Kindergarten (LKG/UKG) up to 12th Standard (Higher Secondary) with specialized streams like Maths-Biology, Computer Science, and Commerce.`;
  }

  // Facilities
  if (q.includes('facility') || q.includes('facilities') || q.includes('infrastructure') || q.includes('library') || q.includes('lab') || q.includes('labs') || q.includes('computer') || q.includes('water') || q.includes('drinking') || q.includes('ro') || q.includes('playground') || q.includes('campus')) {
    let response = "Here are our key facilities:\n";
    SCHOOL_KNOWLEDGE_BASE.facilities.forEach(f => {
      response += `• ${f.name}: ${f.details}\n`;
    });
    return response.trim();
  }

  // Extracurriculars
  if (q.includes('extracurricular') || q.includes('sports') || q.includes('activities') || q.includes('karate') || q.includes('yoga') || q.includes('club') || q.includes('lions') || q.includes('jrc') || q.includes('skating') || q.includes('exhibition') || q.includes('event') || q.includes('events')) {
    let response = "We offer a wide range of co-curricular activities and sports:\n";
    SCHOOL_KNOWLEDGE_BASE.extracurriculars.forEach(e => {
      response += `• ${e}\n`;
    });
    return response.trim();
  }

  // Achievements
  if (q.includes('achievement') || q.includes('achievements') || q.includes('pass') || q.includes('result') || q.includes('results') || q.includes('board exam') || q.includes('rank') || q.includes('topper')) {
    let response = "Here are some of our major achievements:\n";
    SCHOOL_KNOWLEDGE_BASE.achievements.forEach(a => {
      response += `• ${a}\n`;
    });
    return response.trim();
  }

  // Management / Leadership
  if (q.includes('principal') || q.includes('chairman') || q.includes('secretary') || q.includes('treasurer') || q.includes('management') || q.includes('soundara') || q.includes('sobana') || q.includes('muralidharan')) {
    return `Our school leadership management team includes:
• Principal: ${SCHOOL_KNOWLEDGE_BASE.management.principal}
• Chairman: ${SCHOOL_KNOWLEDGE_BASE.management.chairman}
• Secretary: ${SCHOOL_KNOWLEDGE_BASE.management.secretary}
• Treasurer: ${SCHOOL_KNOWLEDGE_BASE.management.treasurer}`;
  }

  // About / History
  if (q.includes('about') || q.includes('history') || q.includes('legacy') || q.includes('vision') || q.includes('mission') || q.includes('values') || q.includes('who are you') || q.includes('what is')) {
    return `${SCHOOL_KNOWLEDGE_BASE.legacy} Our vision is to build students as powerful instruments of truth, right living, and service. We focus on child-centric training under Tender, Love, and Care.`;
  }

  // Fallback
  return `Sorry, I couldn't find that information. Please contact the school directly. For more information, please contact Paramakudi Lions School through the Contact page.`;
}
