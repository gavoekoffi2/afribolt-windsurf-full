import { llmRouter, LLMMessage } from "../llm/router";
import { logger } from "../utils/logger";

export interface DeepCodeAnalysis {
  quality: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  security: {
    vulnerabilities: string[];
    recommendations: string[];
    score: number;
  };
  performance: {
    bottlenecks: string[];
    optimizations: string[];
    score: number;
  };
  architecture: {
    patterns: string[];
    improvements: string[];
    score: number;
  };
  overall: {
    score: number;
    readyForProduction: boolean;
    criticalIssues: string[];
  };
}

export interface DeepCodeGeneration {
  code: string;
  explanation: string;
  tests: string[];
  documentation: string;
  dependencies: string[];
  deployment: string;
}

const DEFAULT_ANALYSIS: DeepCodeAnalysis = {
  quality: { score: 0, issues: [], suggestions: [] },
  security: { vulnerabilities: [], recommendations: [], score: 0 },
  performance: { bottlenecks: [], optimizations: [], score: 0 },
  architecture: { patterns: [], improvements: [], score: 0 },
  overall: { score: 0, readyForProduction: false, criticalIssues: [] },
};

const DEFAULT_GENERATION: DeepCodeGeneration = {
  code: "",
  explanation: "",
  tests: [],
  documentation: "",
  dependencies: [],
  deployment: "",
};

function safeJsonParse<T>(content: string, fallback: T): T {
  try {
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
    return JSON.parse(jsonStr) as T;
  } catch {
    try {
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        return JSON.parse(content.substring(start, end + 1)) as T;
      }
    } catch {
      // Fall through
    }
    logger.warn("Failed to parse JSON from LLM response, using fallback");
    return fallback;
  }
}

export class DeepCodeEngine {
  private systemPrompt: string = `Tu es DeepCode, le moteur d'analyse et de generation de code avance d'AFRIBOLT.
Reponds toujours en JSON structure avec analyses detaillees et recommandations actionnables.`;

  async analyzeCode(
    code: string,
    context: {
      language: string;
      framework?: string;
      purpose?: string;
      environment?: string;
    } = { language: "javascript" }
  ): Promise<DeepCodeAnalysis> {
    try {
      const analysisPrompt = `Analyse ce code en profondeur:

CODE:
\`\`\`${context.language}
${code}
\`\`\`

CONTEXTE: Langage: ${context.language}, Framework: ${context.framework || "N/A"}, Purpose: ${context.purpose || "N/A"}, Environment: ${context.environment || "N/A"}

Fournis une analyse JSON:
{ "quality": { "score": 0-100, "issues": [], "suggestions": [] }, "security": { "score": 0-100, "vulnerabilities": [], "recommendations": [] }, "performance": { "score": 0-100, "bottlenecks": [], "optimizations": [] }, "architecture": { "score": 0-100, "patterns": [], "improvements": [] }, "overall": { "score": 0-100, "readyForProduction": boolean, "criticalIssues": [] } }

Reponds UNIQUEMENT en JSON valide.`;

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: analysisPrompt },
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.1,
        maxTokens: 3000,
      });

      const analysis = safeJsonParse<DeepCodeAnalysis>(response.content, DEFAULT_ANALYSIS);
      analysis.quality.score = Math.min(100, Math.max(0, analysis.quality.score || 0));
      analysis.security.score = Math.min(100, Math.max(0, analysis.security.score || 0));
      analysis.performance.score = Math.min(100, Math.max(0, analysis.performance.score || 0));
      analysis.architecture.score = Math.min(100, Math.max(0, analysis.architecture.score || 0));
      analysis.overall.score = Math.min(100, Math.max(0, analysis.overall.score || 0));

      logger.info("DeepCode analysis completed", {
        overallScore: analysis.overall?.score,
        readyForProduction: analysis.overall?.readyForProduction,
      });

      return analysis;
    } catch (error) {
      logger.error("DeepCode analysis failed:", error);
      throw new Error("DeepCode analysis failed: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }

  async generateCode(
    description: string,
    context: {
      type: "frontend" | "backend" | "fullstack";
      language: string;
      framework?: string;
      features?: string[];
      complexity?: "simple" | "medium" | "complex";
    }
  ): Promise<DeepCodeGeneration> {
    try {
      const generationPrompt = `Genere du code ${context.type} production-ready:
DESCRIPTION: ${description}
CONTEXTE: Type: ${context.type}, Langage: ${context.language}, Framework: ${context.framework || "N/A"}, Features: ${context.features?.join(", ") || "N/A"}, Complexite: ${context.complexity || "medium"}

Reponds en JSON: { "code": "...", "explanation": "...", "tests": [], "documentation": "...", "dependencies": [], "deployment": "..." }`;

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: generationPrompt },
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.3,
        maxTokens: 4000,
      });

      const generation = safeJsonParse<DeepCodeGeneration>(response.content, {
        ...DEFAULT_GENERATION,
        code: response.content,
        explanation: "Code generated from description",
      });

      logger.info("DeepCode generation completed", {
        type: context.type,
        language: context.language,
        codeLength: generation.code?.length,
      });

      return generation;
    } catch (error) {
      logger.error("DeepCode generation failed:", error);
      throw new Error("DeepCode generation failed: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }

  async optimizeCode(
    code: string,
    issues: string[],
    context: {
      language: string;
      optimizationGoals: ("performance" | "security" | "maintainability" | "readability")[];
    }
  ): Promise<DeepCodeGeneration> {
    try {
      const optimizationPrompt = `Optimise ce code:
CODE:
\`\`\`${context.language}
${code}
\`\`\`
PROBLEMES: ${issues.map((i) => `- ${i}`).join("\n")}
OBJECTIFS: ${context.optimizationGoals.join(", ")}
Reponds en JSON: { "code": "...", "explanation": "...", "tests": [], "documentation": "...", "dependencies": [], "deployment": "..." }`;

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: optimizationPrompt },
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.2,
        maxTokens: 4000,
      });

      const optimization = safeJsonParse<DeepCodeGeneration>(response.content, {
        ...DEFAULT_GENERATION,
        code: code,
        explanation: "Optimization attempted",
      });

      logger.info("DeepCode optimization completed", {
        issuesResolved: issues.length,
        optimizationGoals: context.optimizationGoals,
      });

      return optimization;
    } catch (error) {
      logger.error("DeepCode optimization failed:", error);
      throw new Error("DeepCode optimization failed: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }

  async validateCodeQuality(
    code: string,
    context: {
      language: string;
      standards: string[];
      environment: "development" | "staging" | "production";
    }
  ): Promise<{
    passed: boolean;
    score: number;
    violations: string[];
    recommendations: string[];
    nextSteps: string[];
  }> {
    try {
      const validationPrompt = `Valide la qualite de ce code:
CODE:
\`\`\`${context.language}
${code}
\`\`\`
STANDARDS: ${context.standards.join(", ")}
ENVIRONNEMENT: ${context.environment}
Reponds en JSON: { "passed": boolean, "score": 0-100, "violations": [], "recommendations": [], "nextSteps": [] }`;

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: validationPrompt },
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.1,
        maxTokens: 2000,
      });

      const defaultValidation = { passed: false, score: 0, violations: [] as string[], recommendations: [] as string[], nextSteps: [] as string[] };
      const validation = safeJsonParse(response.content, defaultValidation);
      validation.score = Math.min(100, Math.max(0, validation.score || 0));

      return validation;
    } catch (error) {
      logger.error("DeepCode validation failed:", error);
      throw new Error("DeepCode validation failed: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }

  async generateDocumentation(
    code: string,
    context: {
      language: string;
      purpose: string;
      audience: "developers" | "users" | "api";
    }
  ): Promise<{
    apiDocs: string;
    userGuide: string;
    developerGuide: string;
    examples: string[];
    troubleshooting: string[];
  }> {
    try {
      const docPrompt = `Genere une documentation pour ce code:
CODE:
\`\`\`${context.language}
${code}
\`\`\`
Purpose: ${context.purpose}, Audience: ${context.audience}
Reponds en JSON: { "apiDocs": "...", "userGuide": "...", "developerGuide": "...", "examples": [], "troubleshooting": [] }`;

      const messages: LLMMessage[] = [
        { role: "system", content: "Tu es un expert en documentation technique." },
        { role: "user", content: docPrompt },
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.3,
        maxTokens: 3000,
      });

      const defaultDocs = { apiDocs: "", userGuide: "", developerGuide: "", examples: [] as string[], troubleshooting: [] as string[] };
      return safeJsonParse(response.content, defaultDocs);
    } catch (error) {
      logger.error("Documentation generation failed:", error);
      throw error;
    }
  }
}

export const deepCodeEngine = new DeepCodeEngine();
