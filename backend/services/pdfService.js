const pdf = require('pdf-parse');

exports.extractTextFromPDF = async (fileBuffer) => {
    try {
        const data = await pdf(fileBuffer);
        // Basic cleaning of text
        return data.text.replace(/\n\s*\n/g, '\n').trim();
    } catch (error) {
        console.error('PDF Extraction Error:', error);
        throw new Error('Failed to extract text from PDF');
    }
};
