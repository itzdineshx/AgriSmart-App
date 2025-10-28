import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PlantAnalysisResult {
  status: 'healthy' | 'diseased' | 'error';
  plantType: string;
  confidence: number;
  disease?: string | null;
  severity?: string | null;
  symptoms: string[];
  immediateActions: string[];
  detailedTreatment: {
    organicSolutions: string[];
    chemicalSolutions: string[];
    stepByStepCure: string[];
  };
  fertilizers: Array<{
    name: string;
    type: 'organic' | 'chemical';
    application: string;
    timing: string;
  }>;
  nutritionSuggestions: Array<{
    nutrient: string;
    deficiencySign: string;
    sources: string[];
  }>;
  preventionTips: string[];
  growthTips: string[];
  seasonalCare: string[];
  companionPlants: string[];
  warningsSigns: string[];
  appreciation: string;
  additionalAdvice: string;
}

export const generateDiagnosisReport = async (analysisResult: PlantAnalysisResult, plantImage: string) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yOffset = margin;

  // Add header
  pdf.setFontSize(20);
  pdf.text('Plant Health Analysis Report', pageWidth / 2, yOffset, { align: 'center' });
  yOffset += 15;

  // Add date
  pdf.setFontSize(12);
  pdf.text(`Report Generated: ${new Date().toLocaleString()}`, margin, yOffset);
  yOffset += 10;

  // Add plant image
  try {
    const img = new Image();
    img.src = plantImage;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    const imgWidth = 100;
    const imgHeight = (img.height * imgWidth) / img.width;
    pdf.addImage(plantImage, 'JPEG', (pageWidth - imgWidth) / 2, yOffset, imgWidth, imgHeight);
    yOffset += imgHeight + 10;
  } catch (error) {
    console.error('Error adding image to PDF:', error);
  }

  // Add analysis summary
  pdf.setFontSize(16);
  pdf.text('Analysis Summary', margin, yOffset);
  yOffset += 10;

  pdf.setFontSize(12);
  const addSection = (title: string, content: string | string[] | unknown) => {
    if (!content || (Array.isArray(content) && content.length === 0)) return yOffset;

    // Check if we need a new page
    if (yOffset > pageHeight - 50) {
      pdf.addPage();
      yOffset = margin;
    }

    pdf.setFont(undefined, 'bold');
    pdf.text(title, margin, yOffset);
    pdf.setFont(undefined, 'normal');
    yOffset += 7;

    if (Array.isArray(content)) {
      content.forEach((item: string) => {
        const lines = pdf.splitTextToSize(item, pageWidth - (margin * 2));
        lines.forEach((line: string) => {
          if (yOffset > pageHeight - margin) {
            pdf.addPage();
            yOffset = margin;
          }
          pdf.text(`• ${line}`, margin + 5, yOffset);
          yOffset += 7;
        });
      });
    } else if (typeof content === 'object') {
      Object.entries(content).forEach(([key, value]) => {
        if (value && (!Array.isArray(value) || value.length > 0)) {
          const lines = pdf.splitTextToSize(`${key}: ${value}`, pageWidth - (margin * 2));
          lines.forEach((line: string) => {
            if (yOffset > pageHeight - margin) {
              pdf.addPage();
              yOffset = margin;
            }
            pdf.text(`• ${line}`, margin + 5, yOffset);
            yOffset += 7;
          });
        }
      });
    } else {
      const lines = pdf.splitTextToSize(content.toString(), pageWidth - (margin * 2));
      lines.forEach((line: string) => {
        if (yOffset > pageHeight - margin) {
          pdf.addPage();
          yOffset = margin;
        }
        pdf.text(line, margin + 5, yOffset);
        yOffset += 7;
      });
    }
    yOffset += 5;
    return yOffset;
  };

  // Add sections based on analysis result
  addSection('Plant Type', analysisResult.plantType);
  addSection('Status', `${analysisResult.status} (${analysisResult.confidence}% confidence)`);

  if (analysisResult.status === 'diseased') {
    addSection('Disease', analysisResult.disease);
    addSection('Severity', analysisResult.severity);
    addSection('Symptoms', analysisResult.symptoms);
    addSection('Immediate Actions', analysisResult.immediateActions);
    
    if (analysisResult.detailedTreatment) {
      addSection('Organic Solutions', analysisResult.detailedTreatment.organicSolutions);
      addSection('Chemical Solutions', analysisResult.detailedTreatment.chemicalSolutions);
      addSection('Treatment Steps', analysisResult.detailedTreatment.stepByStepCure);
    }
  }

  addSection('Fertilizer Recommendations', 
    analysisResult.fertilizers?.map((f) => 
      `${f.name} (${f.type}): ${f.application}, ${f.timing}`
    )
  );

  addSection('Nutrition Suggestions',
    analysisResult.nutritionSuggestions?.map((n) =>
      `${n.nutrient}: ${n.deficiencySign}`
    )
  );

  addSection('Prevention Tips', analysisResult.preventionTips);
  addSection('Growth Tips', analysisResult.growthTips);
  addSection('Seasonal Care', analysisResult.seasonalCare);
  addSection('Warning Signs', analysisResult.warningsSigns);

  if (analysisResult.appreciation) {
    addSection('Expert Note', analysisResult.appreciation);
  }

  // Add footer
  pdf.setFontSize(10);
  pdf.text('Generated by AgriSmart AI Plant Health Lab', pageWidth / 2, pageHeight - 10, { align: 'center' });

  return pdf;
};