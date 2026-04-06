import React, { useState } from 'react';
import { ResumeData, Experience, Education, Project } from '../types';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Upload, 
  X, 
  User, 
  Briefcase, 
  GraduationCap, 
  FolderKanban, 
  Wrench,
  ChevronRight,
  ChevronLeft,
  Info
} from 'lucide-react';
import { enhanceSummary, enhanceExperience, AITone, AILength } from '../lib/gemini';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Type as TypeIcon, AlignLeft } from 'lucide-react';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const TONE_OPTIONS: { value: AITone; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'confident', label: 'Confident' },
  { value: 'creative', label: 'Creative' },
  { value: 'professional', label: 'Professional' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'concise', label: 'Concise' },
];

const LENGTH_OPTIONS: { value: AILength; label: string }[] = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
];

type FormSection = 'personal' | 'experience' | 'education' | 'projects' | 'skills';

const sections: { id: FormSection; label: string; icon: React.ElementType }[] = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Wrench },
];

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<FormSection>('personal');
  const [isEnhancing, setIsEnhancing] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<AITone>('formal');
  const [selectedLength, setSelectedLength] = useState<AILength>('medium');
  const [showAIConfig, setShowAIConfig] = useState<string | null>(null);

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({ ...data, experience: [newExp, ...data.experience] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(exp => exp.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      school: '',
      degree: '',
      startDate: '',
      endDate: ''
    };
    onChange({ ...data, education: [newEdu, ...data.education] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(edu => edu.id !== id) });
  };

  const addProject = () => {
    const newProj: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      link: ''
    };
    onChange({ ...data, projects: [newProj, ...data.projects] });
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    onChange({
      ...data,
      projects: data.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj)
    });
  };

  const removeProject = (id: string) => {
    onChange({ ...data, projects: data.projects.filter(proj => proj.id !== id) });
  };

  const handleEnhanceSummary = async () => {
    setIsEnhancing('summary');
    try {
      const enhanced = await enhanceSummary(data.personalInfo.summary, selectedTone, selectedLength);
      updatePersonalInfo('summary', enhanced);
      setShowAIConfig(null);
    } finally {
      setIsEnhancing(null);
    }
  };

  const handleEnhanceExperience = async (id: string) => {
    setIsEnhancing(id);
    try {
      const exp = data.experience.find(e => e.id === id);
      if (exp) {
        const enhanced = await enhanceExperience(exp.description, selectedTone, selectedLength);
        updateExperience(id, 'description', enhanced);
        setShowAIConfig(null);
      }
    } finally {
      setIsEnhancing(null);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updatePersonalInfo('photo', '');
  };

  const nextSection = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const prevSection = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  const AIConfigPopover = ({ onEnhance, id }: { onEnhance: () => void; id: string }) => (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] border border-gray-100 p-4 z-50 animate-in fade-in zoom-in duration-200">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
            <TypeIcon size={10} /> Select Tone
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {TONE_OPTIONS.map(tone => (
              <button
                key={tone.value}
                onClick={() => setSelectedTone(tone.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all border",
                  selectedTone === tone.value 
                    ? "bg-blue-500 text-white border-blue-500 shadow-sm" 
                    : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200"
                )}
              >
                {tone.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
            <AlignLeft size={10} /> Select Length
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {LENGTH_OPTIONS.map(length => (
              <button
                key={length.value}
                onClick={() => setSelectedLength(length.value)}
                className={cn(
                  "px-2 py-1.5 rounded-lg text-[9px] font-bold transition-all border",
                  selectedLength === length.value 
                    ? "bg-blue-500 text-white border-blue-500 shadow-sm" 
                    : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200"
                )}
              >
                {length.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onEnhance}
          disabled={isEnhancing === id}
          className="w-full py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isEnhancing === id ? (
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : <Sparkles size={12} />}
          Generate {id === 'summary' ? 'Summary' : 'Points'}
        </button>
      </div>
    </div>
  );

  const InputField = ({ label, value, onChange, placeholder, type = "text", icon: Icon }: any) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{label}</label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-500 transition-colors">
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-900 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-red-500/5 focus:border-red-500/50 placeholder:text-gray-300",
            Icon ? "pl-12" : "pl-6"
          )}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Form Navigation Tabs */}
      <div className="flex items-center gap-2 p-2 bg-gray-100/50 rounded-[2rem] overflow-x-auto no-scrollbar">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeSection === s.id 
                  ? "bg-white shadow-lg shadow-gray-200/50 text-red-600 scale-105" 
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon size={14} />
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex-1"
          >
            {activeSection === 'personal' && (
              <div className="space-y-8">
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-red-500/50 group-hover:bg-red-50/30">
                      {data.personalInfo.photo ? (
                        <img src={data.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-300 group-hover:text-red-400 transition-colors">
                          <Upload size={24} />
                          <span className="text-[8px] font-black uppercase tracking-widest">Upload</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      title="Upload Photo"
                    />
                    {data.personalInfo.photo && (
                      <button
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-white border border-gray-100 text-red-500 rounded-full p-2 shadow-xl hover:bg-red-50 transition-all"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <InputField 
                      label="Full Name" 
                      value={data.personalInfo.fullName} 
                      onChange={(v: string) => updatePersonalInfo('fullName', v)}
                      placeholder="e.g. Alexander Pierce"
                    />
                    <InputField 
                      label="Job Title" 
                      value={data.personalInfo.location} 
                      onChange={(v: string) => updatePersonalInfo('location', v)}
                      placeholder="e.g. Senior Product Designer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    label="Email Address" 
                    value={data.personalInfo.email} 
                    onChange={(v: string) => updatePersonalInfo('email', v)}
                    placeholder="alex@example.com"
                    type="email"
                  />
                  <InputField 
                    label="Phone Number" 
                    value={data.personalInfo.phone} 
                    onChange={(v: string) => updatePersonalInfo('phone', v)}
                    placeholder="+1 (555) 000-0000"
                  />
                  <InputField 
                    label="Website / Portfolio" 
                    value={data.personalInfo.website} 
                    onChange={(v: string) => updatePersonalInfo('website', v)}
                    placeholder="alex-pierce.design"
                  />
                  <InputField 
                    label="LinkedIn Profile" 
                    value={data.personalInfo.linkedin || ''} 
                    onChange={(v: string) => updatePersonalInfo('linkedin', v)}
                    placeholder="linkedin.com/in/alexpierce"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Professional Summary</label>
                    <div className="relative">
                      <button
                        onClick={() => setShowAIConfig(showAIConfig === 'summary' ? null : 'summary')}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest",
                          showAIConfig === 'summary' ? "bg-blue-600 text-white shadow-lg" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        )}
                      >
                        <Sparkles size={12} />
                        AI Enhance
                      </button>
                      {showAIConfig === 'summary' && (
                        <AIConfigPopover id="summary" onEnhance={handleEnhanceSummary} />
                      )}
                    </div>
                  </div>
                  <textarea
                    value={data.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-6 text-sm font-medium text-gray-900 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-red-500/5 focus:border-red-500/50 h-40 resize-none leading-relaxed"
                    placeholder="Write a compelling summary of your professional journey..."
                  />
                </div>
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Info size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">List your roles in reverse chronological order</span>
                  </div>
                  <button
                    onClick={addExperience}
                    className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <Plus size={16} /> Add Experience
                  </button>
                </div>

                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={exp.id} 
                      className="p-8 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] relative group hover:bg-white hover:border-red-100 transition-all shadow-sm hover:shadow-xl hover:shadow-red-500/5"
                    >
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField 
                          label="Company Name" 
                          value={exp.company} 
                          onChange={(v: string) => updateExperience(exp.id, 'company', v)}
                          placeholder="e.g. Google"
                        />
                        <InputField 
                          label="Job Position" 
                          value={exp.position} 
                          onChange={(v: string) => updateExperience(exp.id, 'position', v)}
                          placeholder="e.g. Senior Software Engineer"
                        />
                        <InputField 
                          label="Start Date" 
                          value={exp.startDate} 
                          onChange={(v: string) => updateExperience(exp.id, 'startDate', v)}
                          placeholder="MM/YYYY"
                        />
                        <InputField 
                          label="End Date" 
                          value={exp.endDate} 
                          onChange={(v: string) => updateExperience(exp.id, 'endDate', v)}
                          placeholder="Present"
                        />
                        <div className="md:col-span-2 space-y-4">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Key Responsibilities</label>
                            <div className="relative">
                              <button
                                onClick={() => setShowAIConfig(showAIConfig === exp.id ? null : exp.id)}
                                className={cn(
                                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest",
                                  showAIConfig === exp.id ? "bg-blue-600 text-white shadow-lg" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                )}
                              >
                                <Sparkles size={12} />
                                AI Rewrite
                              </button>
                              {showAIConfig === exp.id && (
                                <AIConfigPopover id={exp.id} onEnhance={() => handleEnhanceExperience(exp.id)} />
                              )}
                            </div>
                          </div>
                          <textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl p-6 text-sm font-medium text-gray-900 outline-none transition-all focus:ring-4 focus:ring-red-500/5 focus:border-red-500/50 h-32 resize-none leading-relaxed"
                            placeholder="Use bullet points to describe your impact..."
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Info size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Academic background and certifications</span>
                  </div>
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-50 text-purple-600 rounded-2xl hover:bg-purple-100 transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <Plus size={16} /> Add Education
                  </button>
                </div>

                <div className="space-y-6">
                  {data.education.map((edu) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={edu.id} 
                      className="p-8 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] relative group hover:bg-white hover:border-purple-100 transition-all shadow-sm hover:shadow-xl hover:shadow-purple-500/5"
                    >
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <InputField 
                            label="School / University" 
                            value={edu.school} 
                            onChange={(v: string) => updateEducation(edu.id, 'school', v)}
                            placeholder="e.g. Stanford University"
                          />
                        </div>
                        <InputField 
                          label="Degree / Field of Study" 
                          value={edu.degree} 
                          onChange={(v: string) => updateEducation(edu.id, 'degree', v)}
                          placeholder="e.g. B.S. in Computer Science"
                        />
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <InputField 
                              label="Start Year" 
                              value={edu.startDate} 
                              onChange={(v: string) => updateEducation(edu.id, 'startDate', v)}
                              placeholder="YYYY"
                            />
                          </div>
                          <div className="flex-1">
                            <InputField 
                              label="End Year" 
                              value={edu.endDate} 
                              onChange={(v: string) => updateEducation(edu.id, 'endDate', v)}
                              placeholder="YYYY"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Info size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Showcase your best work and side projects</span>
                  </div>
                  <button
                    onClick={addProject}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-50 text-orange-600 rounded-2xl hover:bg-orange-100 transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <Plus size={16} /> Add Project
                  </button>
                </div>

                <div className="space-y-6">
                  {data.projects.map((proj) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={proj.id} 
                      className="p-8 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] relative group hover:bg-white hover:border-orange-100 transition-all shadow-sm hover:shadow-xl hover:shadow-orange-500/5"
                    >
                      <button
                        onClick={() => removeProject(proj.id)}
                        className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField 
                          label="Project Name" 
                          value={proj.name} 
                          onChange={(v: string) => updateProject(proj.id, 'name', v)}
                          placeholder="e.g. AI Portfolio Builder"
                        />
                        <InputField 
                          label="Project Link (Optional)" 
                          value={proj.link} 
                          onChange={(v: string) => updateProject(proj.id, 'link', v)}
                          placeholder="github.com/username/project"
                        />
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Project Description</label>
                          <textarea
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl p-6 text-sm font-medium text-gray-900 outline-none transition-all focus:ring-4 focus:ring-red-500/5 focus:border-red-500/50 h-32 resize-none leading-relaxed"
                            placeholder="What did you build and what technologies were used?"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 text-gray-400 px-1">
                  <Info size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Add your technical and soft skills</span>
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Skills (Comma Separated)</label>
                  <textarea
                    placeholder="React, TypeScript, Node.js, UI Design, Project Management..."
                    value={data.skills.join(', ')}
                    onChange={(e) => onChange({ ...data, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '') })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-8 text-sm font-bold text-gray-900 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-red-500/5 focus:border-red-500/50 h-48 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      key={skill}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      {skill}
                      <button 
                        onClick={() => onChange({ ...data, skills: data.skills.filter(s => s !== skill) })}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Form Footer Controls */}
        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <button
            onClick={prevSection}
            disabled={activeSection === 'personal'}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all disabled:opacity-0"
          >
            <ChevronLeft size={16} /> Back
          </button>
          
          <div className="flex gap-1">
            {sections.map((s) => (
              <div 
                key={s.id} 
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  activeSection === s.id ? "w-8 bg-red-500" : "bg-gray-200"
                )} 
              />
            ))}
          </div>

          <button
            onClick={nextSection}
            disabled={activeSection === 'skills'}
            className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-0"
          >
            Next Step <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
