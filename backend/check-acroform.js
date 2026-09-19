const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function checkFormFields(pdfPath) {
  try {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    console.log(`Found ${fields.length} form fields.`);
    fields.forEach(field => {
      console.log(`- ${field.getName()} (${field.constructor.name})`);
    });
  } catch (error) {
    console.error("Error reading PDF:", error.message);
  }
}

// Check the recently uploaded PDF
const uploadDir = 'c:/Users/IPK Computers/Desktop/grama niladari/backend/uploads/pdf-forms';
const files = fs.readdirSync(uploadDir);
if (files.length > 0) {
  console.log("Checking:", files[0]);
  checkFormFields(`${uploadDir}/${files[0]}`);
} else {
  console.log("No PDFs found");
}
