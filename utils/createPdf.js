const PDFDocument = require('pdfkit');
const fs = require('fs');

function createPdf(billData, outputPath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text('Bill', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12)
    .text(`Bill Number: ${billData.billNumber}`)
    .text(`Student Name: ${billData.studentName}`)
    .text(`Student Email: ${billData.studentEmail}`)
    .text(`Date: ${billData.date}`)
    .text(`Duration: ${billData.duration}`)
    .text(`Amount: ${billData.amount}`);

  doc.end();
}

module.exports = createPdf;