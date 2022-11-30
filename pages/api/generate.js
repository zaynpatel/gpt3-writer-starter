import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
Write a story with two fictional characters, Jack and Jill, explaining, in depth and detail, the concept below.  Explain it with a good story and show that the writer researched well. 

Concept:

`;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}\n`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.82,
    max_tokens: 600,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = 
  ` Take the concept inputted below and give me the history of it. Tell me why it's important, what it does, and the components that make it special
    
    Concept: ${req.body.userInput}

    Explanation: ${basePromptOutput.text}

    Output:
  `

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `{secondPrompt}`,
    temperature: 0.3,
    max_tokens: 800,
    });

    const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;

