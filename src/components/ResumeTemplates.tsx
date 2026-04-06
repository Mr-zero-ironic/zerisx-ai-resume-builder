import React from 'react';
import { ResumeData, TemplateId } from '../types';
import { cn } from '../lib/utils';

interface TemplateProps {
  data: ResumeData;
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  photoBorderStyle: 'solid' | 'dashed' | 'dotted' | 'none';
  photoBorderColor: string;
  photoBorderWidth: number;
  padding?: number;
}

const getDynamicPadding = (data: ResumeData) => {
  const summaryLength = data.personalInfo.summary.length;
  const experienceCount = data.experience.length;
  const experienceDescLength = data.experience.reduce((acc, exp) => acc + exp.description.length, 0);
  const educationCount = data.education.length;
  const projectCount = data.projects.length;
  const skillCount = data.skills.length;

  const totalContentScore = summaryLength + experienceDescLength + (experienceCount * 200) + (educationCount * 100) + (projectCount * 150) + (skillCount * 20);

  if (totalContentScore < 1000) return 30;
  if (totalContentScore < 1500) return 25;
  if (totalContentScore > 4000) return 12;
  if (totalContentScore > 3000) return 15;
  
  return 20;
};

const Photo: React.FC<{ 
  src?: string; 
  className?: string; 
  borderStyle?: string; 
  borderColor?: string; 
  borderWidth?: number;
  style?: React.CSSProperties;
}> = ({ src, className, borderStyle, borderColor, borderWidth, style }) => {
  if (!src) return null;
  return (
    <div 
      className={cn("overflow-hidden shrink-0", className)}
      style={{ 
        borderStyle: borderStyle || 'none',
        borderColor: borderColor || 'transparent',
        borderWidth: borderStyle && borderStyle !== 'none' ? `${borderWidth || 0}px` : 0,
        ...style 
      }}
    >
      <img src={src} alt="Profile" className="w-full h-full object-cover" />
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; color: string; variant?: 'solid' | 'outline' | 'simple' }> = ({ title, color, variant = 'simple' }) => {
  if (variant === 'solid') {
    return (
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] px-4 py-2 text-white" style={{ backgroundColor: color }}>{title}</h2>
        <div className="flex-1 h-px opacity-20" style={{ backgroundColor: color }} />
      </div>
    );
  }
  if (variant === 'outline') {
    return (
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] px-4 py-2 border-2" style={{ borderColor: color, color }}>{title}</h2>
        <div className="flex-1 h-px opacity-20" style={{ backgroundColor: color }} />
      </div>
    );
  }
  return (
    <div className="mb-4">
      <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-2" style={{ color }}>{title}</h2>
      <div className="h-1 w-12" style={{ backgroundColor: color }} />
    </div>
  );
};

const ModernTemplate: React.FC<TemplateProps> = ({ data, primaryColor, backgroundColor, fontFamily, photoBorderStyle, photoBorderColor, photoBorderWidth, padding }) => {
  const dynamicPadding = padding || getDynamicPadding(data);
  return (
    <div style={{ fontFamily, backgroundColor, padding: `${dynamicPadding}mm` }} className="flex flex-col space-y-10 min-h-[297mm]">
      <header className="flex items-center gap-8 border-b-8 pb-8" style={{ borderColor: primaryColor }}>
      <Photo 
        src={data.personalInfo.photo} 
        className="w-32 h-32 rounded-2xl shadow-xl" 
        borderStyle={photoBorderStyle}
        borderColor={photoBorderColor}
        borderWidth={photoBorderWidth}
      />
      <div className="flex-1">
        <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4">{data.personalInfo.fullName}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-widest opacity-60">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.location}</span>
          {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
        </div>
      </div>
    </header>

    <section className="bg-white/50 p-6 rounded-2xl border border-black/5 shadow-sm">
      <SectionHeader title="Summary" color={primaryColor} />
      <p className="text-sm leading-relaxed text-gray-700 font-medium">{data.personalInfo.summary}</p>
    </section>

    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-8 space-y-10">
        <section>
          <SectionHeader title="Experience" color={primaryColor} variant="solid" />
          <div className="space-y-8">
            {data.experience.map(exp => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-gray-100">
                <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{exp.position}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-sm font-bold opacity-60 mb-3">{exp.company}</div>
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {data.projects.length > 0 && (
          <section>
            <SectionHeader title="Projects" color={primaryColor} variant="solid" />
            <div className="grid grid-cols-2 gap-6">
              {data.projects.map(proj => (
                <div key={proj.id} className="bg-white p-4 rounded-xl shadow-sm border border-black/5">
                  <h3 className="font-black text-gray-900 mb-1 uppercase text-xs tracking-wider">{proj.name}</h3>
                  {proj.link && <div className="text-[10px] font-bold opacity-40 mb-2 truncate">{proj.link}</div>}
                  <p className="text-xs leading-relaxed text-gray-600 line-clamp-3">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-4 space-y-10">
        <section className="bg-gray-900 text-white p-6 rounded-3xl">
          <SectionHeader title="Skills" color="white" />
          <div className="flex flex-wrap gap-2 mt-4">
            {data.skills.map((skill, i) => (
              <span key={i} className="bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">{skill}</span>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Education" color={primaryColor} />
          <div className="space-y-6">
            {data.education.map(edu => (
              <div key={edu.id}>
                <div className="font-black text-sm text-gray-900 uppercase tracking-tight leading-tight">{edu.degree}</div>
                <div className="text-xs font-bold opacity-50 mt-1">{edu.school}</div>
                <div className="text-[10px] font-bold opacity-30 mt-1 uppercase tracking-widest">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

const ClassicTemplate: React.FC<TemplateProps> = ({ data, primaryColor, backgroundColor, fontFamily, photoBorderStyle, photoBorderColor, photoBorderWidth, padding }) => {
  const dynamicPadding = padding || getDynamicPadding(data);
  return (
    <div style={{ fontFamily, backgroundColor, padding: `${dynamicPadding}mm` }} className="flex flex-col space-y-10 min-h-[297mm]">
      <header className="flex flex-col items-center text-center space-y-6 border-b-2 pb-10" style={{ borderColor: primaryColor }}>
      <Photo 
        src={data.personalInfo.photo} 
        className="w-40 h-40 rounded-full shadow-2xl" 
        borderStyle={photoBorderStyle}
        borderColor={photoBorderColor}
        borderWidth={photoBorderWidth}
      />
      <div>
        <h1 className="text-5xl font-serif font-bold text-gray-900 tracking-tight">{data.personalInfo.fullName}</h1>
        <div className="flex justify-center gap-6 text-sm mt-4 text-gray-500 font-medium italic">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.location}</span>
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
        </div>
      </div>
    </header>

    <div className="grid grid-cols-12 gap-12">
      <div className="col-span-4 space-y-10 border-r pr-10 border-gray-100">
        <section>
          <SectionHeader title="Contact" color={primaryColor} />
          <div className="space-y-4 text-sm text-gray-600">
            <p className="flex flex-col">
              <span className="font-bold uppercase text-[10px] tracking-widest opacity-40">Email</span>
              {data.personalInfo.email}
            </p>
            <p className="flex flex-col">
              <span className="font-bold uppercase text-[10px] tracking-widest opacity-40">Phone</span>
              {data.personalInfo.phone}
            </p>
            <p className="flex flex-col">
              <span className="font-bold uppercase text-[10px] tracking-widest opacity-40">Location</span>
              {data.personalInfo.location}
            </p>
            {data.personalInfo.website && (
              <p className="flex flex-col">
                <span className="font-bold uppercase text-[10px] tracking-widest opacity-40">Website</span>
                {data.personalInfo.website}
              </p>
            )}
            {data.personalInfo.linkedin && (
              <p className="flex flex-col">
                <span className="font-bold uppercase text-[10px] tracking-widest opacity-40">LinkedIn</span>
                {data.personalInfo.linkedin}
              </p>
            )}
          </div>
        </section>

        <section>
          <SectionHeader title="Education" color={primaryColor} />
          <div className="space-y-6">
            {data.education.map(edu => (
              <div key={edu.id}>
                <div className="font-bold text-gray-900 leading-tight">{edu.degree}</div>
                <div className="text-sm text-gray-500 mt-1">{edu.school}</div>
                <div className="text-xs opacity-40 mt-1">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Skills" color={primaryColor} />
          <div className="space-y-2">
            {data.skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                {skill}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="col-span-8 space-y-10">
        <section>
          <SectionHeader title="Profile" color={primaryColor} variant="outline" />
          <p className="text-sm leading-relaxed text-gray-700 font-serif italic">{data.personalInfo.summary}</p>
        </section>

        <section>
          <SectionHeader title="Experience" color={primaryColor} variant="outline" />
          <div className="space-y-8">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-xs font-bold opacity-40">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-sm font-bold text-gray-500 mb-3 italic">{exp.company}</div>
                <p className="text-sm leading-relaxed text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {data.projects.length > 0 && (
          <section>
            <SectionHeader title="Projects" color={primaryColor} variant="outline" />
            <div className="space-y-8">
              {data.projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{proj.name}</h3>
                    {proj.link && <span className="text-xs opacity-40">{proj.link}</span>}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 mt-2">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
    </div>
  );
};

const MinimalTemplate: React.FC<TemplateProps> = ({ data, primaryColor, backgroundColor, fontFamily, padding }) => {
  const dynamicPadding = padding || getDynamicPadding(data);
  return (
    <div style={{ fontFamily, backgroundColor, padding: `${dynamicPadding}mm` }} className="flex flex-col space-y-10 text-gray-800 min-h-[297mm]">
      <header>
      <h1 className="text-6xl font-light tracking-tighter text-gray-900">{data.personalInfo.fullName}</h1>
      <div className="mt-6 flex gap-6 text-[10px] font-bold tracking-[0.3em] uppercase opacity-40">
        <span>{data.personalInfo.email}</span>
        <span>{data.personalInfo.phone}</span>
        <span>{data.personalInfo.location}</span>
        {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
      </div>
    </header>
    <div className="h-px bg-gray-100 w-full" />
    <section className="grid grid-cols-4 gap-8">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 pt-1">About</div>
      <div className="col-span-3 text-sm leading-relaxed text-gray-600">{data.personalInfo.summary}</div>
    </section>
    <section className="grid grid-cols-4 gap-8">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 pt-1">Experience</div>
      <div className="col-span-3 space-y-10">
        {data.experience.map(exp => (
          <div key={exp.id}>
            <div className="font-bold text-lg text-gray-900">{exp.position}</div>
            <div className="text-xs font-medium opacity-50 mt-1 uppercase tracking-wider">{exp.company} <span className="mx-2">/</span> {exp.startDate} — {exp.endDate}</div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
    {data.projects.length > 0 && (
      <section className="grid grid-cols-4 gap-8">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 pt-1">Projects</div>
        <div className="col-span-3 space-y-10">
          {data.projects.map(proj => (
            <div key={proj.id}>
              <div className="font-bold text-lg text-gray-900">{proj.name}</div>
              {proj.link && <div className="text-[10px] font-medium opacity-40 mt-1 uppercase tracking-widest">{proj.link}</div>}
              <p className="mt-4 text-sm leading-relaxed text-gray-600">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}
    <section className="grid grid-cols-4 gap-4">
      <div className="text-xs font-bold uppercase tracking-wider opacity-40">Skills</div>
      <div className="col-span-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {data.skills.map((skill, i) => (
          <span key={i} style={{ color: primaryColor }}>{skill}</span>
        ))}
      </div>
    </section>
    </div>
  );
};

const SidebarTemplate: React.FC<TemplateProps> = ({ data, primaryColor, backgroundColor, fontFamily, photoBorderStyle, photoBorderColor, photoBorderWidth, padding }) => {
  const dynamicPadding = padding || getDynamicPadding(data);
  return (
    <div style={{ fontFamily }} className="flex min-h-[297mm]">
      <aside className="w-1/3 p-12 text-white flex flex-col space-y-10" style={{ backgroundColor: primaryColor }}>
      <div className="flex flex-col items-center text-center space-y-6">
        <Photo 
          src={data.personalInfo.photo} 
          className="w-40 h-40 rounded-3xl shadow-2xl" 
          borderStyle={photoBorderStyle}
          borderColor={photoBorderColor}
          borderWidth={photoBorderWidth}
        />
        <div>
          <h1 className="text-3xl font-black leading-tight uppercase tracking-tighter">{data.personalInfo.fullName}</h1>
          <div className="h-1 w-12 bg-white/40 mx-auto mt-4 rounded-full" />
        </div>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60 border-b border-white/10 pb-2">Contact</h2>
          <div className="space-y-4 text-xs font-medium">
            <div className="flex flex-col gap-1">
              <span className="opacity-40 uppercase text-[8px]">Email</span>
              {data.personalInfo.email}
            </div>
            <div className="flex flex-col gap-1">
              <span className="opacity-40 uppercase text-[8px]">Phone</span>
              {data.personalInfo.phone}
            </div>
            <div className="flex flex-col gap-1">
              <span className="opacity-40 uppercase text-[8px]">Location</span>
              {data.personalInfo.location}
            </div>
            {data.personalInfo.website && (
              <div className="flex flex-col gap-1">
                <span className="opacity-40 uppercase text-[8px]">Website</span>
                {data.personalInfo.website}
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex flex-col gap-1">
                <span className="opacity-40 uppercase text-[8px]">LinkedIn</span>
                {data.personalInfo.linkedin}
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60 border-b border-white/10 pb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-white/5">{skill}</span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60 border-b border-white/10 pb-2">Education</h2>
          <div className="space-y-6">
            {data.education.map(edu => (
              <div key={edu.id} className="bg-black/10 p-4 rounded-2xl border border-white/5">
                <div className="font-black text-[11px] uppercase tracking-tight leading-tight">{edu.degree}</div>
                <div className="text-[10px] opacity-60 mt-2 font-bold">{edu.school}</div>
                <div className="text-[8px] opacity-40 mt-1 uppercase tracking-widest">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
    <main className="w-2/3 p-16 flex flex-col space-y-12" style={{ backgroundColor }}>
      <section>
        <SectionHeader title="Profile" color={primaryColor} variant="solid" />
        <p className="text-sm leading-relaxed text-gray-700 font-medium">{data.personalInfo.summary}</p>
      </section>

      <section>
        <SectionHeader title="Experience" color={primaryColor} variant="solid" />
        <div className="space-y-10">
          {data.experience.map(exp => (
            <div key={exp.id} className="group">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{exp.position}</h3>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{exp.startDate} — {exp.endDate}</span>
              </div>
              <div className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: primaryColor }}>{exp.company}</div>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {data.projects.length > 0 && (
        <section>
          <SectionHeader title="Projects" color={primaryColor} variant="solid" />
          <div className="grid grid-cols-1 gap-6">
            {data.projects.map(proj => (
              <div key={proj.id} className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{proj.name}</h3>
                  {proj.link && <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{proj.link}</span>}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  </div>
  );
};

const ElegantTemplate: React.FC<TemplateProps> = ({ data, primaryColor, backgroundColor, fontFamily, photoBorderStyle, photoBorderColor, photoBorderWidth, padding }) => {
  const dynamicPadding = padding || getDynamicPadding(data);
  return (
    <div style={{ fontFamily, backgroundColor, padding: `${dynamicPadding}mm` }} className="flex flex-col space-y-12 min-h-[297mm]">
      <header className="text-center space-y-8 border-b-2 pb-12" style={{ borderColor: primaryColor }}>
      <Photo 
        src={data.personalInfo.photo} 
        className="w-48 h-48 rounded-full mx-auto shadow-2xl" 
        borderStyle={photoBorderStyle}
        borderColor={photoBorderColor}
        borderWidth={photoBorderWidth}
      />
      <div>
        <h1 className="text-6xl font-serif italic tracking-widest mb-6 text-gray-900">{data.personalInfo.fullName}</h1>
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50 flex justify-center gap-8">
          <span>{data.personalInfo.location}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.email}</span>
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
        </div>
      </div>
    </header>

    <section className="max-w-3xl mx-auto text-center italic text-lg leading-relaxed text-gray-600 font-serif px-10">
      <div className="text-4xl opacity-20 mb-[-20px] ml-[-40px]" style={{ color: primaryColor }}>“</div>
      {data.personalInfo.summary}
      <div className="text-4xl opacity-20 mt-[-20px] mr-[-40px] text-right" style={{ color: primaryColor }}>”</div>
    </section>

    <div className="grid grid-cols-12 gap-16">
      <div className="col-span-8 space-y-12">
        <section>
          <SectionHeader title="Experience" color={primaryColor} variant="outline" />
          <div className="space-y-10">
            {data.experience.map(exp => (
              <div key={exp.id} className="group">
                <div className="flex justify-between font-serif italic mb-2">
                  <span className="text-2xl text-gray-900">{exp.position}</span>
                  <span className="text-xs opacity-40 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">{exp.company}</div>
                <p className="text-sm leading-relaxed text-gray-600 font-serif">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {data.projects.length > 0 && (
          <section>
            <SectionHeader title="Projects" color={primaryColor} variant="outline" />
            <div className="space-y-10">
              {data.projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between font-serif italic mb-2">
                    <span className="text-2xl text-gray-900">{proj.name}</span>
                    {proj.link && <span className="text-[10px] opacity-40 uppercase tracking-widest">{proj.link}</span>}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 font-serif mt-4">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-4 space-y-12">
        <section>
          <SectionHeader title="Education" color={primaryColor} />
          <div className="space-y-8">
            {data.education.map(edu => (
              <div key={edu.id}>
                <div className="font-serif italic text-lg text-gray-900 leading-tight">{edu.degree}</div>
                <div className="text-[10px] uppercase tracking-widest font-black opacity-40 mt-2">{edu.school}</div>
                <div className="text-[9px] opacity-30 mt-1">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Expertise" color={primaryColor} />
          <div className="flex flex-col gap-3">
            {data.skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest opacity-60">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                {skill}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, primaryColor, backgroundColor, fontFamily, photoBorderStyle, photoBorderColor, photoBorderWidth, padding }) => {
  const dynamicPadding = padding || getDynamicPadding(data);
  return (
    <div style={{ fontFamily, backgroundColor, padding: `${dynamicPadding}mm` }} className="flex flex-col space-y-10 min-h-[297mm]">
      <header className="flex justify-between items-center bg-gray-900 text-white -m-[20mm] p-12 mb-10">
      <div className="flex items-center gap-8">
        <Photo 
          src={data.personalInfo.photo} 
          className="w-32 h-32 rounded-full" 
          borderStyle={photoBorderStyle}
          borderColor={photoBorderColor}
          borderWidth={photoBorderWidth}
        />
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4">{data.personalInfo.fullName}</h1>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
            <span>{data.personalInfo.location}</span>
            <span>{data.personalInfo.phone}</span>
            <span>{data.personalInfo.email}</span>
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          </div>
        </div>
      </div>
      <div className="h-16 w-1" style={{ backgroundColor: primaryColor }} />
    </header>

    <section className="border-l-4 pl-8 py-2" style={{ borderColor: primaryColor }}>
      <SectionHeader title="Professional Summary" color={primaryColor} />
      <p className="text-sm leading-relaxed text-gray-700 font-medium">{data.personalInfo.summary}</p>
    </section>

    <div className="grid grid-cols-12 gap-12">
      <div className="col-span-8 space-y-12">
        <section>
          <SectionHeader title="Work Experience" color={primaryColor} variant="solid" />
          <div className="space-y-10">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{exp.position}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-sm font-black uppercase tracking-widest mb-4 opacity-50">{exp.company}</div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {data.projects.length > 0 && (
          <section>
            <SectionHeader title="Key Projects" color={primaryColor} variant="solid" />
            <div className="space-y-10">
              {data.projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{proj.name}</h3>
                    {proj.link && <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{proj.link}</span>}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mt-4">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-4 space-y-12">
        <section>
          <SectionHeader title="Education" color={primaryColor} />
          <div className="space-y-8">
            {data.education.map(edu => (
              <div key={edu.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="font-black text-sm text-gray-900 uppercase tracking-tight leading-tight">{edu.degree}</div>
                <div className="text-xs font-bold opacity-50 mt-2">{edu.school}</div>
                <div className="text-[9px] font-bold opacity-30 mt-1 uppercase tracking-widest">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Core Skills" color={primaryColor} />
          <div className="grid grid-cols-1 gap-2">
            {data.skills.map((skill, i) => (
              <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{skill}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(dot => (
                    <div key={dot} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dot <= 4 ? primaryColor : '#e5e7eb' }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

const BoldTemplate: React.FC<TemplateProps> = ({ data, primaryColor, backgroundColor, fontFamily, photoBorderStyle, photoBorderColor, photoBorderWidth, padding }) => {
  const dynamicPadding = padding || getDynamicPadding(data);
  return (
    <div style={{ fontFamily, backgroundColor, padding: `${dynamicPadding}mm` }} className="flex flex-col space-y-12 min-h-[297mm]">
      <header className="bg-gray-900 text-white -m-[20mm] p-20 mb-12 flex items-center gap-12">
      <Photo 
        src={data.personalInfo.photo} 
        className="w-48 h-48 rounded-full shadow-2xl" 
        borderStyle={photoBorderStyle}
        borderColor={photoBorderColor}
        borderWidth={photoBorderWidth}
      />
      <div className="flex-1">
        <h1 className="text-7xl font-black uppercase tracking-tighter leading-none mb-6">{data.personalInfo.fullName}</h1>
        <div className="h-3 w-32 mb-8 rounded-full" style={{ backgroundColor: primaryColor }} />
        <div className="flex flex-wrap gap-x-10 gap-y-3 text-[11px] font-black tracking-[0.3em] uppercase opacity-50">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.location}</span>
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
        </div>
      </div>
    </header>

    <div className="space-y-16">
      <section>
        <div className="flex gap-16">
          <div className="w-1/4">
            <h2 className="font-black text-4xl uppercase tracking-tighter leading-none sticky top-10" style={{ color: primaryColor }}>Profile</h2>
          </div>
          <div className="w-3/4">
            <p className="text-xl font-bold leading-relaxed text-gray-800">{data.personalInfo.summary}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex gap-16">
          <div className="w-1/4">
            <h2 className="font-black text-4xl uppercase tracking-tighter leading-none sticky top-10" style={{ color: primaryColor }}>Work</h2>
          </div>
          <div className="w-3/4 flex flex-col space-y-12">
            {data.experience.map(exp => (
              <div key={exp.id} className="relative">
                <div className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">{exp.position}</div>
                <div className="text-xs font-black opacity-30 uppercase mb-6 tracking-[0.2em]">{exp.company} <span className="mx-3 opacity-20">/</span> {exp.startDate} - {exp.endDate}</div>
                <p className="text-base leading-relaxed text-gray-600 font-medium">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {data.projects.length > 0 && (
        <section>
          <div className="flex gap-16">
            <div className="w-1/4">
              <h2 className="font-black text-4xl uppercase tracking-tighter leading-none sticky top-10" style={{ color: primaryColor }}>Projects</h2>
            </div>
            <div className="w-3/4 flex flex-col space-y-12">
              {data.projects.map(proj => (
                <div key={proj.id}>
                  <div className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">{proj.name}</div>
                  {proj.link && <div className="text-xs font-black opacity-30 uppercase mb-4 tracking-[0.2em]">{proj.link}</div>}
                  <p className="text-base leading-relaxed text-gray-600 font-medium mt-4">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="flex gap-16">
          <div className="w-1/4">
            <h2 className="font-black text-4xl uppercase tracking-tighter leading-none sticky top-10" style={{ color: primaryColor }}>Education</h2>
          </div>
          <div className="w-3/4 grid grid-cols-2 gap-10">
            {data.education.map(edu => (
              <div key={edu.id} className="bg-gray-50 p-8 rounded-3xl border-2 border-gray-100">
                <div className="font-black text-lg text-gray-900 uppercase tracking-tight leading-tight">{edu.degree}</div>
                <div className="text-sm font-bold opacity-40 mt-3 uppercase tracking-widest">{edu.school}</div>
                <div className="text-[10px] font-black opacity-20 mt-2 uppercase tracking-[0.2em]">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};

const TechTemplate: React.FC<TemplateProps> = ({ data, primaryColor, backgroundColor, fontFamily, photoBorderStyle, photoBorderColor, photoBorderWidth, padding }) => {
  const dynamicPadding = padding || getDynamicPadding(data);
  return (
    <div style={{ fontFamily: 'var(--font-mono)', backgroundColor, padding: `${dynamicPadding}mm` }} className="text-[10px] flex flex-col space-y-8 text-green-500 min-h-[297mm] bg-black">
      <header className="border-2 border-green-500/30 p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <div className="w-full h-full border-b border-l border-green-500" />
      </div>
      <div className="flex items-center gap-8">
        <Photo 
          src={data.personalInfo.photo} 
          className="w-32 h-32 grayscale contrast-125" 
          borderStyle={photoBorderStyle}
          borderColor={photoBorderColor}
          borderWidth={photoBorderWidth}
        />
        <div className="flex-1">
          <div className="text-4xl font-bold mb-4 tracking-tighter uppercase animate-pulse">{'>'} {data.personalInfo.fullName}</div>
          <div className="opacity-60 tracking-[0.2em] font-mono">
            {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}
          {data.personalInfo.linkedin && ` | ${data.personalInfo.linkedin}`}
          </div>
          {data.personalInfo.website && <div className="opacity-40 mt-2 font-mono">{data.personalInfo.website}</div>}
        </div>
      </div>
    </header>

    <section>
      <div className="font-bold mb-4 text-xs tracking-[0.3em] uppercase bg-green-500/10 px-4 py-1 inline-block" style={{ color: primaryColor }}>// [01] PROFESSIONAL_SUMMARY</div>
      <p className="leading-relaxed opacity-80 pl-4 border-l border-green-500/20">{data.personalInfo.summary}</p>
    </section>

    <section>
      <div className="font-bold mb-6 text-xs tracking-[0.3em] uppercase bg-green-500/10 px-4 py-1 inline-block" style={{ color: primaryColor }}>// [02] EXPERIENCE_LOG</div>
      <div className="space-y-8">
        {data.experience.map(exp => (
          <div key={exp.id} className="relative pl-8 group">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-green-500/20 group-hover:bg-green-500 transition-colors" />
            <div className="absolute left-[-4px] top-2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <div className="font-bold text-sm uppercase tracking-tight">{exp.position} @ {exp.company}</div>
            <div className="opacity-40 mt-2 font-mono text-[9px]">TIMESTAMP: [{exp.startDate} - {exp.endDate}]</div>
            <p className="mt-4 leading-relaxed opacity-70 whitespace-pre-line">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>

    {data.projects.length > 0 && (
      <section>
        <div className="font-bold mb-6 text-xs tracking-[0.3em] uppercase bg-green-500/10 px-4 py-1 inline-block" style={{ color: primaryColor }}>// [03] PROJECTS_REPOSITORY</div>
        <div className="grid grid-cols-2 gap-6">
          {data.projects.map(proj => (
            <div key={proj.id} className="border border-green-500/10 p-6 hover:border-green-500/40 transition-colors bg-green-500/5">
              <div className="font-bold text-xs uppercase mb-2 tracking-wider">{proj.name}</div>
              {proj.link && <div className="opacity-30 text-[8px] mt-1 font-mono truncate">{proj.link}</div>}
              <p className="mt-4 leading-relaxed opacity-60 text-[9px] line-clamp-4">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    <div className="grid grid-cols-2 gap-10">
      <section>
        <div className="font-bold mb-4 text-xs tracking-[0.3em] uppercase" style={{ color: primaryColor }}>// [04] EDUCATION</div>
        <div className="space-y-4">
          {data.education.map(edu => (
            <div key={edu.id} className="bg-green-500/5 p-4 border-l-2 border-green-500/20">
              <div className="font-bold uppercase tracking-tight">{edu.degree}</div>
              <div className="opacity-60 mt-1">{edu.school}</div>
              <div className="opacity-30 text-[8px] mt-1">[{edu.startDate} - {edu.endDate}]</div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="font-bold mb-4 text-xs tracking-[0.3em] uppercase" style={{ color: primaryColor }}>// [05] TECH_STACK</div>
        <div className="flex flex-wrap gap-3">
          {data.skills.map((skill, i) => (
            <span key={i} className="px-3 py-1 border border-green-500/20 hover:bg-green-500 hover:text-black transition-all cursor-default">
              {skill.toUpperCase()}
            </span>
          ))}
        </div>
      </section>
    </div>
    </div>
  );
};

const CreativeTemplate: React.FC<TemplateProps> = ({ data, primaryColor, backgroundColor, fontFamily, photoBorderStyle, photoBorderColor, photoBorderWidth, padding }) => {
  const dynamicPadding = padding || getDynamicPadding(data);
  return (
    <div style={{ fontFamily, backgroundColor, padding: `${dynamicPadding}mm` }} className="flex flex-col space-y-16 min-h-[297mm] overflow-hidden relative">
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-10" style={{ backgroundColor: primaryColor }} />
    <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-10" style={{ backgroundColor: primaryColor }} />

    <header className="flex items-center gap-12 relative z-10">
      <div className="relative">
        <div className="absolute inset-0 rounded-[40px] opacity-20" style={{ backgroundColor: primaryColor }} />
        <Photo 
          src={data.personalInfo.photo} 
          className="w-48 h-48 rounded-[40px] shadow-2xl relative z-10" 
          borderStyle={photoBorderStyle}
          borderColor={photoBorderColor}
          borderWidth={photoBorderWidth}
        />
      </div>
      <div className="flex-1">
        <h1 className="text-8xl font-black leading-[0.8] tracking-tighter mb-8 italic">
          {data.personalInfo.fullName.split(' ')[0]}<br/>
          <span style={{ color: primaryColor }}>{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</span>
        </h1>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.location}</span>
        </div>
      </div>
    </header>

    <div className="grid grid-cols-12 gap-16 relative z-10">
      <div className="col-span-7 space-y-16">
        <section>
          <h2 className="text-4xl font-black mb-10 italic tracking-tighter border-b-8 inline-block leading-none" style={{ borderColor: `${primaryColor}40` }}>Experience</h2>
          <div className="space-y-12">
            {data.experience.map(exp => (
              <div key={exp.id} className="relative group">
                <div className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">{exp.position}</div>
                <div className="text-xs font-black uppercase tracking-[0.2em] mb-6" style={{ color: primaryColor }}>{exp.company} <span className="mx-3 opacity-20">/</span> {exp.startDate} - {exp.endDate}</div>
                <p className="text-sm leading-relaxed text-gray-600 font-medium">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {data.projects.length > 0 && (
          <section>
            <h2 className="text-4xl font-black mb-10 italic tracking-tighter border-b-8 inline-block leading-none" style={{ borderColor: `${primaryColor}40` }}>Projects</h2>
            <div className="grid grid-cols-1 gap-10">
              {data.projects.map(proj => (
                <div key={proj.id} className="bg-white/40 backdrop-blur-sm p-8 rounded-[40px] border-2 border-white shadow-xl">
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{proj.name}</h3>
                    {proj.link && <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{proj.link}</span>}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-5 space-y-16">
        <section className="bg-gray-900 text-white p-10 rounded-[60px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
          <h2 className="text-2xl font-black mb-8 italic tracking-tighter uppercase">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, i) => (
              <span key={i} className="px-5 py-2.5 rounded-full border-2 font-black text-[9px] uppercase tracking-[0.2em] transition-all hover:scale-110" style={{ borderColor: `${primaryColor}60`, color: primaryColor }}>{skill}</span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-8 italic tracking-tighter uppercase">Education</h2>
          <div className="space-y-8">
            {data.education.map(edu => (
              <div key={edu.id} className="relative pl-6">
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full" style={{ backgroundColor: primaryColor }} />
                <div className="font-black text-lg text-gray-900 uppercase tracking-tight leading-tight">{edu.degree}</div>
                <div className="text-xs font-bold opacity-50 mt-2">{edu.school}</div>
                <div className="text-[9px] font-black opacity-20 mt-1 uppercase tracking-widest">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-8 rounded-[40px] border-2 border-dashed border-gray-200">
          <h2 className="text-xl font-black mb-4 italic tracking-tighter uppercase opacity-30">About Me</h2>
          <p className="text-sm leading-relaxed text-gray-500 font-medium italic">
            {data.personalInfo.summary}
          </p>
        </section>
      </div>
    </div>
    </div>
  );
};

const CompactTemplate: React.FC<TemplateProps> = ({ data, primaryColor, backgroundColor, fontFamily, photoBorderStyle, photoBorderColor, photoBorderWidth, padding }) => {
  const dynamicPadding = padding || getDynamicPadding(data);
  return (
    <div style={{ fontFamily, backgroundColor, padding: `${dynamicPadding}mm` }} className="text-[9px] leading-tight flex flex-col space-y-4 min-h-[297mm]">
      <header className="flex justify-between items-center border-b-4 pb-3" style={{ borderColor: primaryColor }}>
      <div className="flex items-center gap-4">
        <Photo 
          src={data.personalInfo.photo} 
          className="w-16 h-16 rounded-lg shadow-lg" 
          borderStyle={photoBorderStyle}
          borderColor={photoBorderColor}
          borderWidth={photoBorderWidth}
        />
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">{data.personalInfo.fullName}</h1>
          <div className="flex gap-4 text-gray-500 font-bold uppercase tracking-widest text-[7px] mt-2">
            <span>{data.personalInfo.email}</span>
            <span>{data.personalInfo.phone}</span>
            <span>{data.personalInfo.location}</span>
          </div>
        </div>
      </div>
      <div className="text-right font-black uppercase tracking-[0.2em] text-[8px] opacity-30">Curriculum Vitae</div>
    </header>

    <section className="bg-gray-50 p-3 rounded-lg border border-gray-100">
      <p className="italic text-gray-600 leading-relaxed font-medium">{data.personalInfo.summary}</p>
    </section>

    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 space-y-4">
        <section>
          <SectionHeader title="Experience" color={primaryColor} />
          <div className="space-y-4">
            {data.experience.map(exp => (
              <div key={exp.id} className="border-l-2 pl-3 border-gray-100">
                <div className="flex justify-between font-black text-gray-900 uppercase tracking-tight">
                  <span>{exp.position}</span>
                  <span className="font-bold text-gray-300 text-[7px]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-[8px] font-bold opacity-50 mb-1 uppercase tracking-widest">{exp.company}</div>
                <p className="text-gray-600 leading-snug">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {data.projects.length > 0 && (
          <section>
            <SectionHeader title="Projects" color={primaryColor} />
            <div className="grid grid-cols-2 gap-3">
              {data.projects.map(proj => (
                <div key={proj.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex justify-between font-black text-gray-900 uppercase tracking-tight mb-1">
                    <span>{proj.name}</span>
                  </div>
                  <p className="text-gray-500 leading-snug text-[8px] line-clamp-3">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-4 space-y-4">
        <section>
          <SectionHeader title="Education" color={primaryColor} />
          <div className="space-y-3">
            {data.education.map(edu => (
              <div key={edu.id}>
                <div className="font-black text-gray-900 uppercase tracking-tight leading-tight">{edu.degree}</div>
                <div className="text-[8px] font-bold opacity-40 mt-1 uppercase tracking-widest">{edu.school}</div>
                <div className="text-[7px] opacity-20 mt-0.5">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Skills" color={primaryColor} />
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill, i) => (
              <span key={i} className="bg-gray-100 px-2 py-1 rounded text-[7px] font-black uppercase tracking-widest text-gray-600 border border-gray-200">{skill}</span>
            ))}
          </div>
        </section>

        <section className="pt-4">
          <div className="h-24 w-full bg-gray-900 rounded-2xl p-4 flex flex-col justify-end">
            <div className="text-[7px] font-black uppercase tracking-[0.3em] text-white opacity-40 mb-1">Portfolio</div>
            <div className="text-[8px] font-bold text-white truncate">{data.personalInfo.website || 'N/A'}</div>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

const CanvaTemplate: React.FC<TemplateProps> = ({ data, primaryColor, backgroundColor, fontFamily, photoBorderStyle, photoBorderColor, photoBorderWidth, padding }) => {
  const dynamicPadding = padding || getDynamicPadding(data);
  return (
    <div style={{ fontFamily, backgroundColor }} className="flex min-h-[297mm]">
      {/* Left Sidebar */}
      <div className="w-[80mm] flex flex-col space-y-8 text-white" style={{ backgroundColor: primaryColor, padding: `${dynamicPadding}mm` }}>
      <div className="flex flex-col items-center text-center space-y-4">
        <Photo 
          src={data.personalInfo.photo} 
          className="w-40 h-40 rounded-full shadow-2xl" 
          borderStyle={photoBorderStyle}
          borderColor={photoBorderColor}
          borderWidth={photoBorderWidth}
        />
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">{data.personalInfo.fullName}</h1>
          <div className="h-1 w-12 bg-white/30 mx-auto rounded-full" />
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-60">Contact</h2>
          <div className="space-y-3 text-[10px] font-bold">
            <div className="flex flex-col">
              <span className="opacity-50 uppercase text-[8px]">Email</span>
              <span>{data.personalInfo.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="opacity-50 uppercase text-[8px]">Phone</span>
              <span>{data.personalInfo.phone}</span>
            </div>
            <div className="flex flex-col">
              <span className="opacity-50 uppercase text-[8px]">Location</span>
              <span>{data.personalInfo.location}</span>
            </div>
            {data.personalInfo.website && (
              <div className="flex flex-col">
                <span className="opacity-50 uppercase text-[8px]">Website</span>
                <span className="truncate">{data.personalInfo.website}</span>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-60">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="bg-white/10 px-2 py-1 rounded text-[9px] font-bold border border-white/10 uppercase tracking-wider">{skill}</span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-60">Education</h2>
          <div className="space-y-4">
            {data.education.map(edu => (
              <div key={edu.id} className="space-y-1">
                <div className="font-black text-[11px] leading-tight">{edu.degree}</div>
                <div className="text-[9px] font-bold opacity-70">{edu.school}</div>
                <div className="text-[8px] opacity-40 uppercase tracking-widest">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-12 space-y-10 bg-white">
      <section>
        <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-4" style={{ color: primaryColor }}>
          Professional Profile
          <div className="flex-1 h-px bg-gray-100" />
        </h2>
        <p className="text-sm leading-relaxed text-gray-600 font-medium">{data.personalInfo.summary}</p>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-4" style={{ color: primaryColor }}>
          Work Experience
          <div className="flex-1 h-px bg-gray-100" />
        </h2>
        <div className="space-y-8">
          {data.experience.map(exp => (
            <div key={exp.id} className="group">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-300">{exp.position}</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{exp.startDate} — {exp.endDate}</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>{exp.company}</div>
              <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line border-l-2 border-gray-50 pl-4">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {data.projects.length > 0 && (
        <section>
          <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-4" style={{ color: primaryColor }}>
            Featured Projects
            <div className="flex-1 h-px bg-gray-100" />
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {data.projects.map(proj => (
              <div key={proj.id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300">
                <h3 className="font-black text-gray-900 mb-1 uppercase text-xs tracking-wider">{proj.name}</h3>
                {proj.link && <div className="text-[9px] font-bold opacity-30 mb-3 truncate">{proj.link}</div>}
                <p className="text-xs leading-relaxed text-gray-500 line-clamp-3">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
    </div>
  );
};

const VisualTemplate: React.FC<TemplateProps> = ({ data, primaryColor, backgroundColor, fontFamily, photoBorderStyle, photoBorderColor, photoBorderWidth, padding }) => {
  const dynamicPadding = padding || getDynamicPadding(data);
  return (
    <div style={{ fontFamily, backgroundColor, padding: `${dynamicPadding}mm` }} className="min-h-[297mm] space-y-10">
      <header className="grid grid-cols-12 gap-10 items-center bg-white p-10 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-transparent to-black/[0.02] rounded-full -mr-32 -mt-32" />
      <div className="col-span-3 relative z-10">
        <Photo 
          src={data.personalInfo.photo} 
          className="w-44 h-44 rounded-[40px] shadow-2xl" 
          borderStyle={photoBorderStyle}
          borderColor={photoBorderColor}
          borderWidth={photoBorderWidth}
        />
      </div>
      <div className="col-span-9 space-y-6 relative z-10">
        <h1 className="text-7xl font-black uppercase tracking-tighter leading-none" style={{ color: primaryColor }}>{data.personalInfo.fullName}</h1>
        <div className="flex flex-wrap gap-3">
          {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].map((info, i) => (
            <span key={i} className="bg-gray-50/80 backdrop-blur-sm px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 border border-gray-100/50">{info}</span>
          ))}
        </div>
      </div>
    </header>

    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-8 space-y-10">
        <section className="bg-white p-10 rounded-[48px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-50/50">
          <SectionHeader title="Experience" color={primaryColor} variant="solid" />
          <div className="space-y-12">
            {data.experience.map(exp => (
              <div key={exp.id} className="relative group">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">{exp.position}</h3>
                  <span className="text-[11px] font-black uppercase tracking-widest opacity-30">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-sm font-black uppercase tracking-widest mb-5" style={{ color: primaryColor }}>{exp.company}</div>
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line bg-gray-50/30 p-6 rounded-[32px] border border-gray-100/50">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {data.projects.length > 0 && (
          <section className="bg-white p-10 rounded-[48px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-50/50">
            <SectionHeader title="Projects" color={primaryColor} variant="solid" />
            <div className="grid grid-cols-2 gap-8">
              {data.projects.map(proj => (
                <div key={proj.id} className="group">
                  <div className="h-40 bg-gray-50 rounded-[32px] mb-5 overflow-hidden border border-gray-100 group-hover:border-transparent group-hover:shadow-2xl transition-all duration-500 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="text-5xl font-black opacity-5 group-hover:opacity-10 transition-all duration-500 scale-100 group-hover:scale-125" style={{ color: primaryColor }}>{proj.name[0]}</span>
                  </div>
                  <h3 className="font-black text-gray-900 mb-2 uppercase text-sm tracking-wider">{proj.name}</h3>
                  <p className="text-xs leading-relaxed text-gray-500 line-clamp-3 font-medium">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-4 space-y-10">
        <section className="bg-gray-900 text-white p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16" />
          <SectionHeader title="About" color="white" />
          <p className="text-sm leading-relaxed text-white/70 font-medium italic relative z-10">
            {data.personalInfo.summary}
          </p>
        </section>

        <section className="bg-white p-10 rounded-[48px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-50/50">
          <SectionHeader title="Skills" color={primaryColor} />
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, i) => (
              <span key={i} className="px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all hover:scale-105" style={{ borderColor: `${primaryColor}20`, color: primaryColor }}>{skill}</span>
            ))}
          </div>
        </section>

        <section className="bg-white p-10 rounded-[48px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-50/50">
          <SectionHeader title="Education" color={primaryColor} />
          <div className="space-y-8">
            {data.education.map(edu => (
              <div key={edu.id} className="group">
                <div className="font-black text-base text-gray-900 uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">{edu.degree}</div>
                <div className="text-xs font-black opacity-40 mt-2 uppercase tracking-widest">{edu.school}</div>
                <div className="text-[10px] font-bold opacity-20 mt-1.5">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

const ModernDarkTemplate: React.FC<TemplateProps> = ({ data, primaryColor, fontFamily }) => {
  const textColor = "#ffffff";
  const mutedTextColor = "#a1a1aa";
  const cardBg = "#27272a";
  const borderColor = "#3f3f46";

  const SectionHeader = ({ title, color = primaryColor, variant = 'default' }: { title: string; color?: string; variant?: 'default' | 'solid' }) => (
    <div className="mb-8 flex items-center gap-4">
      <h2 className={cn(
        "text-xs font-black uppercase tracking-[0.3em]",
        variant === 'solid' ? "px-4 py-1.5 rounded-lg text-white" : ""
      )} style={{ color: variant === 'solid' ? 'white' : color, backgroundColor: variant === 'solid' ? color : 'transparent' }}>
        {title}
      </h2>
      <div className="h-px flex-1 opacity-10" style={{ backgroundColor: color }} />
    </div>
  );

  return (
    <div className="p-12 min-h-full" style={{ fontFamily, backgroundColor: '#18181b', color: textColor }}>
      {/* Header */}
      <header className="mb-16 flex justify-between items-start">
        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
            {data.personalInfo.fullName.split(' ')[0]}
            <br />
            <span style={{ color: primaryColor }}>{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</span>
          </h1>
          <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest" style={{ color: mutedTextColor }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              {data.personalInfo.email}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              {data.personalInfo.phone}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              {data.personalInfo.location}
            </div>
          </div>
        </div>
        {data.personalInfo.photo && (
          <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4" style={{ borderColor: primaryColor }}>
            <img src={data.personalInfo.photo} alt={data.personalInfo.fullName} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
        )}
      </header>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-8 space-y-12">
          <section className="p-10 rounded-[48px] border" style={{ backgroundColor: cardBg, borderColor }}>
            <SectionHeader title="Experience" color={primaryColor} variant="solid" />
            <div className="space-y-12">
              {data.experience.map(exp => (
                <div key={exp.id} className="relative group">
                  <div className="flex justify-between items-baseline mb-3">
                    <h3 className="text-2xl font-black uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300" style={{ color: textColor }}>{exp.position}</h3>
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-30" style={{ color: textColor }}>{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className="text-sm font-black uppercase tracking-widest mb-5" style={{ color: primaryColor }}>{exp.company}</div>
                  <p className="text-sm leading-relaxed whitespace-pre-line p-6 rounded-[32px] border" style={{ color: mutedTextColor, backgroundColor: '#18181b', borderColor }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {data.projects.length > 0 && (
            <section className="p-10 rounded-[48px] border" style={{ backgroundColor: cardBg, borderColor }}>
              <SectionHeader title="Projects" color={primaryColor} variant="solid" />
              <div className="grid grid-cols-2 gap-8">
                {data.projects.map(proj => (
                  <div key={proj.id} className="group">
                    <div className="h-40 rounded-[32px] mb-5 overflow-hidden border group-hover:border-transparent group-hover:shadow-2xl transition-all duration-500 flex items-center justify-center relative" style={{ backgroundColor: '#18181b', borderColor }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="text-5xl font-black opacity-10 group-hover:opacity-20 transition-all duration-500 scale-100 group-hover:scale-125" style={{ color: primaryColor }}>{proj.name[0]}</span>
                    </div>
                    <h3 className="font-black mb-2 uppercase text-sm tracking-wider" style={{ color: textColor }}>{proj.name}</h3>
                    <p className="text-xs leading-relaxed line-clamp-3 font-medium" style={{ color: mutedTextColor }}>{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-4 space-y-10">
          <section className="p-10 rounded-[48px] shadow-2xl relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16" />
            <SectionHeader title="About" color="white" />
            <p className="text-sm leading-relaxed text-white/90 font-medium italic relative z-10">
              {data.personalInfo.summary}
            </p>
          </section>

          <section className="p-10 rounded-[48px] border" style={{ backgroundColor: cardBg, borderColor }}>
            <SectionHeader title="Skills" color={primaryColor} />
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all hover:scale-105" style={{ borderColor: `${primaryColor}40`, color: primaryColor }}>{skill}</span>
              ))}
            </div>
          </section>

          <section className="p-10 rounded-[48px] border" style={{ backgroundColor: cardBg, borderColor }}>
            <SectionHeader title="Education" color={primaryColor} />
            <div className="space-y-8">
              {data.education.map(edu => (
                <div key={edu.id} className="group">
                  <div className="font-black text-base uppercase tracking-tight leading-tight group-hover:text-primary transition-colors" style={{ color: textColor }}>{edu.degree}</div>
                  <div className="text-xs font-black opacity-40 mt-2 uppercase tracking-widest" style={{ color: textColor }}>{edu.school}</div>
                  <div className="text-[10px] font-bold opacity-20 mt-1.5" style={{ color: textColor }}>{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const InfographicTemplate: React.FC<TemplateProps> = ({ data, primaryColor, fontFamily }) => {
  const SectionHeader = ({ title, color = primaryColor }: { title: string; color?: string }) => (
    <div className="mb-8">
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-2" style={{ color }}>{title}</h2>
      <div className="h-2 w-24 rounded-full" style={{ backgroundColor: color }} />
    </div>
  );

  return (
    <div className="min-h-full bg-white flex flex-col" style={{ fontFamily }}>
      <header className="p-16 flex items-center gap-12 border-b-8" style={{ borderColor: primaryColor }}>
        {data.personalInfo.photo && (
          <div className="w-40 h-40 rounded-[3rem] overflow-hidden shadow-2xl rotate-3">
            <img src={data.personalInfo.photo} alt={data.personalInfo.fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none mb-6 italic">{data.personalInfo.fullName}</h1>
          <div className="flex flex-wrap gap-4">
            <span className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">{data.personalInfo.location}</span>
            <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest">{data.personalInfo.email}</span>
            <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest">{data.personalInfo.phone}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12">
        <div className="col-span-4 p-12 space-y-12 bg-gray-50/50">
          <section>
            <SectionHeader title="Skills" />
            <div className="space-y-4">
              {data.skills.map((skill, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-600">
                    <span>{skill}</span>
                    <span>{90 - (i * 5)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: primaryColor, width: `${90 - (i * 5)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Education" />
            <div className="space-y-8">
              {data.education.map(edu => (
                <div key={edu.id} className="relative pl-6 border-l-2" style={{ borderColor: primaryColor }}>
                  <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                  <div className="text-sm font-black uppercase tracking-tight text-gray-900">{edu.degree}</div>
                  <div className="text-[10px] font-bold text-gray-400 mt-1">{edu.school}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-gray-300 mt-1">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-8 p-16 space-y-16">
          <section>
            <SectionHeader title="Summary" />
            <p className="text-xl font-black leading-tight text-gray-900 tracking-tight">
              {data.personalInfo.summary}
            </p>
          </section>

          <section>
            <SectionHeader title="Experience" />
            <div className="space-y-12">
              {data.experience.map(exp => (
                <div key={exp.id} className="group">
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-gray-900 group-hover:text-primary transition-colors" style={{ color: primaryColor }}>{exp.position}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className="text-sm font-black uppercase tracking-widest mb-6 text-gray-400">{exp.company}</div>
                  <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                    <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line font-medium">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {data.projects.length > 0 && (
            <section>
              <SectionHeader title="Projects" />
              <div className="grid grid-cols-2 gap-8">
                {data.projects.map(proj => (
                  <div key={proj.id} className="p-8 rounded-[3rem] border-4 border-dashed border-gray-100 hover:border-solid hover:border-primary transition-all group" style={{ borderColor: `${primaryColor}20` }}>
                    <h3 className="font-black text-gray-900 mb-3 uppercase text-sm tracking-tight group-hover:text-primary" style={{ color: primaryColor }}>{proj.name}</h3>
                    <p className="text-xs leading-relaxed text-gray-500 font-medium">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, primaryColor, fontFamily }) => {
  const SectionHeader = ({ title, color = primaryColor }: { title: string; color?: string }) => (
    <div className="mb-6">
      <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-2" style={{ color }}>{title}</h2>
      <div className="h-1 w-12" style={{ backgroundColor: color }} />
    </div>
  );

  return (
    <div className="min-h-full flex flex-col" style={{ fontFamily, backgroundColor: '#ffffff', color: '#1a1a1a' }}>
      <header className="bg-gray-900 text-white p-16 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="relative z-10">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-none">{data.personalInfo.fullName}</h1>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
            <span>{data.personalInfo.location}</span>
            <span>{data.personalInfo.phone}</span>
            <span>{data.personalInfo.email}</span>
          </div>
        </div>
        {data.personalInfo.photo && (
          <div className="w-32 h-32 rounded-full border-4 overflow-hidden relative z-10" style={{ borderColor: primaryColor }}>
            <img src={data.personalInfo.photo} alt={data.personalInfo.fullName} className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      <div className="flex-1 grid grid-cols-12">
        <div className="col-span-4 bg-gray-50 p-12 space-y-12 border-r border-gray-100">
          <section>
            <SectionHeader title="Contact" />
            <div className="space-y-4 text-xs font-medium text-gray-600">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Email</span>
                {data.personalInfo.email}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Phone</span>
                {data.personalInfo.phone}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Location</span>
                {data.personalInfo.location}
              </div>
              {data.personalInfo.website && (
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Website</span>
                  {data.personalInfo.website}
                </div>
              )}
            </div>
          </section>

          <section>
            <SectionHeader title="Expertise" />
            <div className="flex flex-col gap-3">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                  {skill}
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Education" />
            <div className="space-y-6">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="text-xs font-black uppercase tracking-tight text-gray-900">{edu.degree}</div>
                  <div className="text-[10px] font-bold text-gray-400 mt-1">{edu.school}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-gray-300 mt-1">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-8 p-16 space-y-16">
          <section>
            <SectionHeader title="Executive Profile" />
            <p className="text-sm leading-relaxed text-gray-700 font-medium italic border-l-4 pl-8" style={{ borderColor: primaryColor }}>
              {data.personalInfo.summary}
            </p>
          </section>

          <section>
            <SectionHeader title="Professional Experience" />
            <div className="space-y-12">
              {data.experience.map(exp => (
                <div key={exp.id} className="relative">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">{exp.position}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: primaryColor }}>{exp.company}</div>
                  <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line font-medium">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {data.projects.length > 0 && (
            <section>
              <SectionHeader title="Key Projects" />
              <div className="grid grid-cols-2 gap-8">
                {data.projects.map(proj => (
                  <div key={proj.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="font-black text-gray-900 mb-2 uppercase text-xs tracking-wider">{proj.name}</h3>
                    <p className="text-[11px] leading-relaxed text-gray-500 font-medium">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const AcademicTemplate: React.FC<TemplateProps> = ({ data, primaryColor, fontFamily }) => {
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="mb-6 border-b-2 border-gray-900 pb-2">
      <h2 className="text-lg font-black uppercase tracking-widest text-gray-900">{title}</h2>
    </div>
  );

  return (
    <div className="p-16 min-h-full bg-white text-gray-900" style={{ fontFamily }}>
      <header className="text-center mb-16 space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">{data.personalInfo.fullName}</h1>
        <div className="flex justify-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <span>{data.personalInfo.location}</span>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          <span>•</span>
          <span>{data.personalInfo.email}</span>
        </div>
        {data.personalInfo.website && (
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {data.personalInfo.website}
          </div>
        )}
      </header>

      <div className="space-y-12">
        <section>
          <SectionHeader title="Research Summary" />
          <p className="text-sm leading-relaxed text-gray-700 font-medium text-justify">
            {data.personalInfo.summary}
          </p>
        </section>

        <section>
          <SectionHeader title="Professional Experience" />
          <div className="space-y-10">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-base font-black uppercase text-gray-900">{exp.position}</h3>
                  <span className="text-xs font-bold text-gray-400">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: primaryColor }}>{exp.company}</div>
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line text-justify">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Education" />
          <div className="space-y-8">
            {data.education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="text-base font-black uppercase text-gray-900">{edu.degree}</div>
                  <span className="text-xs font-bold text-gray-400">{edu.startDate} — {edu.endDate}</span>
                </div>
                <div className="text-xs font-black uppercase tracking-widest opacity-60">{edu.school}</div>
              </div>
            ))}
          </div>
        </section>

        {data.projects.length > 0 && (
          <section>
            <SectionHeader title="Publications & Projects" />
            <div className="space-y-8">
              {data.projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-base font-black uppercase text-gray-900">{proj.name}</h3>
                    {proj.link && <span className="text-xs font-bold text-gray-400">{proj.link}</span>}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 text-justify">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <SectionHeader title="Technical Skills" />
          <div className="text-sm leading-relaxed text-gray-700 font-medium">
            <span className="font-black uppercase text-xs tracking-widest mr-4">Core Competencies:</span>
            {data.skills.join(' • ')}
          </div>
        </section>
      </div>
    </div>
  );
};

const MinimalistProTemplate: React.FC<TemplateProps> = ({ data, primaryColor, fontFamily }) => {
  return (
    <div className="p-20 min-h-full bg-white text-gray-900 flex flex-col items-center" style={{ fontFamily }}>
      <header className="text-center mb-20 space-y-6 max-w-2xl">
        <h1 className="text-5xl font-light tracking-[0.2em] uppercase">{data.personalInfo.fullName}</h1>
        <div className="h-px w-20 bg-black mx-auto" />
        <div className="flex justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
          <span>{data.personalInfo.location}</span>
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
        </div>
      </header>

      <div className="w-full max-w-3xl space-y-20">
        <section className="text-center">
          <p className="text-lg font-light leading-relaxed text-gray-600 italic">
            {data.personalInfo.summary}
          </p>
        </section>

        <section className="space-y-12">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-center text-gray-300 mb-12">Experience</h2>
          <div className="space-y-16">
            {data.experience.map(exp => (
              <div key={exp.id} className="text-center space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-medium text-gray-900">{exp.position}</h3>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{exp.company} / {exp.startDate} — {exp.endDate}</div>
                </div>
                <p className="text-sm leading-relaxed text-gray-500 max-w-xl mx-auto">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-20">
          <section className="space-y-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">Education</h2>
            <div className="space-y-6">
              {data.education.map(edu => (
                <div key={edu.id} className="space-y-1">
                  <div className="text-sm font-medium text-gray-900">{edu.degree}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{edu.school}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">Expertise</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-[10px] font-black uppercase tracking-widest text-gray-600">{skill}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const CreativeVibrantTemplate: React.FC<TemplateProps> = ({ data, primaryColor, fontFamily }) => {
  return (
    <div className="min-h-full bg-rose-50/30 flex flex-col" style={{ fontFamily }}>
      <header className="bg-rose-500 text-white p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl" />
        
        <div className="relative z-10 flex justify-between items-end">
          <div className="space-y-6">
            <h1 className="text-8xl font-black tracking-tighter leading-none uppercase italic">{data.personalInfo.fullName}</h1>
            <div className="flex gap-4">
              <span className="px-4 py-2 bg-white text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">{data.personalInfo.location}</span>
              <span className="px-4 py-2 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">{data.personalInfo.email}</span>
            </div>
          </div>
          {data.personalInfo.photo && (
            <div className="w-48 h-48 rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl rotate-6">
              <img src={data.personalInfo.photo} alt={data.personalInfo.fullName} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-12 p-12">
        <div className="col-span-8 space-y-12">
          <section className="bg-white p-12 rounded-[4rem] shadow-xl border border-rose-100">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 text-rose-500 italic">Experience</h2>
            <div className="space-y-12">
              {data.experience.map(exp => (
                <div key={exp.id} className="group">
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-2xl font-black uppercase text-gray-900 group-hover:text-rose-500 transition-colors">{exp.position}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-200">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className="text-sm font-black uppercase tracking-widest mb-4 text-gray-400">{exp.company}</div>
                  <p className="text-sm leading-relaxed text-gray-600 font-medium">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-12">
          <section className="bg-black text-white p-12 rounded-[4rem] shadow-2xl">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 italic">About</h2>
            <p className="text-sm leading-relaxed text-rose-100/80 font-medium">
              {data.personalInfo.summary}
            </p>
          </section>

          <section className="bg-white p-12 rounded-[4rem] shadow-xl border border-rose-100">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-rose-500 italic">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-rose-50 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100">{skill}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const LegalStandardTemplate: React.FC<TemplateProps> = ({ data, primaryColor, fontFamily }) => {
  return (
    <div className="p-20 min-h-full bg-white text-gray-900 border-[12px] border-double border-gray-100" style={{ fontFamily: 'serif' }}>
      <header className="text-center mb-16 border-b-2 border-gray-900 pb-8">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-4">{data.personalInfo.fullName}</h1>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 space-x-4">
          <span>{data.personalInfo.location}</span>
          <span>|</span>
          <span>{data.personalInfo.email}</span>
          <span>|</span>
          <span>{data.personalInfo.phone}</span>
        </div>
      </header>

      <div className="space-y-12">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-4">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-gray-800 text-justify">
            {data.personalInfo.summary}
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-6">Experience</h2>
          <div className="space-y-8">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-sm mb-1">
                  <span>{exp.company}</span>
                  <span>{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="italic text-sm mb-3">{exp.position}</div>
                <p className="text-sm leading-relaxed text-gray-700 text-justify whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-6">Education</h2>
          <div className="space-y-6">
            {data.education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between font-bold text-sm mb-1">
                  <span>{edu.school}</span>
                  <span>{edu.startDate} — {edu.endDate}</span>
                </div>
                <div className="text-sm">{edu.degree}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-4">Additional Information</h2>
          <div className="text-sm">
            <span className="font-bold">Skills & Expertise: </span>
            {data.skills.join(', ')}
          </div>
        </section>
      </div>
    </div>
  );
};

export const ResumeTemplates: Record<TemplateId, React.FC<TemplateProps>> = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  sidebar: SidebarTemplate,
  creative: CreativeTemplate,
  professional: ProfessionalTemplate,
  elegant: ElegantTemplate,
  bold: BoldTemplate,
  tech: TechTemplate,
  compact: CompactTemplate,
  canva: CanvaTemplate,
  visual: VisualTemplate,
  modern_dark: ModernDarkTemplate,
  infographic: InfographicTemplate,
  executive: ExecutiveTemplate,
  academic: AcademicTemplate,
  minimalist_pro: MinimalistProTemplate,
  creative_vibrant: CreativeVibrantTemplate,
  legal_standard: LegalStandardTemplate,
};

