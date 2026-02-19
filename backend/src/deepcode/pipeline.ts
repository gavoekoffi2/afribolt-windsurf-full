import { deepCodeEngine, DeepCodeAnalysis, DeepCodeGeneration } from "./core";
import { llmRouter, LLMMessage } from "../llm/router";
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
      framework: context.framework,
    });

    try {
      // Step 1: Initial generation
      currentGeneration = await deepCodeEngine.generateCode(description, context);
      currentCode = currentGeneration.code;

      // Step 2: Initial analysis
      currentAnalysis = await deepCodeEngine.analyzeCode(currentCode, {
        language: context.language,
        framework: context.framework,
        purpose: description,
        environment: "production",
      });

      iterations = 1;

      // Step 3: Iterative optimization pipeline
      if (this.config.autoOptimization && !this.meetsThresholds(currentAnalysis)) {
        const result = await this.optimizeIteratively(
          currentCode,
          currentAnalysis,
          context,
          iterations,
          improvements,
          warnings
        );
        iterations = result.iterations;
        currentCode = result.code;
        currentAnalysis = result.analysis;
      }

      // Step 4: Final validation
      const finalValidation = await deepCodeEngine.validateCodeQuality(currentCode, {
        language: context.language,
        standards: ["production-ready", "secure", "performant", "maintainable"],
        environment: "production",
      });

      const pipelineResult: PipelineResult = {
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
        success: pipelineResult.success,
        iterations: pipelineResult.iterations,
        readyForProduction: pipelineResult.readyForProduction,
        overallScore: pipelineResult.analysis.overall.score,
      });

      return pipelineResult;
    } catch (error) {
      logger.error("DeepCode pipeline failed:", error);
      throw error;
    }
  }

  private async optimizeIteratively(
    code: string,
    analysis: DeepCodeAnalysis,
    context: { language: string; framework?: string; purpose?: string },
    currentIteration: number,
    improvements: string[],
    warnings: string[]
  ): Promise<{ iterations: number; code: string; analysis: DeepCodeAnalysis }> {
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
        const optimization = await deepCodeEngine.optimizeCode(currentCode, allIssues, {
          language: context.language,
          optimizationGoals: ["performance", "security", "maintainability"],
        });

        currentCode = optimization.code;
        if (optimization.explanation) {
          improvements.push(
            ...optimization.explanation.split("\n").filter((line: string) => line.trim())
          );
        }

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
        warnings.push(`Optimization iteration ${iteration} failed`);
        break;
      }
    }

    return { iterations: iteration, code: currentCode, analysis: currentAnalysis };
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

      if (analysis.quality.issues.length > 0) {
        recommendations.push(...analysis.quality.suggestions);
      }
      if (analysis.security.vulnerabilities.length > 0) {
        recommendations.push(...analysis.security.recommendations);
      }
      if (analysis.performance.bottlenecks.length > 0) {
        recommendations.push(...analysis.performance.optimizations);
      }

      return { analysis, recommendations, approvalStatus, nextSteps };
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
    return deepCodeEngine.generateDocumentation(code, context);
  }
}

export const deepCodePipeline = new DeepCodePipeline();
