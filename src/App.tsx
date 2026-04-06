import React, { useState, useEffect } from 'react';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import { Customizer } from './components/Customizer';
import { ResumeData, ResumeSettings } from './types';
import { 
  FileText, 
  Palette, 
  Download, 
  Sparkles, 
  Github, 
  Twitter, 
  CheckCircle2, 
  AlertCircle,
  Layout,
  Settings2,
  Share2,
  History,
  Save,
  Eye,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

const initialData: ResumeData = {
  personalInfo: {
    fullName: 'Alexander Pierce',
    email: 'alex.pierce@example.com',
    phone: '+1 (555) 000-0000',
    location: 'San Francisco, CA',
    website: 'alex-pierce.design',
    linkedin: 'linkedin.com/in/alexpierce',
    summary: 'Senior Product Designer with 8+ years of experience building scalable design systems and user-centric interfaces for high-growth tech companies. Proven track record of leading cross-functional teams to deliver impactful products.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250&h=250&auto=format&fit=crop'
  },
  experience: [
    {
      id: '1',
      company: 'TechFlow Systems',
      position: 'Senior Product Designer',
      startDate: 'Jan 2021',
      endDate: 'Present',
      description: '• Led the redesign of the core dashboard, resulting in a 25% increase in user engagement.\n• Established and maintained a comprehensive design system used by 50+ engineers.\n• Mentored junior designers and conducted weekly design critiques.'
    },
    {
      id: '2',
      company: 'Creative Pulse',
      position: 'UI/UX Designer',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      description: '• Designed mobile-first applications for over 15 clients across various industries.\n• Conducted user research and usability testing to iterate on design solutions.\n• Collaborated closely with developers to ensure high-fidelity implementation.'
    }
  ],
  education: [
    {
      id: '1',
      school: 'Stanford University',
      degree: 'B.S. in Product Design',
      startDate: '2014',
      endDate: '2018'
    }
  ],
  skills: ['Product Design', 'UI/UX', 'Design Systems', 'React', 'Figma', 'User Research', 'Prototyping'],
  projects: [
    {
      id: '1',
      name: 'EcoTrack App',
      description: 'A sustainability tracking app that helps users reduce their carbon footprint through gamified challenges and real-time data visualization.',
      link: 'github.com/alexpierce/ecotrack'
    }
  ]
};

const initialSettings: ResumeSettings = {
  templateId: 'visual',
  primaryColor: '#ef4444',
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, sans-serif',
  fontSize: 'medium',
  photoBorderStyle: 'solid',
  photoBorderColor: '#ef4444',
  photoBorderWidth: 4
};

export default function App() {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resume-data');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [settings, setSettings] = useState<ResumeSettings>(() => {
    const saved = localStorage.getItem('resume-settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'preview'>('content');
  const [isSaved, setIsSaved] = useState(true);
  const [resumeStrength, setResumeStrength] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Calculate resume strength
  useEffect(() => {
    let score = 0;
    if (data.personalInfo.fullName) score += 10;
    if (data.personalInfo.email) score += 5;
    if (data.personalInfo.summary.length > 50) score += 15;
    if (data.experience.length > 0) score += 20;
    if (data.education.length > 0) score += 15;
    if (data.skills.length > 3) score += 15;
    if (data.projects.length > 0) score += 10;
    if (data.personalInfo.photo) score += 10;
    setResumeStrength(Math.min(score, 100));
    setIsSaved(false);
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('resume-data', JSON.stringify(data));
      localStorage.setItem('resume-settings', JSON.stringify(settings));
      setIsSaved(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [data, settings]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans selection:bg-red-100 selection:text-red-900">
      {/* SaaS Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b backdrop-blur-xl bg-white/90 border-gray-200/50">
        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(239,68,68,0.4)] bg-gradient-to-br from-red-500 to-red-600">
                <FileText size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">
                  Zerisx <span className="text-red-600 underline decoration-4 decoration-red-200 underline-offset-4">AI</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1.5">Next-Gen Resume Engine</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-200 mx-2 hidden lg:block" />
            
            <div className="hidden lg:flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('content')}
                className={cn(
                  "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2",
                  activeTab === 'content' ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <FileText size={14} /> Content
              </button>
              <button 
                onClick={() => setActiveTab('style')}
                className={cn(
                  "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2",
                  activeTab === 'style' ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Palette size={14} /> Design
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Strength</span>
                <span className="text-xs font-black text-gray-900">{resumeStrength}%</span>
              </div>
              <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${resumeStrength}%` }}
                  className={cn(
                    "h-full transition-all duration-500",
                    resumeStrength < 40 ? "bg-red-500" : resumeStrength < 70 ? "bg-orange-500" : "bg-green-500"
                  )}
                />
              </div>
            </div>

            <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                {isSaved ? (
                  <span className="flex items-center gap-1.5 text-green-500">
                    <CheckCircle2 size={12} /> Saved
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-orange-500">
                    <History size={12} className="animate-spin-slow" /> Saving...
                  </span>
                )}
              </div>
              
              <button className="px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-[0_15px_30px_-5px_rgba(239,68,68,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(239,68,68,0.4)] active:scale-95 bg-gray-900 hover:bg-black flex items-center gap-2">
                <Share2 size={16} />
                <span className="hidden sm:inline">Share</span>
              </button>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t bg-white overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => { setActiveTab('content'); setIsMobileMenuOpen(false); }}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                      activeTab === 'content' ? "bg-red-50 border-red-200 text-red-600" : "bg-gray-50 border-gray-100 text-gray-400"
                    )}
                  >
                    <FileText size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Content</span>
                  </button>
                  <button 
                    onClick={() => { setActiveTab('style'); setIsMobileMenuOpen(false); }}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                      activeTab === 'style' ? "bg-red-50 border-red-200 text-red-600" : "bg-gray-50 border-gray-100 text-gray-400"
                    )}
                  >
                    <Palette size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Design</span>
                  </button>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Resume Strength</span>
                    <span className="text-xs font-black text-gray-900">{resumeStrength}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        resumeStrength < 40 ? "bg-red-500" : resumeStrength < 70 ? "bg-orange-500" : "bg-green-500"
                      )}
                      style={{ width: `${resumeStrength}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 max-w-[1800px] mx-auto w-full p-6 md:p-12 pt-32 lg:pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Editor */}
          <div className="lg:col-span-5 space-y-8">
            {/* Mobile Tab Switcher */}
            <div className="lg:hidden mb-8">
              <div className="flex p-1.5 bg-gray-100 rounded-2xl">
                <button 
                  onClick={() => setActiveTab('content')}
                  className={cn(
                    "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2",
                    activeTab === 'content' ? "bg-white shadow-md text-red-600" : "text-gray-400"
                  )}
                >
                  <FileText size={14} /> Content
                </button>
                <button 
                  onClick={() => setActiveTab('style')}
                  className={cn(
                    "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2",
                    activeTab === 'style' ? "bg-white shadow-md text-red-600" : "text-gray-400"
                  )}
                >
                  <Palette size={14} /> Design
                </button>
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={cn(
                    "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2",
                    activeTab === 'preview' ? "bg-white shadow-md text-red-600" : "text-gray-400"
                  )}
                >
                  <Eye size={14} /> Preview
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'content' && (
                <motion.div
                  key="content-editor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">Resume Content</h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Fill in your professional details</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                      <Sparkles size={12} /> AI Assisted
                    </div>
                  </div>
                  <ResumeForm data={data} onChange={setData} />
                </motion.div>
              )}

              {activeTab === 'style' && (
                <motion.div
                  key="style-editor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">Visual Identity</h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Customize your resume's look</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-500 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
                      <Settings2 size={12} /> Pro Customizer
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-gray-100">
                    <Customizer settings={settings} onSettingsChange={setSettings} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Preview */}
          <div className={cn(
            "lg:col-span-7 sticky top-32 lg:top-40",
            activeTab !== 'preview' && "hidden lg:block"
          )}>
            <div className="relative group">
              {/* Decorative Elements */}
              <div className="absolute -inset-8 bg-gradient-to-tr from-red-500/5 via-transparent to-blue-500/5 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-8 px-6 no-print">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Live Document Preview</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <Layout size={14} /> {settings.templateId} Template
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">ISO A4 • 210 × 297 mm</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden">
                  <ResumePreview data={data} settings={settings} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-16 mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                  <FileText size={20} />
                </div>
                <h2 className="text-xl font-black tracking-tighter uppercase italic">Zerisx AI</h2>
              </div>
              <p className="text-gray-500 text-sm max-w-md leading-relaxed font-medium">
                The world's most advanced AI-powered resume builder. Create professional, high-impact resumes in seconds with our intelligent templates and real-time customization.
              </p>
              <div className="flex gap-4 mt-8">
                <a href="#" className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all">
                  <Github size={22} />
                </a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-blue-400 transition-all">
                  <Twitter size={22} />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-gray-400 mb-6">Product</h3>
              <ul className="space-y-4 text-sm font-bold text-gray-600">
                <li><a href="#" className="hover:text-red-500 transition-colors">Templates Gallery</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">AI Writing Assistant</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Resume Examples</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Pricing Plans</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-gray-400 mb-6">Resources</h3>
              <ul className="space-y-4 text-sm font-bold text-gray-600">
                <li><a href="#" className="hover:text-red-500 transition-colors">Career Blog</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-16 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              © 2026 Zerisx AI Resume Builder. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Made with <span className="text-red-500 animate-pulse">❤️</span> for professionals
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
