import axios from "axios";


export const transcribeFile = async(file:File) =>{
    const openaiApiKey = process.env.OPENAI_API_KEY;

    const formData = new FormData();
    formData.append('file', file);

    try {
        console.log('OpenAI API Key:', openaiApiKey);        
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.log(error)
    }
}