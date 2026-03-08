import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../utils/logger";

export interface LLMResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class MultiLLMRouter {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private gemini: GoogleGenerativeAI | null = null;

  constructor() {
    this.initializeClients();
  }

  private initializeClients() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }

    if (process.env.GOOGLE_AI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    }
  }

  async generateResponse(
    model: string,
    messages: LLMMessage[],
    options: {
      temperature?: number;
      maxTokens?: number;
      userId?: string;
    } = {}
  ): Promise<LLMResponse> {
    try {
      switch (model) {
        case "gpt-4":
        case "gpt-3.5-turbo":
          return await this.generateOpenAIResponse(model, messages, options);
        
        case "claude-3-sonnet":
        case "claude-3-opus":
          return await this.generateAnthropicResponse(model, messages, options);
        
        case "gemini-pro":
          return await this.generateGeminiResponse(model, messages, options);
        
        default:
          throw new Error(`Unsupported model: ${model}`);
      }
    } catch (error) {
      logger.error("LLM generation error:", error);
      throw error;
    }
  }

  private async generateOpenAIResponse(
    model: string,
    messages: LLMMessage[],
    options: { temperature?: number; maxTokens?: number }
  ): Promise<LLMResponse> {
    if (!this.openai) {
      throw new Error("OpenAI client not initialized");
    }

    const completion = await this.openai.chat.completions.create({
      model,
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
    });

    return {
      content: completion.choices[0].message.content || "",
      model,
      usage: {
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
        totalTokens: completion.usage?.total_tokens,
      },
    };
  }

  private async generateAnthropicResponse(
    model: string,
    messages: LLMMessage[],
    options: { temperature?: number; maxTokens?: number }
  ): Promise<LLMResponse> {
    if (!this.anthropic) {
      throw new Error("Anthropic client not initialized");
    }

    const systemMessage = messages.find(m => m.role === "system");
    const userMessages = messages.filter(m => m.role !== "system");

    const response = await this.anthropic.messages.create({
      model: model === "claude-3-sonnet" ? "claude-3-sonnet-20240229" : "claude-3-opus-20240229",
      max_tokens: options.maxTokens || 2000,
      temperature: options.temperature || 0.7,
      system: systemMessage?.content,
      messages: userMessages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    return {
      content: response.content[0].type === "text" ? response.content[0].text : "",
      model,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    };
  }

  private async generateGeminiResponse(
    model: string,
    messages: LLMMessage[],
    options: { temperature?: number; maxTokens?: number }
  ): Promise<LLMResponse> {
    if (!this.gemini) {
      throw new Error("Gemini client not initialized");
    }

    const geminiModel = this.gemini.getGenerativeModel({ model: "gemini-pro" });
    
    const lastMessage = messages[messages.length - 1];
    const prompt = messages
      .filter(m => m.role !== "assistant")
      .map(m => `${m.role}: ${m.content}`)
      .join("\\n\\n");

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      content: text,
      model,
    };
  }

  getAvailableModels(): string[] {
    const models: string[] = [];
    
    if (this.openai) {
      models.push("gpt-4", "gpt-3.5-turbo");
    }
    
    if (this.anthropic) {
      models.push("claude-3-sonnet", "claude-3-opus");
    }
    
    if (this.gemini) {
      models.push("gemini-pro");
    }
    
    return models;
  }
}

export const llmRouter = new MultiLLMRouter();