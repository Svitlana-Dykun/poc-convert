const fs = require("fs");
const { convertWidget } = require("./converter");

async function convertRealExamples() {
    try {
        // Use the shared converter
        const parsedWidget = await convertWidget();
        
        console.log("Converted V4 widget:", parsedWidget);

        // Save to file (non-wrapped version)
        fs.writeFileSync("converted-real-widget.json", JSON.stringify(parsedWidget, null, 2));
        console.log("Saved converted V4 widget to converted-real-widget.json");
    } catch (err) {
        console.error("OpenAI API error:", err);
    }
}

convertRealExamples();
