const fs = require('fs');
const PDFParser = require("pdf2json");

const uploadDir = 'c:/Users/IPK Computers/Desktop/grama niladari/backend/uploads/pdf-forms';
const files = fs.readdirSync(uploadDir);

const pdfParser = new PDFParser();
const pdfPath = `${uploadDir}/${files[0]}`;

pdfParser.on("pdfParser_dataReady", pdfData => {
    const page1 = pdfData.Pages[0];
    const fills = page1.Fills || [];
    const hlines = page1.HLines || [];
    const vlines = page1.VLines || [];
    
    console.log(`Page 1 Size: Width ${page1.Width}, Height ${page1.Height}`);
    console.log(`Fills: ${fills.length}`);
    console.log(`HLines: ${hlines.length}`);
    console.log(`VLines: ${vlines.length}`);
    console.log(`Texts: ${page1.Texts.length}`);

    console.log("Sample HLines:");
    hlines.slice(0, 5).forEach(line => console.log(line));
});

pdfParser.loadPDF(pdfPath);
