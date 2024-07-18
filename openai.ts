import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

async function main(){
    const completion = await openai.chat.completions.create({
        messages: [{role: "system", content:"You are a helpful assistant"}],
        model: "gpt-4o"
    });
    console.log(completion.choices[0])
}

main()