const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateOfferLetter = (student, job, offerDetails) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData); // Return buffer (can be uploaded to S3)
            });

            // Header
            doc.fontSize(25).text('OFFER LETTER', { align: 'center' });
            doc.moveDown();

            // Date
            doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
            doc.moveDown();

            // Salutation
            doc.text(`Dear ${student.fullName},`, { align: 'left' });
            doc.moveDown();

            // Content
            doc.text(`We are pleased to offer you the position of ${job.title} at ${job.companyId.companyName}.`);
            doc.moveDown();

            doc.text(`After reviewing your application and performance in the interview process, we believe you will be a great addition to our team.`);
            doc.moveDown();

            // Details
            doc.fontSize(14).text('Offer Details:', { underline: true });
            doc.fontSize(12).text(`Position: ${job.title}`);
            doc.text(`CTC: ${offerDetails.salary} LPA`);
            doc.text(`Joining Date: ${new Date(offerDetails.joiningDate).toLocaleDateString()}`);
            doc.text(`Location: ${job.location}`);
            doc.moveDown();

            // Closing
            doc.text('We look forward to welcoming you to the team.');
            doc.moveDown();
            doc.text('Sincerely,');
            doc.text('HR Department');
            doc.text(job.companyId.companyName);

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};
