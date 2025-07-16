const fs = require("fs");
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function convertRealExamples() {
    // Read your real JSON files from disk
    const v3Example = JSON.parse(fs.readFileSync("./container-v3-1.json", "utf-8"));
    const v4Example = JSON.parse(fs.readFileSync("./container-v4-1.json", "utf-8"));
    // Your actual input to convert
    const userInput = JSON.parse(fs.readFileSync("./container-user.json", "utf-8"));

    // System prompt to define the task
    const systemPrompt = `
You are a JSON transformer specialized in converting Elementor V3 container widgets into Elementor V4 flexbox widgets.
- Input strictly follows the V3 JSON schema.
- Output must strictly follow the V4 JSON schema, including proper nesting of elements and styles.
- Convert "elType": "container" in V3 to "elType": "e-flexbox" in V4.
- Convert the V3 "settings" keys for styles into the V4 "styles" object under a generated class name as in the example.
- The generated class name is "e-" concatenated with the output "id" and a random suffix (you can keep the suffix fixed for consistency).
- Style properties such as "min_height" and "background_color" must be converted to the nested structure in V4 styles under the class, with proper keys like "min-height" and "background.color.value".
- Copy "id", "elements" (recursively), "isInner", and other fields as per the V4 schema.
- Output must be valid JSON and only the JSON object, no extra text or explanation.
- If the input is invalid, respond with {"error": "Description"} JSON only.
`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0,
            max_tokens: 2000,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: JSON.stringify(v3Example) },
                { role: "assistant", content: JSON.stringify(v4Example) },
                { role: "user", content: JSON.stringify(userInput) }
            ]
        });

        const content = response.choices[0].message.content;
        const parsed = JSON.parse(content);
        console.log("Converted V4 widget:", parsed);

        // Save to file
        fs.writeFileSync("converted-real-widget.json", JSON.stringify(parsed, null, 2));
        console.log("Saved converted V4 widget to converted-real-widget.json");
    } catch (err) {
        console.error("OpenAI API error:", err);
    }
}

convertRealExamples();
