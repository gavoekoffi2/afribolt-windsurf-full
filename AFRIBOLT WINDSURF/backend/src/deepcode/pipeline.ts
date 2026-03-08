import { deepCodeEngine, DeepCodeAnalysis, DeepCodeGeneration } from "./core";
import { logger } from "../utils/logger";

export interface PipelineConfig {
  autoOptimization: boolean;
  qualityThreshold: number;
  securityThreshold: number;
  performanceThreshold: number;
  maxIterations: number;
}

export interface PipelineResult {
  success: boolean;
  iterations: number;
  finalCode: string;
  analysis: DeepCodeAnalysis;
  generation: DeepCodeGeneration;
  improvements: string[];
  warnings: string[];
  readyForProduction: boolean;
}

export class DeepCodePipeline {
  private config: PipelineConfig;

  constructor(config: Partial<PipelineConfig> = {}) {
    this.config = {
      autoOptimization: true,
      qualityThreshold: 80,
      securityThreshold: 85,
      performanceThreshold: 75,
      maxIterations: 3,
      ...config,
    };
  }

  async processGenerationRequest(
    description: string,
    context: {
      type: "frontend" | "backend" | "fullstack";
      language: string;
      framework?: string;
      features?: string[];
      complexity?: "simple" | "medium" | "complex";
    }
  ): Promise<PipelineResult> {
    let iterations = 0;
    let currentCode = "";
    let currentAnalysis: DeepCodeAnalysis | null = null;
    let currentGeneration: DeepCodeGeneration | null = null;
    const improvements: string[] = [];
    const warnings: string[] = [];

    logger.info("Starting DeepCode pipeline", { 
      type: context.type,
      language: context.language,
      framework: context.framework 
    });

    try {
      // Étape 1: Génération initiale
      currentGeneration = await deepCodeEngine.generateCode(description, context);
      currentCode = currentGeneration.code;

      // Étape 2: Analyse initiale
      currentAnalysis = await deepCodeEngine.analyzeCode(currentCode, {
        language: context.language,
        framework: context.framework,
        purpose: description,
        environment: "production",
      });

      iterations = 1;

      // Étape 3: Pipeline d'optimisation itérative
      if (this.config.autoOptimization && !this.meetsThresholds(currentAnalysis)) {
        iterations = await this.optimizeIteratively(
          currentCode,
          currentAnalysis,
          context,
          iterations,
          improvements,
          warnings
        );
      }

      // Étape 4: Validation finale
      const finalValidation = await deepCodeEngine.validateCodeQuality(currentCode, {
        language: context.language,
        standards: ["production-ready", "secure", "performant", "maintainable"],
        environment: "production",
      });

      const result: PipelineResult = {
        success: finalValidation.passed,
        iterations,
        finalCode: currentCode,
        analysis: currentAnalysis!,
        generation: currentGeneration!,
        improvements,
        warnings,
        readyForProduction: finalValidation.passed && finalValidation.score >= 80,
      };

      logger.info("DeepCode pipeline completed", {
        success: result.success,
        iterations: result.iterations,
        readyForProduction: result.readyForProduction,
        overallScore: result.analysis.overall.score,
      });

      return result;
    } catch (error) {
      logger.error("DeepCode pipeline failed:", error);
      throw error;
    }
  }

  private async optimizeIteratively(
    code: string,
    analysis: DeepCodeAnalysis,
    context: any,
    currentIteration: number,
    improvements: string[],
    warnings: string[]
  ): Promise<number> {
    let currentCode = code;
    let currentAnalysis = analysis;
    let iteration = currentIteration;

    while (
      iteration < this.config.maxIterations &&
      !this.meetsThresholds(currentAnalysis)
    ) {
      iteration++;

      logger.info(`Optimization iteration ${iteration}`, {
        qualityScore: currentAnalysis.quality.score,
        securityScore: currentAnalysis.security.score,
        performanceScore: currentAnalysis.performance.score,
      });

      // Collecter tous les problèmes à corriger
      const allIssues = [
        ...currentAnalysis.quality.issues,
        ...currentAnalysis.security.vulnerabilities,
        ...currentAnalysis.performance.bottlenecks,
        ...currentAnalysis.architecture.improvements,
      ];

      if (allIssues.length === 0) {
        warnings.push("No specific issues found but thresholds not met");
        break;
      }

      try {
        // Optimiser le code
        const optimization = await deepCodeEngine.optimizeCode(currentCode, allIssues, {
          language: context.language,
          optimizationGoals: ["performance", "security", "maintainability"],
        });

        currentCode = optimization.code;
        improvements.push(...(optimization.explanation.split("\n").filter((line: string) => line.trim())));

        // Ré-analyser le code optimisé
        currentAnalysis = await deepCodeEngine.analyzeCode(currentCode, {
          language: context.language,
          framework: context.framework,
          purpose: context.purpose,
          environment: "production",
        });

        logger.info(`Iteration ${iteration} completed`, {
          newQualityScore: currentAnalysis.quality.score,
          newSecurityScore: currentAnalysis.security.score,
          newPerformanceScore: currentAnalysis.performance.score,
        });
      } catch (error) {
        logger.error(`Optimization iteration ${iteration} failed:`, error);
        warnings.push(`Optimization iteration ${iteration} failed: ${error}`);
        break;
      }
    }

    return iteration;
  }

  private meetsThresholds(analysis: DeepCodeAnalysis): boolean {
    return (
      analysis.quality.score >= this.config.qualityThreshold &&
      analysis.security.score >= this.config.securityThreshold &&
      analysis.performance.score >= this.config.performanceThreshold &&
      analysis.overall.readyForProduction
    );
  }

  async processCodeReview(
    code: string,
    context: {
      language: string;
      framework?: string;
      purpose?: string;
    }
  ): Promise<{
    analysis: DeepCodeAnalysis;
    recommendations: string[];
    approvalStatus: "approved" | "needs_review" | "rejected";
    nextSteps: string[];
  }> {
    try {
      const analysis = await deepCodeEngine.analyzeCode(code, context);
      
      let approvalStatus: "approved" | "needs_review" | "rejected" = "approved";
      const recommendations: string[] = [];
      const nextSteps: string[] = [];

      // Évaluer le statut d'approbation
      if (analysis.overall.criticalIssues.length > 0) {
        approvalStatus = "rejected";
        recommendations.push("Critical issues must be resolved before approval");
        nextSteps.push("Fix all critical security and performance issues");
      } else if (!this.meetsThresholds(analysis)) {
        approvalStatus = "needs_review";
        recommendations.push("Code needs optimization before production deployment");
        nextSteps.push("Address quality and performance recommendations");
      } else {
        recommendations.push("Code meets production standards");
        nextSteps.push("Ready for deployment to production");
      }

      // Ajouter les recommandations spécifiques
      if (analysis.quality.issues.length > 0) {
        recommendations.push("Quality improvements needed", ...analysis.quality.suggestions);
      }
      if (analysis.security.vulnerabilities.length > 0) {
        recommendations.push("Security vulnerabilities to address", ...analysis.security.recommendations);
      }
      if (analysis.performance.bottlenecks.length > 0) {
        recommendations.push("Performance optimizations available", ...analysis.performance.optimizations);
      }

      return {
        analysis,
        recommendations,
        approvalStatus,
        nextSteps,
      };
    } catch (error) {
      logger.error("Code review failed:", error);
      throw error;
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
      const docPrompt = `Génère une documentation complète pour ce code:

CODE:
\`\`\`${context.language}
${code}
\`\`\`

CONTEXTE:
- Purpose: ${context.purpose}
- Audience: ${context.audience}

GÉNÈRE:
1. Documentation API détaillée
2. Guide utilisateur
3. Guide développeur  
4. Exemples d'utilisation
5. Guide de dépannage

La documentation doit être:
- Complète et précise
- Facile à comprendre
- Inclure des exemples pratiques
- Couvrir tous les cas d'usage

Réponds en JSON structuré.`;

      const messages = [
        { role: "system", content: "Tu es un expert en documentation technique." },
        { role: "user", content: docPrompt }
      ];

      const response = await deepCodeEngine["generateResponse"]("gpt-4", messages, {
        temperature: 0.3,
        maxTokens: 3000,
      });

      const docs = JSON.parse(response.content);
      
      logger.info("Documentation generated successfully", {
        audience: context.audience,
        language: context.language,
      });

      return docs;
    } catch (error) {
      logger.error("Documentation generation failed:", error);
      throw error;
    }
  }
}

export const deepCodePipeline = new DeepCodePipeline();
