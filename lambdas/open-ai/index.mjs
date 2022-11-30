import { createClient } from '@supabase/supabase-js'
import { Configuration, OpenAIApi } from 'openai'

export const handler = async (event) => {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY
    )
    const { error } = await supabase.auth.api.getUser(
        event.headers.authorization?.replace('Bearer ', '')
    )

    if (error) {
        return {
            statusCode: 403,
        }
    }

    const configuration = new Configuration({
        organization: process.env.OPENAI_ORG_ID,
        apiKey: process.env.OPENAI_API_KEY,
    })
    const openai = new OpenAIApi(configuration)
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: event.body,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    })

    if (response.status === 200) {
        return {
            statusCode: 200,
            body: response?.data?.choices[0].text,
        }
    } else {
        return { statusCode: 500 }
    }
}

// LOCAL TESTING
// console.log(await handler({ headers: { authorization: process.env.SUPABASE_TOKEN }, body: "I like ice cream" }))
