import React, { useState } from 'react';
import { TemplateId, ResumeSettings } from '../types';
import { cn } from '../lib/utils';
import { Palette, Type, Layout, Square, Check, ChevronRight, ChevronLeft, Settings2, Sparkles, Plus, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomizerProps {
  settings: ResumeSettings;
  onSettingsChange: (settings: ResumeSettings) => void;
}

const templates: { id: TemplateId; label: string; description: string; color: string; recommendedFor: string }[] = [
  { id: 'modern', label: 'Modern', description: 'Clean, balanced and professional', color: '#3b82f6', recommendedFor: 'General Professionals' },
  { id: 'classic', label: 'Classic', description: 'Traditional academic layout', color: '#1f2937', recommendedFor: 'Academic & Legal' },
  { id: 'minimal', label: 'Minimal', description: 'Focus on content and clarity', color: '#6b7280', recommendedFor: 'Designers & Minimalists' },
  { id: 'sidebar', label: 'Sidebar', description: 'Modern split-view layout', color: '#8b5cf6', recommendedFor: 'Tech & Management' },
  { id: 'creative', label: 'Creative', description: 'Bold and unique design', color: '#ec4899', recommendedFor: 'Creative Industries' },
  { id: 'professional', label: 'Professional', description: 'Corporate standard layout', color: '#111827', recommendedFor: 'Executives' },
  { id: 'elegant', label: 'Elegant', description: 'Sophisticated and refined', color: '#92400e', recommendedFor: 'Luxury & Hospitality' },
  { id: 'bold', label: 'Bold', description: 'High-impact visual style', color: '#ef4444', recommendedFor: 'Sales & Marketing' },
  { id: 'compact', label: 'Compact', description: 'Maximize space efficiency', color: '#059669', recommendedFor: 'Experienced Professionals' },
  { id: 'tech', label: 'Tech', description: 'Developer-focused aesthetic', color: '#10b981', recommendedFor: 'Software Engineers' },
  { id: 'canva', label: 'Canva', description: 'Modern graphic design feel', color: '#06b6d4', recommendedFor: 'Social Media Managers' },
  { id: 'visual', label: 'Visual', description: 'Data-driven visual layout', color: '#f59e0b', recommendedFor: 'Analysts & Researchers' },
  { id: 'modern_dark', label: 'Modern Dark', description: 'Sleek dark mode professional', color: '#1a1a1a', recommendedFor: 'Creative Tech' },
  { id: 'infographic', label: 'Infographic', description: 'Visual-heavy storytelling', color: '#f97316', recommendedFor: 'Marketing & PR' },
  { id: 'executive', label: 'Executive', description: 'High-level corporate focus', color: '#1e3a8a', recommendedFor: 'C-Suite & Directors' },
  { id: 'academic', label: 'Academic', description: 'Multi-page academic focus', color: '#4b5563', recommendedFor: 'Researchers & PhDs' },
  { id: 'minimalist_pro', label: 'Minimalist Pro', description: 'Ultra-clean high-end design', color: '#000000', recommendedFor: 'Senior Designers' },
  { id: 'creative_vibrant', label: 'Creative Vibrant', description: 'High-energy artistic style', color: '#f43f5e', recommendedFor: 'Artists & Creators' },
  { id: 'legal_standard', label: 'Legal Standard', description: 'Strict formal legal layout', color: '#0f172a', recommendedFor: 'Lawyers & Legal' },
];

const TemplatePreview: React.FC<{ id: TemplateId; active: boolean }> = ({ id, active }) => {
  const layouts: Record<TemplateId, React.ReactNode> = {
    modern: (
      <div className="w-full h-full flex flex-col gap-1 p-1 bg-white">
        <div className="h-1/4 bg-gray-300 rounded-sm" />
        <div className="flex-1 flex gap-1">
          <div className="flex-1 bg-gray-100 rounded-sm" />
          <div className="w-1/3 bg-gray-200 rounded-sm" />
        </div>
      </div>
    ),
    classic: (
      <div className="w-full h-full flex gap-1 p-1 bg-white">
        <div className="w-1/3 bg-gray-200 rounded-sm flex flex-col gap-1">
           <div className="w-4 h-4 rounded-full bg-gray-400 mx-auto mt-1" />
           <div className="h-1 bg-gray-300 w-3/4 mx-auto" />
        </div>
        <div className="flex-1 bg-gray-100 rounded-sm" />
      </div>
    ),
    minimal: (
      <div className="w-full h-full flex flex-col gap-1 p-1 bg-white">
        <div className="h-2 bg-gray-300 w-1/2 mx-auto rounded-sm" />
        <div className="h-1 bg-gray-200 w-full rounded-sm" />
        <div className="h-1 bg-gray-200 w-full rounded-sm" />
        <div className="h-1 bg-gray-200 w-full rounded-sm" />
      </div>
    ),
    sidebar: (
      <div className="w-full h-full flex gap-1 p-1 bg-white">
        <div className="w-1/4 bg-gray-800 rounded-sm" />
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-2 bg-gray-300 rounded-sm" />
          <div className="flex-1 bg-gray-100 rounded-sm" />
        </div>
      </div>
    ),
    creative: (
      <div className="w-full h-full flex flex-col gap-1 p-1 bg-white overflow-hidden">
        <div className="h-1/3 bg-pink-100 rounded-sm relative">
          <div className="absolute -right-2 -top-2 w-6 h-6 bg-pink-200 rounded-full" />
        </div>
        <div className="flex-1 bg-gray-50 rounded-sm" />
      </div>
    ),
    professional: (
      <div className="w-full h-full flex flex-col gap-1 p-1 bg-white">
        <div className="h-1/5 bg-gray-900 rounded-sm" />
        <div className="flex-1 flex gap-1">
          <div className="w-1/4 bg-gray-100 rounded-sm" />
          <div className="flex-1 bg-gray-50 rounded-sm" />
        </div>
      </div>
    ),
    elegant: (
      <div className="w-full h-full flex flex-col gap-1 p-1 bg-white items-center">
        <div className="w-6 h-6 rounded-full bg-gray-300 mt-1" />
        <div className="h-1 bg-gray-400 w-1/2" />
        <div className="flex-1 w-full bg-gray-50 rounded-sm" />
      </div>
    ),
    bold: (
      <div className="w-full h-full flex flex-col bg-white">
        <div className="h-1/3 bg-blue-600 p-1">
          <div className="h-full bg-white/20 rounded-sm" />
        </div>
        <div className="flex-1 p-1 bg-gray-50" />
      </div>
    ),
    compact: (
      <div className="w-full h-full flex flex-col gap-0.5 p-1 bg-white">
        <div className="grid grid-cols-2 gap-0.5">
          <div className="h-1 bg-gray-300" />
          <div className="h-1 bg-gray-300" />
        </div>
        <div className="h-1 bg-gray-200 w-full" />
        <div className="h-1 bg-gray-200 w-full" />
        <div className="h-1 bg-gray-200 w-full" />
      </div>
    ),
    tech: (
      <div className="w-full h-full flex flex-col gap-1 p-1 bg-gray-900">
        <div className="h-1 bg-green-500/50 w-1/2" />
        <div className="h-1 bg-green-500/20 w-full" />
        <div className="h-1 bg-green-500/20 w-full" />
      </div>
    ),
    canva: (
      <div className="w-full h-full flex gap-0 p-0 bg-white overflow-hidden">
        <div className="w-1/3 bg-blue-600" />
        <div className="flex-1 p-1 flex flex-col gap-1">
          <div className="h-2 bg-gray-100 rounded-sm" />
          <div className="flex-1 bg-gray-50 rounded-sm" />
        </div>
      </div>
    ),
    visual: (
      <div className="w-full h-full flex flex-col gap-1 p-1 bg-gray-50">
        <div className="h-1/4 bg-white rounded-md shadow-sm" />
        <div className="flex-1 grid grid-cols-2 gap-1">
          <div className="bg-white rounded-md shadow-sm" />
          <div className="bg-white rounded-md shadow-sm" />
        </div>
      </div>
    ),
    modern_dark: (
      <div className="w-full h-full flex flex-col gap-1 p-1 bg-gray-900">
        <div className="h-1/4 bg-gray-800 rounded-sm" />
        <div className="flex-1 flex gap-1">
          <div className="flex-1 bg-gray-800 rounded-sm" />
          <div className="w-1/3 bg-gray-700 rounded-sm" />
        </div>
      </div>
    ),
    infographic: (
      <div className="w-full h-full flex flex-col gap-1 p-1 bg-white">
        <div className="h-4 bg-orange-500 rounded-sm" />
        <div className="grid grid-cols-3 gap-1">
          <div className="h-8 bg-gray-100 rounded-sm" />
          <div className="h-8 bg-gray-100 rounded-sm" />
          <div className="h-8 bg-gray-100 rounded-sm" />
        </div>
      </div>
    ),
    executive: (
      <div className="w-full h-full flex flex-col gap-1 p-1 bg-white border-t-4 border-blue-900">
        <div className="h-6 bg-gray-50 rounded-sm" />
        <div className="flex-1 bg-gray-50 rounded-sm" />
      </div>
    ),
    academic: (
      <div className="w-full h-full flex flex-col gap-1 p-1 bg-white">
        <div className="h-2 bg-gray-200 w-full" />
        <div className="flex-1 border border-gray-100 rounded-sm p-1">
          <div className="h-full bg-gray-50 rounded-sm" />
        </div>
      </div>
    ),
    minimalist_pro: (
      <div className="w-full h-full flex flex-col gap-2 p-2 bg-white items-center justify-center">
        <div className="w-1/2 h-1 bg-black" />
        <div className="w-full h-0.5 bg-gray-100" />
        <div className="w-full h-0.5 bg-gray-100" />
      </div>
    ),
    creative_vibrant: (
      <div className="w-full h-full flex flex-col bg-rose-50 p-1 gap-1">
        <div className="h-1/3 bg-rose-500 rounded-sm" />
        <div className="flex-1 bg-white rounded-sm" />
      </div>
    ),
    legal_standard: (
      <div className="w-full h-full flex flex-col gap-1 p-2 bg-white border border-gray-200">
        <div className="h-1 bg-gray-900 w-1/3 mx-auto" />
        <div className="h-0.5 bg-gray-200 w-full" />
        <div className="h-0.5 bg-gray-200 w-full" />
      </div>
    ),
  };

  return (
    <div className={cn(
      "aspect-[1/1.4] w-full border-2 rounded-2xl overflow-hidden transition-all relative group",
      active ? "border-red-500 ring-4 ring-red-500/5" : "border-gray-100 hover:border-gray-200"
    )}>
      {layouts[id]}
      <div className={cn(
        "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
        active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        {active && (
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 shadow-xl scale-110">
            <Check size={18} strokeWidth={3} />
          </div>
        )}
      </div>
    </div>
  );
};

const fonts = [
  { name: 'Modern Sans', value: 'Inter, sans-serif' },
  { name: 'Classic Serif', value: 'Georgia, serif' },
  { name: 'Technical Mono', value: 'var(--font-mono)' },
  { name: 'Elegant Display', value: 'Playfair Display, serif' },
  { name: 'Clean Geometric', value: 'system-ui, sans-serif' },
];

const colors = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#1f2937', // Dark
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

const bgColors = [
  '#ffffff', // White
  '#f9fafb', // Gray 50
  '#fffbeb', // Amber 50 (Cream)
  '#f0f9ff', // Blue 50
  '#fdf2f8', // Pink 50
  '#ecfdf5', // Emerald 50
  '#1a1a1a', // Dark
];

export const Customizer: React.FC<CustomizerProps> = ({ settings, onSettingsChange }) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'colors' | 'typography'>('layout');

  return (
    <div className="space-y-8">
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl mb-8">
        <button 
          onClick={() => setActiveTab('layout')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
            activeTab === 'layout' ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <Layout size={14} /> Layout
        </button>
        <button 
          onClick={() => setActiveTab('colors')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
            activeTab === 'colors' ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <Palette size={14} /> Colors
        </button>
        <button 
          onClick={() => setActiveTab('typography')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
            activeTab === 'typography' ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <Type size={14} /> Fonts
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'layout' && (
          <motion.div
            key="layout-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="relative group/carousel">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Select Template</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const el = document.getElementById('template-scroll');
                      if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
                    }}
                    className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('template-scroll');
                      if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
                    }}
                    className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div 
                id="template-scroll"
                className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8 pt-2 px-1"
                style={{ scrollPadding: '24px' }}
              >
                {templates.map((t) => (
                  <motion.button
                    whileHover={{ y: -5 }}
                    key={t.id}
                    onClick={() => onSettingsChange({ ...settings, templateId: t.id })}
                    className={cn(
                      "flex-none w-[240px] snap-start group flex flex-col gap-4 text-left transition-all",
                      settings.templateId === t.id ? "opacity-100" : "opacity-70 hover:opacity-100"
                    )}
                  >
                    <div className="relative">
                      <TemplatePreview id={t.id} active={settings.templateId === t.id} />
                      {settings.templateId === t.id && (
                        <div className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-xl z-10 ring-4 ring-white">
                          <Check size={14} strokeWidth={4} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                    </div>
                    <div className="px-1">
                      <div className={cn(
                        "text-[11px] font-black uppercase tracking-widest transition-colors flex items-center gap-2",
                        settings.templateId === t.id ? "text-red-600" : "text-gray-900"
                      )}>
                        {t.label}
                        {settings.templateId === t.id && <Sparkles size={12} className="animate-pulse" />}
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium mt-1 leading-relaxed">{t.description}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Featured / Active Template Detail */}
            <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-44 flex-none">
                  <TemplatePreview id={settings.templateId} active={true} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
                    <Settings2 size={12} /> Currently Active
                  </div>
                  <h4 className="text-2xl font-black uppercase tracking-tight mb-2">
                    {templates.find(t => t.id === settings.templateId)?.label} Layout
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-white/10 rounded-md text-[8px] font-bold uppercase tracking-wider text-gray-300 border border-white/5 flex items-center gap-1.5">
                      <Layout size={10} className="text-red-500" />
                      Recommended for: {templates.find(t => t.id === settings.templateId)?.recommendedFor}
                    </span>
                    <span className="px-2 py-1 bg-white/10 rounded-md text-[8px] font-bold uppercase tracking-wider text-gray-300 border border-white/5 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: templates.find(t => t.id === settings.templateId)?.color }} />
                      Primary Accent: {templates.find(t => t.id === settings.templateId)?.color}
                    </span>
                    <span className="px-2 py-1 bg-white/10 rounded-md text-[8px] font-bold uppercase tracking-wider text-gray-300 border border-white/5 flex items-center gap-1.5">
                      <Sparkles size={10} className="text-yellow-500" />
                      AI Optimized
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-md">
                    {templates.find(t => t.id === settings.templateId)?.description}. 
                    This template is optimized for high readability and professional impact.
                  </p>
                </div>
                <div className="flex-none">
                   <div className="p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Quick Tip</div>
                      <div className="text-[11px] font-bold text-gray-300 max-w-[150px]">
                        Try changing the primary color to match your industry standards.
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'colors' && (
          <motion.div
            key="colors-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Primary Branding</h3>
                <div className="text-[9px] font-bold text-gray-300">Used for headers and accents</div>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => onSettingsChange({ ...settings, primaryColor: c })}
                    style={{ backgroundColor: c }}
                    className={cn(
                      "aspect-square rounded-2xl border-4 transition-all hover:scale-110",
                      settings.primaryColor === c ? "border-white shadow-xl ring-2 ring-red-500" : "border-transparent"
                    )}
                  />
                ))}
                <div className="relative aspect-square rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-100 transition-all">
                  <input 
                    type="color" 
                    value={settings.primaryColor}
                    onChange={(e) => onSettingsChange({ ...settings, primaryColor: e.target.value })}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                  />
                  <Plus size={16} className="text-gray-400" />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Paper Background</h3>
                <div className="text-[9px] font-bold text-gray-300">Canvas color</div>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
                {bgColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => onSettingsChange({ ...settings, backgroundColor: c })}
                    style={{ backgroundColor: c }}
                    className={cn(
                      "aspect-square rounded-2xl border-2 transition-all border-gray-100 hover:scale-110",
                      settings.backgroundColor === c ? "ring-4 ring-gray-900/5 border-gray-900 shadow-lg" : ""
                    )}
                  />
                ))}
              </div>
            </section>

            <section className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                <Square size={14} /> Photo Border Settings
              </h3>
              <div className="space-y-6">
                <div className="flex gap-2">
                  {(['none', 'solid', 'dashed', 'dotted'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => onSettingsChange({ ...settings, photoBorderStyle: style })}
                      className={cn(
                        "flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl border transition-all",
                        settings.photoBorderStyle === style
                          ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                          : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
                
                {settings.photoBorderStyle !== 'none' && (
                  <div className="flex items-center gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-400">
                        <span>Border Width</span>
                        <span>{settings.photoBorderWidth}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="20" 
                        value={settings.photoBorderWidth}
                        onChange={(e) => onSettingsChange({ ...settings, photoBorderWidth: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                      />
                    </div>
                    <div className="relative w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                      <input 
                        type="color" 
                        value={settings.photoBorderColor}
                        onChange={(e) => onSettingsChange({ ...settings, photoBorderColor: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                      />
                      <div className="w-6 h-6 rounded-lg shadow-inner" style={{ backgroundColor: settings.photoBorderColor }} />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'typography' && (
          <motion.div
            key="typography-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Select Typography</div>
            {fonts.map((f) => (
              <button
                key={f.name}
                onClick={() => onSettingsChange({ ...settings, fontFamily: f.value })}
                className={cn(
                  "w-full p-6 rounded-2xl border transition-all text-left flex items-center justify-between group",
                  settings.fontFamily === f.value
                    ? "bg-gray-900 text-white border-gray-900 shadow-xl scale-[1.02]"
                    : "bg-white text-gray-600 border-gray-100 hover:border-gray-300"
                )}
              >
                <div className="space-y-1">
                  <div className="text-sm font-bold" style={{ fontFamily: f.value }}>{f.name}</div>
                  <div className="text-[10px] opacity-50 font-medium">The quick brown fox jumps over the lazy dog</div>
                </div>
                {settings.fontFamily === f.value && <Check size={18} className="text-red-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
