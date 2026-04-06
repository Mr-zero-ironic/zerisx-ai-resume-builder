import React, { useRef, useState } from 'react';
import { ResumeData, ResumeSettings } from '../types';
import { ResumeTemplates } from './ResumeTemplates';
import { Download, FileText, Image as ImageIcon, File as FileIcon, Loader2, X, Maximize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { cn } from '../lib/utils';

interface ResumePreviewProps {
  data: ResumeData;
  settings: ResumeSettings;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, settings }) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [scale, setScale] = useState(0.8);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const Template = ResumeTemplates[settings.templateId];

  React.useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && !isFullScreen) {
        const containerWidth = containerRef.current.offsetWidth;
        const resumeWidth = 794;
        const padding = 32;
        
        const scaleW = (containerWidth - padding) / resumeWidth;
        setScale(Math.min(1, scaleW));
      }
    };

    updateScale();
    const timer = setTimeout(updateScale, 100);
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timer);
    };
  }, [isFullScreen]);

  const zoomIn = () => setScale(prev => Math.min(2, prev + 0.1));
  const zoomOut = () => setScale(prev => Math.max(0.2, prev - 0.1));
  const resetZoom = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const resumeWidth = 794;
      setScale(Math.min(1, (containerWidth - 32) / resumeWidth));
    }
  };

  const exportPDF = async () => {
    if (!exportRef.current) return;
    setIsExporting('pdf');
    try {
      window.scrollTo(0, 0);
      const canvas = await html2canvas(exportRef.current, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: settings.backgroundColor,
        onclone: (clonedDoc) => {
          const styles = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < styles.length; i++) {
            const style = styles[i];
            if (
              style.innerHTML.includes('oklch') || 
              style.innerHTML.includes('oklab') || 
              style.innerHTML.includes('color-mix')
            ) {
              style.innerHTML = style.innerHTML
                .replace(/oklch\([^)]+\)/g, 'rgb(128, 128, 128)')
                .replace(/oklab\([^)]+\)/g, 'rgb(128, 128, 128)')
                .replace(/color-mix\([^)]+\)/g, 'rgb(128, 128, 128)');
            }
          }
          const allElements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            if (el.style) {
              const styleStr = el.getAttribute('style') || '';
              if (styleStr.includes('oklch') || styleStr.includes('oklab') || styleStr.includes('color-mix')) {
                el.setAttribute('style', styleStr
                  .replace(/oklch\([^)]+\)/g, 'rgb(128, 128, 128)')
                  .replace(/oklab\([^)]+\)/g, 'rgb(128, 128, 128)')
                  .replace(/color-mix\([^)]+\)/g, 'rgb(128, 128, 128)')
                );
              }
            }
          }
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasHeightInMm = (canvas.height * pdfWidth) / canvas.width;
      
      if (canvasHeightInMm <= pdfHeight) {
        // Fits in one page
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, canvasHeightInMm);
      } else {
        // Multi-page
        let heightLeft = canvasHeightInMm;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeightInMm);
        heightLeft -= pdfHeight;
        
        while (heightLeft > 0) {
          position = heightLeft - canvasHeightInMm;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeightInMm);
          heightLeft -= pdfHeight;
        }
      }
      
      pdf.save(`${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const exportJPEG = async () => {
    if (!exportRef.current) return;
    setIsExporting('jpeg');
    try {
      window.scrollTo(0, 0);
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: settings.backgroundColor,
        onclone: (clonedDoc) => {
          const styles = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < styles.length; i++) {
            const style = styles[i];
            if (
              style.innerHTML.includes('oklch') || 
              style.innerHTML.includes('oklab') || 
              style.innerHTML.includes('color-mix')
            ) {
              style.innerHTML = style.innerHTML
                .replace(/oklch\([^)]+\)/g, 'rgb(128, 128, 128)')
                .replace(/oklab\([^)]+\)/g, 'rgb(128, 128, 128)')
                .replace(/color-mix\([^)]+\)/g, 'rgb(128, 128, 128)');
            }
          }
          const allElements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            if (el.style) {
              const styleStr = el.getAttribute('style') || '';
              if (styleStr.includes('oklch') || styleStr.includes('oklab') || styleStr.includes('color-mix')) {
                el.setAttribute('style', styleStr
                  .replace(/oklch\([^)]+\)/g, 'rgb(128, 128, 128)')
                  .replace(/oklab\([^)]+\)/g, 'rgb(128, 128, 128)')
                  .replace(/color-mix\([^)]+\)/g, 'rgb(128, 128, 128)')
                );
              }
            }
          }
        }
      });
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.jpg`);
        setIsExporting(null);
      }, 'image/jpeg', 1.0);
    } catch (error) {
      console.error('JPEG Export failed:', error);
      setIsExporting(null);
    }
  };

  const exportDOCX = async () => {
    setIsExporting('docx');
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: data.personalInfo.fullName, bold: true, size: 32 }),
              ],
            }),
            new Paragraph({ text: `${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}${data.personalInfo.linkedin ? ` | ${data.personalInfo.linkedin}` : ''}` }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "Summary", bold: true, size: 24 })] }),
            new Paragraph({ text: data.personalInfo.summary }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "Experience", bold: true, size: 24 })] }),
            ...data.experience.flatMap(exp => [
              new Paragraph({ children: [new TextRun({ text: `${exp.position} at ${exp.company}`, bold: true })] }),
              new Paragraph({ text: `${exp.startDate} - ${exp.endDate}` }),
              new Paragraph({ text: exp.description }),
              new Paragraph({ text: "" }),
            ]),
            ...(data.projects.length > 0 ? [
              new Paragraph({ children: [new TextRun({ text: "Projects", bold: true, size: 24 })] }),
              ...data.projects.flatMap(proj => [
                new Paragraph({ children: [new TextRun({ text: proj.name, bold: true })] }),
                new Paragraph({ text: proj.link || "" }),
                new Paragraph({ text: proj.description }),
                new Paragraph({ text: "" }),
              ])
            ] : []),
            ...(data.education.length > 0 ? [
              new Paragraph({ children: [new TextRun({ text: "Education", bold: true, size: 24 })] }),
              ...data.education.flatMap(edu => [
                new Paragraph({ children: [new TextRun({ text: edu.school, bold: true })] }),
                new Paragraph({ text: `${edu.degree} (${edu.startDate} - ${edu.endDate})` }),
                new Paragraph({ text: "" }),
              ])
            ] : []),
            ...(data.skills.length > 0 ? [
              new Paragraph({ children: [new TextRun({ text: "Skills", bold: true, size: 24 })] }),
              new Paragraph({ text: data.skills.join(", ") }),
              new Paragraph({ text: "" }),
            ] : []),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`);
    } catch (error) {
      console.error('DOCX Export failed:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const ExportButton: React.FC<{
    onClick: () => void;
    icon: React.ElementType;
    label: string;
    sublabel: string;
    id: string;
    variant?: 'primary' | 'secondary';
  }> = ({ onClick, icon: Icon, label, sublabel, id, variant = 'secondary' }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={!!isExporting}
      className={cn(
        "flex flex-col items-start gap-1 p-4 rounded-2xl border transition-all group relative overflow-hidden",
        variant === 'primary' 
          ? "bg-red-600 border-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-200" 
          : "bg-white border-gray-100 text-gray-900 hover:border-gray-300 hover:bg-gray-50",
        isExporting === id && "ring-2 ring-offset-2 ring-red-500",
        isExporting && isExporting !== id && "opacity-50 grayscale"
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
          variant === 'primary' ? "bg-white/20" : "bg-gray-100"
        )}>
          {isExporting === id ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Icon size={20} className={variant === 'primary' ? "text-white" : "text-gray-600"} />
          )}
        </div>
        {isExporting === id && (
          <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Processing...</span>
        )}
      </div>
      <div className="mt-2 text-left">
        <div className="text-xs font-black uppercase tracking-widest">{label}</div>
        <div className={cn(
          "text-[10px] font-medium opacity-60",
          variant === 'primary' ? "text-white" : "text-gray-500"
        )}>{sublabel}</div>
      </div>
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full h-full">
      {/* Floating Controls Bar - Refined Aesthetic */}
      <div className="w-full no-print flex items-center justify-between bg-white/80 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-white/20 sticky top-20 z-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100/50 rounded-2xl p-1">
            <button 
              onClick={zoomOut}
              className="p-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all text-gray-500 active:scale-90"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <div className="px-4 py-1 text-[11px] font-black uppercase tracking-widest text-gray-600 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </div>
            <button 
              onClick={zoomIn}
              className="p-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all text-gray-500 active:scale-90"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
          </div>
          
          <button 
            onClick={resetZoom}
            className="p-2.5 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl"
            title="Reset Zoom"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-100/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </div>
          
          <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />

          <div className="flex items-center gap-2">
            <button
              onClick={exportPDF}
              disabled={!!isExporting}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50"
            >
              {isExporting === 'pdf' ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />}
              <span className="hidden md:inline">Download PDF</span>
              <span className="md:hidden">PDF</span>
            </button>

            <div className="relative group/export">
              <button
                className="p-3 bg-white border border-gray-100 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                title="More Export Options"
              >
                <Maximize2 size={18} />
              </button>
              
              <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] border border-gray-100 p-3 opacity-0 translate-y-4 pointer-events-none group-hover/export:opacity-100 group-hover/export:translate-y-0 group-hover/export:pointer-events-auto transition-all duration-300 z-[100]">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-2 mb-2">Export Formats</div>
                <button 
                  onClick={exportDOCX}
                  className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-2xl transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                    <FileIcon size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest">Word Doc</div>
                    <div className="text-[9px] opacity-60">Editable Text</div>
                  </div>
                </button>
                <button 
                  onClick={exportJPEG}
                  className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 text-gray-700 hover:text-purple-600 rounded-2xl transition-colors text-left mt-1"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                    <ImageIcon size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest">JPEG Image</div>
                    <div className="text-[9px] opacity-60">Visual Preview</div>
                  </div>
                </button>
                <div className="h-px bg-gray-100 my-2 mx-2" />
                <button 
                  onClick={() => setIsFullScreen(true)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-700 rounded-2xl transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Maximize2 size={16} />
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest">Fullscreen</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        className={cn(
          "w-full flex-1 flex flex-col items-center justify-start min-h-[600px] relative transition-all duration-500",
          isFullScreen ? "fixed inset-0 z-[200] bg-gray-900/95 p-12 overflow-auto" : ""
        )}
      >
        {isFullScreen && (
          <button 
            onClick={() => setIsFullScreen(false)}
            className="fixed top-8 right-8 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-[210] border border-white/10"
          >
            <X size={24} />
          </button>
        )}

        <div 
          className={cn(
            "origin-top transition-all duration-300 ease-out",
            !isFullScreen && "shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_30px_60px_-15px_rgba(0,0,0,0.1)]"
          )}
          style={{ 
            transform: `scale(${scale})`,
            height: `${1123}px`,
            width: `${794}px`,
            marginBottom: `${(1123 * scale) - 1123}px`
          }}
        >
          <div ref={resumeRef} className="resume-paper" style={{ backgroundColor: settings.backgroundColor, margin: 0 }}>
            <Template 
              data={data} 
              primaryColor={settings.primaryColor} 
              backgroundColor={settings.backgroundColor}
              fontFamily={settings.fontFamily} 
              photoBorderStyle={settings.photoBorderStyle}
              photoBorderColor={settings.photoBorderColor}
              photoBorderWidth={settings.photoBorderWidth}
            />
          </div>
        </div>
      </div>

      {/* Hidden container for export - exactly A4 size */}
      <div className="fixed top-[-9999px] left-[-9999px]">
        <div 
          ref={exportRef} 
          className="resume-paper"
          style={{ 
            backgroundColor: settings.backgroundColor 
          }}
        >
          <Template 
            data={data} 
            primaryColor={settings.primaryColor} 
            backgroundColor={settings.backgroundColor}
            fontFamily={settings.fontFamily} 
            photoBorderStyle={settings.photoBorderStyle}
            photoBorderColor={settings.photoBorderColor}
            photoBorderWidth={settings.photoBorderWidth}
          />
        </div>
      </div>
    </div>
  );
};
