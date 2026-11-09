'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Users, Award, Calendar, ChevronLeft, ChevronRight, 
  MapPin, Phone, Mail, FileText, ArrowRight, ShieldCheck, 
  Play, Radio, Volume2, Landmark, Compass, Target
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';

// Fallback data
const defaultHeroSlides = [
  {
    title: 'Nurturing Mind, Character & Body',
    description: 'Providing a holistic educational environment at Paramakudi Lions School since 1991.',
    bgClass: 'from-primary-900/90 via-primary-800/80 to-secondary-900/90',
    imageUrl: '/images/slider1.jpg',
    link: '/aboutus',
    cta: 'Learn More'
  },
  {
    title: 'Excellence in Academics & Co-curriculars',
    description: 'Equipped with smart classrooms, advanced computer labs, and sprawling athletic facilities.',
    bgClass: 'from-secondary-900/90 via-primary-800/80 to-slate-900/90',
    imageUrl: '/images/slider2.jpg',
    link: '/facilities',
    cta: 'Our Facilities'
  },
  {
    title: 'Leadership, Experience & Opportunity',
    description: 'Empowering future leaders through Lions Club, Junior Red Cross, and dedicated sports coaching.',
    bgClass: 'from-primary-850/90 via-secondary-700/80 to-primary-950/90',
    imageUrl: '/images/slider3.jpg',
    link: '/activities',
    cta: 'Student Life'
  }
];

const defaultNotices = [
  { id: '1', title: 'Admissions Open for Academic Year 2026-2027. Contact office for details.' },
  { id: '2', title: 'Circular: Monthly unit tests start from next Monday for classes VI to XII.' },
  { id: '3', title: 'Lions School secured 100% pass rate in recent State Board Higher Secondary Exams!' }
];

const defaultNews = [
  {
    id: '1',
    title: 'School Reopening Day Celebration',
    content: 'We welcomed our students back with special assemblies, decorated classrooms, and motivational speeches from our senior management.',
    published_at: new Date().toISOString(),
    image_url: null
  },
  {
    id: '2',
    title: 'Annual Sports Meet 2026',
    content: 'A grand showcase of athletic talents. Students participated in track events, karate demonstrations, and yoga drills with immense enthusiasm.',
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    image_url: null
  }
];

const defaultEvents = [
  {
    id: '1',
    title: 'Science & Art Exhibition 2026',
    description: 'Annual inter-class science exhibition displaying innovative models, working prototypes, and artwork.',
    date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
    venue: 'School Auditorium'
  },
  {
    id: '2',
    title: 'Parent-Teacher Meeting',
    description: 'Academic progress review and feedback session for all grades. Attendance is mandatory.',
    date: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0],
    venue: 'Respective Classrooms'
  }
];

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [notices, setNotices] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [latestVideo, setLatestVideo] = useState<any>(null);

  const supabase = createClient();

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    // Auto slide hero
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % defaultHeroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadData() {
      if (typeof supabase.from !== 'function') {
        // Safe fallback if supabase is not initialized
        setNotices(defaultNotices);
        setNews(defaultNews);
        setEvents(defaultEvents);
        return;
      }

      try {
        // Load notices
        const { data: noticesData } = await supabase
          .from('notices')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        setNotices(noticesData && noticesData.length > 0 ? noticesData : defaultNotices);

        // Load news
        const { data: newsData } = await supabase
          .from('news')
          .select('*')
          .order('pinned', { ascending: false })
          .order('published_at', { ascending: false })
          .limit(3);
        setNews(newsData && newsData.length > 0 ? newsData : defaultNews);

        // Load events
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true })
          .limit(3);
        setEvents(eventsData && eventsData.length > 0 ? eventsData : defaultEvents);

        // Load achievements
        const { data: achievementsData } = await supabase
          .from('achievements')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        setAchievements(achievementsData || []);

        // Load settings
        const { data: settingsData } = await supabase
          .from('contact_settings')
          .select('*')
          .single();
        if (settingsData) setSettings(settingsData);

        // Load latest video
        const { data: videoData } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
        if (videoData && videoData.length > 0) {
          setLatestVideo(videoData[0]);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setNotices(defaultNotices);
        setNews(defaultNews);
        setEvents(defaultEvents);
      }
    }
    loadData();
  }, []);

  const nextSlide = () => {
    setHeroIndex((prev) => (prev + 1) % defaultHeroSlides.length);
  };

  const prevSlide = () => {
    setHeroIndex((prev) => (prev - 1 + defaultHeroSlides.length) % defaultHeroSlides.length);
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* 1. HERO SLIDER */}
      <section className="relative h-[480px] md:h-[600px] w-full overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center px-4 sm:px-6 lg:px-12"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <Image 
                src={defaultHeroSlides[heroIndex].imageUrl}
                alt={defaultHeroSlides[heroIndex].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/75 to-slate-950/80 z-10"></div>
            </div>
            
            <div className="max-w-4xl mx-auto text-center md:text-left z-20 text-white flex flex-col gap-4 md:gap-6 mt-10 md:mt-0">
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm md:text-base lg:text-lg font-black uppercase tracking-widest text-white bg-black/60 px-6 py-2.5 rounded-full self-center md:self-start w-fit border-2 border-white/40 shadow-xl"
              >
                Welcome to Paramakudi Lions School
              </motion.span>
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-md"
              >
                {defaultHeroSlides[heroIndex].title}
              </motion.h1>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm md:text-lg text-slate-200 font-medium leading-relaxed max-w-2xl drop-shadow-sm"
              >
                {defaultHeroSlides[heroIndex].description}
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center md:justify-start gap-4 mt-2"
              >
                <Link 
                  href={defaultHeroSlides[heroIndex].link} 
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-primary-700/20 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
                >
                  {defaultHeroSlides[heroIndex].cta} <ArrowRight size={16} />
                </Link>
                <Link 
                  href="/contactus" 
                  className="border-2 border-white/60 hover:border-white hover:bg-white/10 text-white font-bold text-sm px-6 py-3 rounded-full transition-all"
                >
                  Contact Admissions
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {defaultHeroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${heroIndex === idx ? 'bg-primary-600 w-8' : 'bg-white/40'}`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* 2. NOTICE BOARD (TICKER) */}
      <section className="bg-amber-50 border-y border-amber-200 py-3.5 px-4 overflow-hidden relative flex items-center">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-1.5 bg-accent-600 text-white text-xs font-black px-3 py-1.5 rounded uppercase tracking-wider shrink-0 shadow-sm animate-pulse">
            <Radio size={14} className="shrink-0" />
            <span>Notice Board</span>
          </div>
          <div className="w-full overflow-hidden relative h-5 md:h-6 flex items-center">
            <div className="flex gap-20 absolute whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer pl-4">
              {notices.map((n, i) => (
                <div key={n.id || i} className="flex items-center gap-2 text-xs md:text-sm font-bold text-accent-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-600 shrink-0"></span>
                  <span>{n.title}</span>
                  {n.pdf_url && (
                    <a href={n.pdf_url} target="_blank" rel="noopener noreferrer" className="ml-1 text-[10px] bg-accent-600/10 hover:bg-accent-600 text-accent-700 hover:text-white px-2 py-0.5 rounded transition-all font-bold">
                      PDF
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SCHOOL BRIEF & METRICS */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text content */}
          <div className="lg:col-span-12 flex flex-col gap-6 max-w-4xl">
            <span className="text-xs font-bold text-primary-700 uppercase tracking-widest border-l-4 border-primary-700 pl-2">
              Who We Are
            </span>
            <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-primary-900 leading-tight">
              More than 30 Years of Empowering Education
            </h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              In 1991, a small seed was planted in Paramakudi Lions soil and that has grown into a sturdy tree. 
              The members of Paramakudi Lions club quietly spearhead a new educational awakening among the young students of India. 
              Our vision is to bring about the best in each child following tender, love, and care.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              We offer holistic education blended with modern systems. The school is fully equipped with advanced laboratories, spacious air-conditioned classrooms, a vast playground, and safe bus transport covering neighboring rural sectors to promote inclusive development.
            </p>
            
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100 max-w-xl">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-primary-700 leading-none">30+</span>
                <span className="text-xs text-slate-500 font-bold mt-1 uppercase">Years Excellence</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-primary-700 leading-none">20+</span>
                <span className="text-xs text-slate-500 font-bold mt-1 uppercase">Vans & Buses</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-primary-700 leading-none">100%</span>
                <span className="text-xs text-slate-500 font-bold mt-1 uppercase">Academic Pass</span>
              </div>
            </div>

            <Link href="/aboutus" className="inline-flex items-center gap-1.5 text-primary-700 hover:text-primary-800 font-bold text-sm mt-4 hover:translate-x-1 transition-all">
              Read Our History <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PDF CONTENT / RELATIONSHIPS GUIDE & LINCOLN'S LETTER */}
      <section className="bg-primary-50 py-16 px-4 md:px-8 border-y border-primary-100/50">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          
          {/* Card 1: Relationships */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-8">
            <div className="text-center flex flex-col gap-2">
              <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-primary-900">உறவுகள் மேம்பட ...</h3>
              <p className="text-slate-600 font-medium mt-2">
                குடும்பத்திலும் சரி, அலுவலகத்திலும் சரி, மனித உறவுகளில் விரிசல்கள் ஏற்படாமல் இருக்கவும், ஏற்பட்ட விரிசல்கள் மேலும் பெரியதாகாமல் இருக்க.
              </p>
            </div>

            <ul className="flex flex-col gap-4 text-slate-700 leading-relaxed font-medium">
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-black mt-1">•</span>
                <span>நானே பெரியவன், நானே சிறந்தவன் என்ற அகந்தையை (EGO) விடுங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-black mt-1">•</span>
                <span>அர்த்தமில்லாமலும் பின்விளைவு அறியாமலும் பேசிக் கொண்டேயிருப்பதை விடுங்கள். (Loose Talk)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-black mt-1">•</span>
                <span>எந்த விஷயத்தையும், பிரச்சனையையும் நாசுக்காக கையாளுங்கள். (Diplomacy) விட்டுக் கொடுங்கள். (Compromise)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-black mt-1">•</span>
                <span>சில நேரங்களில் சில சங்கடங்களைச் சகித்துத்தான் ஆக வேண்டும் என்பதை உணருங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-black mt-1">•</span>
                <span>எல்லாரிடத்திலும் எல்லா விஷயங்களையும், அவர்களுக்கு சம்பந்தம் உண்டோ, இல்லையோ சொல்லிக் கொண்டிருக்காதீர்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-black mt-1">•</span>
                <span>உங்கள் கருத்துகளில் உடும்புப் பிடியாய் இல்லாமல், கொஞ்சம் தளர்த்திக் கொள்ளுங்கள். (Flexibility)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-black mt-1">•</span>
                <span>மற்றவர்களுக்குரிய மரியாதையை காட்டவும், இனிய இதமான சொற்களைப் பயன்படுத்தவும் தவறாதீர்கள். (Courtesy)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-black mt-1">•</span>
                <span>புன்முறுவல் காட்டவும், சிற்சில அன்புச் சொற்களை சொல்லவும்கூட நேரமில்லாதது போல் நடந்து கொள்ளாதீர்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-black mt-1">•</span>
                <span>பிரச்சனைகள் ஏற்படும்போது அடுத்தவர் முதலில் இறங்கி வர வேண்டும் என்று காத்திருக்காமல் நீங்களே பேச்சைத் துவக்க முன் வாருங்கள்.</span>
              </li>
            </ul>

            <div className="text-right mt-2 flex flex-col items-end border-t border-slate-100 pt-6">
              <span className="font-bold text-primary-900">நன்றி</span>
              <span className="text-slate-500">நர்மதா பதிப்பகம்</span>
            </div>
          </div>

          {/* Card 2: Lincoln's Letter */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-8">
            <div className="text-center flex flex-col gap-2">
              <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-primary-900">ஆபிரகாம் லிங்கன் கடிதம்</h3>
              <p className="text-slate-600 font-medium mt-2 leading-relaxed">
                அமெரிக்காவின் குடியரசுத் தலைவராக இருந்த ஆபிரகாம் லிங்கன் தனது மகன் படித்த பள்ளியின் தலைமையாசிரியருக்கு, ஆசிரியர்கள் தனது மகனுக்கு எதைக் கற்றுக் கொடுக்க வேண்டுமென்று ஒரு கடிதம் எழுதினார். அந்தக் கடிதத்தின் முக்கிய பகுதிகள்.
              </p>
            </div>

            <ul className="flex flex-col gap-4 text-slate-700 leading-relaxed font-medium">
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>எல்லா மனிதர்களும் நேர்மையானவர்களும் அல்ல; உண்மையானவர்களும் அல்ல. ஆனால், ஒவ்வொரு கெட்டவனுக்கும் ஈடாக ஒரு நல்லவன் இருக்கிறான் என்பதை அவனுக்குக் கற்றுக் கொடுங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>ஒவ்வொரு சுயநலமிக்க அரசியல்வாதிக்கும் ஈடாக ஓர் அர்ப்பணிப்புத்தன்மை கொண்ட தலைவன் இருக்கிறான் என்பதைக் கற்றுக் கொடுங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>ஒவ்வொரு எதிரிக்கும் ஈடாக ஒரு நண்பன் இருக்கிறான் என்பதைக் கற்றுக் கொடுங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>தானாகக் கிடைக்கும் ஐந்து ரூபாயை விட உழைத்து சம்பாதித்த ஒரு ரூபாய் உயர்ந்தது என்று கற்றுக் கொடுங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>தோல்வி அடைந்தால் வருத்தப்படாமலிருக்கவும் வெற்றி பெற்றால் சந்தோஷப்படவும் கற்றுக் கொடுங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>பிறர் மீது பொறாமைப்படாமலிருக்கவும் அமைதியான சிரிப்பின் அர்த்தத்தை உணரவும் அவனுக்குக் கற்றுக் கொடுங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>வியப்புக்குரிய புத்தக உலகைப் பற்றித் தெரிந்து கொள்ளக் கற்றுக்கொடுங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>வானத்தில் வட்டமிடும் பறவைகள், தேனீக்கள், பசுமையான மலைப் பகுதிகளில் காணப்படும் மலர்கள் ஆகியவற்றின் அழகை ரசிக்கக் கற்றுக் கொடுங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>பிறரை ஏமாற்றுவதை விட வீழ்ச்சி அடைவது பெருந்தன்மையானது என்பதைக் கற்றுக் கொடுங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>நல்லவர்களோடு இதமாகவும் முரடர்களோடு முரட்டுத்தன்மையோடும் நடந்து கொள்ளவும் அவனுக்குக் கற்றுக் கொடுங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>மனிதர்கள் அனைவரும் ஆட்டுமந்தைகளாகச் செல்லும்பொழுது, அதில் சேராமல் தனித்திருக்க சுயபலம் பெற்றிருக்க வேண்டும் என்பதை அவனுக்குக் கற்றுக் கொடுங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>பிறர் சொல்வதைக் கேட்கவும் நல்லவற்றை மட்டுமே எடுத்துக் கொள்ளவும் அவனுக்குக் கற்றுக் கொடுங்கள்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>லிங்கனின் கோரிக்கைகள் எவ்வளவு அற்புதமானவை பாருங்கள். இவற்றையெல்லாம் ஆசிரியர்கள் மாணவர்களுக்குக் கற்றுக் கொடுத்தால் அவர்கள் நிச்சயமாக நல்ல மனிதர்களாக எதிர்காலத்தில் மாறுவார்கள். அப்போதுதான் அவர்கள் கற்ற கல்வியும் முழுமையடையும்.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary-600 font-black mt-1">•</span>
                <span>மாணவர்களும் மேற்சொன்னவற்றை மன உறுதியுடன் கற்றுக் கொள்ள வேண்டும். தேர்வில் மதிப்பெண்கள் பெறுவது மட்டுமே கல்வியல்ல!</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 5. NEWS & EVENTS GRID */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Latest News column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex justify-between items-end border-b border-slate-100 pb-3">
              <h3 className="font-heading text-2xl font-extrabold text-primary-900 flex items-center gap-2">
                <BookOpen className="text-primary-600" size={24} />
                Latest News & Announcements
              </h3>
              <Link href="/events" className="text-xs font-bold text-primary-700 hover:text-primary-800">
                View All
              </Link>
            </div>
            
            <div className="flex flex-col gap-6">
              {news.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5">
                  <div className="w-full sm:w-48 h-32 relative bg-slate-150 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-slate-400 font-medium">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.title} fill sizes="(max-width: 640px) 100vw, 192px" className="object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-300">
                        <BookOpen size={28} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Lions School</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-grow">
                    <span className="text-[10px] text-slate-400 font-bold">
                      {formatDate(item.published_at)}
                    </span>
                    <h4 className="font-bold text-primary-900 text-base leading-snug">{item.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.content}</p>
                    <Link href={`/events#news-${item.id}`} className="text-xs font-bold text-primary-700 hover:text-primary-800 mt-2 inline-flex items-center gap-0.5">
                      Read More <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-heading text-2xl font-extrabold text-primary-900 flex items-center gap-2">
                <Calendar className="text-primary-600" size={24} />
                Upcoming Events
              </h3>
            </div>
            
            <div className="flex flex-col gap-4">
              {events.map((event) => (
                <div key={event.id} className="bg-primary-900/5 hover:bg-primary-900/10 p-5 rounded-2xl border border-primary-900/5 transition-all flex gap-4">
                  {/* Date square */}
                  <div className="bg-primary-900 text-white rounded-xl w-14 h-14 shrink-0 flex flex-col items-center justify-center shadow-md">
                    <span className="text-xs uppercase font-extrabold leading-none tracking-tighter">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-black leading-none mt-1">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 flex-grow">
                    <h4 className="font-bold text-primary-900 text-sm leading-snug">{event.title}</h4>
                    <p className="text-slate-500 text-[11px] line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mt-1">
                      <MapPin size={10} />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            

          </div>

        </div>
      </section>

      {/* 6. SCHOOL FACILITIES */}
      <section className="bg-slate-100/60 py-16 px-4 md:px-8 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-xs font-bold text-primary-700 uppercase tracking-widest">Our Facilities</span>
            <h3 className="font-heading text-3xl font-extrabold text-primary-900">Nurturing Growth With Amenities</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* AC Classrooms */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
              <div className="h-44 relative bg-slate-200 flex items-center justify-center text-slate-300">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-700 to-primary-900 flex flex-col items-center justify-center text-white p-4 text-center">
                  <span className="text-xs font-extrabold uppercase text-accent-500 tracking-wider">Comfortable Environment</span>
                  <span className="text-2xl font-black mt-2">Air-conditioned</span>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-2">
                <h4 className="font-bold text-primary-900 text-base">Air-conditioned Classrooms</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Impressive structure providing clean, air-conditioned environments to keep tiny tots comfortable and focused on progressive learning.
                </p>
              </div>
            </div>

            {/* School Bus */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
              <div className="h-44 relative bg-slate-200 flex items-center justify-center text-slate-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-secondary-900 flex flex-col items-center justify-center text-white p-4 text-center">
                  <span className="text-xs font-extrabold uppercase text-accent-500 tracking-wider">Transport Services</span>
                  <span className="text-2xl font-black mt-2">20 Vans & Buses</span>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-2">
                <h4 className="font-bold text-primary-900 text-base">Reliable Bus Transport</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Safe and systematic vehicle network transporting children from all rural and urban sectors surrounding the Paramakudi area.
                </p>
              </div>
            </div>

            {/* Library */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
              <div className="h-44 relative bg-slate-200 flex items-center justify-center text-slate-300">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-primary-900 flex flex-col items-center justify-center text-white p-4 text-center">
                  <span className="text-xs font-extrabold uppercase text-accent-500 tracking-wider">Knowledge Hub</span>
                  <span className="text-2xl font-black mt-2">2,500+ Books</span>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-2">
                <h4 className="font-bold text-primary-900 text-base">Spacious Library</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  A massive collection of references, textbooks, current affairs materials, and journals to enrich cognitive development and life skills.
                </p>
              </div>
            </div>

            {/* Computer & Language Labs */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
              <div className="h-44 relative bg-slate-200 flex items-center justify-center text-slate-300">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary-700 to-primary-900 flex flex-col items-center justify-center text-white p-4 text-center">
                  <span className="text-xs font-extrabold uppercase text-accent-500 tracking-wider">Technological Skill</span>
                  <span className="text-2xl font-black mt-2">Modern IT Labs</span>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-2">
                <h4 className="font-bold text-primary-900 text-base">Computer & Language Lab</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Equipped with modern computer setups, high-speed networks, and specialized language software to promote digital literacy from young ages.
                </p>
              </div>
            </div>

          </div>
          
          <Link href="/facilities" className="bg-primary-900 hover:bg-primary-950 text-white font-bold text-xs py-3 px-6 rounded-full self-center flex items-center gap-1.5 shadow-md">
            Explore All Infrastructure <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 7. QUICK GALLERY PREVIEW */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-primary-700 uppercase tracking-widest">Campus Life</span>
            <h3 className="font-heading text-3xl font-extrabold text-primary-900">Snapshots of Lions School</h3>
          </div>
          <Link href="/photogallery" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer">
            Browse Albums <ArrowRight size={14} />
          </Link>
        </div>

        {/* Gallery grid */}
        <div className="flex justify-center max-w-3xl mx-auto w-full">
          {latestVideo && latestVideo.type === 'youtube' && getYouTubeId(latestVideo.url) ? (
            <div className="h-60 md:h-80 w-full bg-black rounded-2xl overflow-hidden relative group border border-slate-200/50 shadow-sm">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${getYouTubeId(latestVideo.url)}`} 
                title={latestVideo.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full object-cover"
              ></iframe>
            </div>
          ) : (
            <Link href="/videos" className="h-60 md:h-80 w-full bg-slate-100 rounded-2xl overflow-hidden relative group border border-slate-200/50 shadow-sm flex items-center justify-center cursor-pointer hover:shadow-lg transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-secondary-900 opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 text-center text-white p-6 flex flex-col items-center gap-3">
                <Play size={36} className="text-accent-500 animate-pulse group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-base">Watch Our Video Showcase</h4>
                <p className="text-xs text-slate-200 max-w-xs leading-relaxed">
                  Take a virtual tour of our campus classrooms, laboratory models, and playground activities.
                </p>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="bg-primary-900 text-white py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-accent-500 uppercase tracking-widest">Testimonials</span>
            <h3 className="font-heading text-3xl font-black">What Our Community Says</h3>
          </div>
          
          <div className="glass-dark p-8 md:p-12 rounded-3xl relative flex flex-col gap-4">
            <p className="text-sm md:text-base leading-relaxed italic text-slate-100 font-medium">
              "Paramakudi Lions School has given my kids the absolute best start. The individual attention given by teachers and focus on holistic education rather than just grades has shaped their character beautifully. The transport facilities are punctual and reliable."
            </p>
            <div className="flex flex-col gap-0.5 mt-2">
              <span className="font-bold text-sm text-accent-500">M. Ramesh</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Parent of Grade X student</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. QUICK CONTACT / LOCATE US */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 text-center">
            <h3 className="font-heading text-2xl font-extrabold text-primary-900">Locate Us</h3>
            <p className="text-slate-500 text-xs leading-relaxed font-semibold">
              Our campus is located in a spacious 3.11-acre campus in Thelichathanallur, Paramakudi, with secure surroundings.
            </p>
          </div>
          
          {/* Map iframe */}
          <div className="w-full h-80 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative bg-slate-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.31135439775!2d78.583908!3d9.544605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b01511d5ffffff%3A0xc0fb1309f7a77d85!2sParamakudi%20Lions%20Matriculation%20Higher%20Secondary%20School!5e0!3m2!1sen!2sin!4v1700000000000" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
}
