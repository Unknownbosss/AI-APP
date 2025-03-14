import { OpenAI } from "openai";

class ChatAPI {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-3.5-turbo-instruct",
      store: true,
      messages: [
        {
          role: "system",
          content:
            "Answer the question in a few sentences. Your owner is Unknownboss",
        },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content || "";
  }
}

export default ChatAPI;
