import { encode, decode } from 'gpt-tokenizer'

export default class OpenAiUtils {
  public static countTokens(text: string): number {
    try {
      return encode(text).length
    } catch (error) {
      throw new Error(error)
    }
  }

  public static encodeTextIntoTokens(text: string): number[] {
    try {
      return encode(text)
    } catch (error) {
      throw new Error(error)
    }
  }

  public static decodeTokensIntoText(tokens: number[]): string {
    try {
      return decode(tokens)
    } catch (error) {
      throw new Error(error)
    }
  }

  public static extractContentFromBufferChunk(data: string) {
    let content = ''
    const lines = data.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.startsWith('data: ') && !line.startsWith('data: [DONE]')) {
        const json = JSON.parse(line.substring(6))
        if (json.choices[0].delta?.content) {
          content += json.choices[0].delta.content
        }
        if (json.choices[0].finish_reason === 'stop') {
          return content
        }
      }
    }

    return content
  }
}
