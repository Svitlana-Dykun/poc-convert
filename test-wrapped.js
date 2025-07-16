const fs = require("fs");
const { convertWidget } = require("./converter");

async function convertRealExamples() {
    try {
        // Use the shared converter with raw response logging
        const parsedWidget = await convertWidget({ logRawResponse: true });

        // Wrap the output inside the required object
        const wrappedOutput = {
            content: [parsedWidget],
            page_settings: [],
            version: "0.4",
            title: "v4-new",
            type: "e-flexbox"
        };

        // Save to file (wrapped version)
        fs.writeFileSync("converted-real-widget-wrapped.json", JSON.stringify(wrappedOutput, null, 2));
        console.log("Saved wrapped converted V4 widget to converted-real-widget-wrapped.json");
    } catch (err) {
        console.error("Error parsing or saving OpenAI response:", err);
    }
}

convertRealExamples();
