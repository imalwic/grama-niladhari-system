const { PdfFieldDetectorService } = require('./dist/src/pdf-forms/pdf-field-detector.service');

async function test() {
    const detector = new PdfFieldDetectorService();
    // Assuming the file is in uploads/pdf-forms
    const fs = require('fs');
    const files = fs.readdirSync('./uploads/pdf-forms');
    const latestFile = files.sort().pop();
    console.log("Testing on file:", latestFile);

    try {
        const fields = await detector.detectFields('./uploads/pdf-forms/' + latestFile, 842, 595);
        console.log("Detected fields count:", fields.length);
        if (fields.length > 0) {
            console.log("First few fields:", fields.slice(0, 5));
        } else {
            console.log("NO FIELDS DETECTED!");
        }
    } catch (e) {
        console.error("Error during detection:", e);
    }
}
test();
