const {GoogleGenAI}=require('@google/genai');

const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});

async function invokeGenAi(){
    const response=await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:"hello gemini explain what is interview in 20 lines"
    })
    console.log(response.text);
}

module.exports=invokeGenAi;