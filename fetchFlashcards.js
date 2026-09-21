import fs from 'fs';
import https from 'http';

const url = "http://161.118.171.4:8765/flashcards.json";

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const cards = parsed.cards || [];
      
      const mappedCards = cards.map(raw => {
        // Map subject to Tutovia subject_id (e.g., "Advanced Accounting" -> "advanced-accounting", "Corporate and Other Laws" -> "corporate-laws")
        let subject_id = "general";
        const subject = raw.subject.trim().toLowerCase();
        
        if (subject.includes('audit')) subject_id = 'auditing-ethics';
        else if (subject.includes('law')) subject_id = 'corporate-laws';
        else if (subject.includes('tax')) subject_id = 'taxation';
        else if (subject.includes('accounting') && !subject.includes('cost')) subject_id = 'advanced-accounting';
        
        return {
          id: raw.id,
          subject_id: subject_id,
          chapter: raw.chapter || '',
          title: raw.front?.title || raw.question || '',
          subtitle: raw.front?.subtitle || raw.topic || '',
          prompt: raw.front?.recallPrompt || 'Reference? Key points? Exam keywords?',
          section: raw.back?.sectionReference || raw.section || '',
          points: raw.back?.pointsToRemember || [raw.answer || ''],
          memory_tip: raw.back?.memoryTip || raw.tip || ''
        };
      });

      const fileContent = `export const flashcardsDB = ${JSON.stringify(mappedCards, null, 2)};\n`;
      fs.writeFileSync('./flashcardsData.js', fileContent);
      console.log(`Successfully mapped and saved ${mappedCards.length} flashcards to flashcardsData.js!`);
    } catch (e) {
      console.error("Failed to parse or write JSON", e);
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
