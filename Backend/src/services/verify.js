const { z } = require("zod");

// Define a simple schema to test
const testSchema = z.object({
    name: z.string().describe("Candidate's name"),
    score: z.number().describe("Test score")
});

// Use Zod's native toJSONSchema method (Zod v4+)
// Note: If you are on an older Zod version, you may need to use zodToJsonSchema
try {
    const jsonSchema = z.toJSONSchema(testSchema);
    console.log("--- SCHEMA VERIFICATION START ---");
    console.log(JSON.stringify(jsonSchema, null, 2));
    console.log("--- SCHEMA VERIFICATION END ---");
} catch (e) {
    console.error("Zod Schema generation failed:", e);
}