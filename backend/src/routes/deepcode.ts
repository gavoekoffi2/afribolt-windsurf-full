import { Router } from "express";
import { deepCodeEngine, DeepCodeAnalysis } from "../deepcode/core";
import { deepCodePipeline, PipelineResult } from "../deepcode/pipeline";
import { authenticate, AuthRequest } from "../middleware/auth";
import { validateDeepCode } from "../middleware/validation";
import { logger } from "../utils/logger";
import { createError } from "../middleware/errorHandler";

const router = Router();

// Analyze code with DeepCode
router.post("/analyze", authenticate, validateDeepCode, async (req: AuthRequest, res, next) => {
  try {
    const { code, context } = req.body;

    const analysis = await deepCodeEngine.analyzeCode(code, {
      language: context.language || "javascript",
      framework: context.framework,
      purpose: context.purpose || "code-analysis",
      environment: "production",
    });

    logger.info("DeepCode analysis completed", {
      userId: req.user!.id,
      language: context.language,
      overallScore: analysis.overall.score,
    });

    res.json({
      success: true,
      data: {
        analysis,
        recommendations: [
          ...analysis.quality.suggestions,
          ...analysis.security.recommendations,
          ...analysis.performance.optimizations,
        ],
        readyForProduction: analysis.overall.readyForProduction,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Generate code with DeepCode pipeline
router.post("/generate", authenticate, validateDeepCode, async (req: AuthRequest, res, next) => {
  try {
    const { description, context } = req.body;

    const pipelineResult = await deepCodePipeline.processGenerationRequest(
      description,
      context
    );

    logger.info("DeepCode generation completed", {
      userId: req.user!.id,
      type: context.type,
      language: context.language,
      iterations: pipelineResult.iterations,
      readyForProduction: pipelineResult.readyForProduction,
    });

    res.json({
      success: true,
      data: {
        pipelineResult,
        generatedCode: pipelineResult.finalCode,
        analysis: pipelineResult.analysis,
        improvements: pipelineResult.improvements,
        readyForProduction: pipelineResult.readyForProduction,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Optimize existing code with DeepCode
router.post("/optimize", authenticate, validateDeepCode, async (req: AuthRequest, res, next) => {
  try {
    const { code, issues, context } = req.body;

    const optimization = await deepCodeEngine.optimizeCode(code, issues, {
      language: context.language,
      optimizationGoals: context.optimizationGoals || ["performance", "security"],
    });

    // Analyze the optimized code
    const optimizedAnalysis = await deepCodeEngine.analyzeCode(optimization.code, {
      language: context.language,
      framework: context.framework,
      purpose: "optimized-code",
      environment: "production",
    });

    logger.info("DeepCode optimization completed", {
      userId: req.user!.id,
      language: context.language,
      issuesResolved: issues.length,
      qualityImprovement: optimizedAnalysis.quality.score,
    });

    res.json({
      success: true,
      data: {
        optimizedCode: optimization.code,
        explanation: optimization.explanation,
        tests: optimization.tests,
        documentation: optimization.documentation,
        analysis: optimizedAnalysis,
        improvements: optimization.explanation.split("\n").filter(line => line.trim()),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Validate code quality
router.post("/validate", authenticate, validateDeepCode, async (req: AuthRequest, res, next) => {
  try {
    const { code, context } = req.body;

    const validation = await deepCodeEngine.validateCodeQuality(code, {
      language: context.language || "javascript",
      standards: context.standards || ["production-ready", "secure", "performant"],
      environment: context.environment || "production",
    });

    logger.info("DeepCode validation completed", {
      userId: req.user!.id,
      language: context.language,
      passed: validation.passed,
      score: validation.score,
    });

    res.json({
      success: true,
      data: validation,
    });
  } catch (error) {
    next(error);
  }
});

// Generate documentation
router.post("/docs", authenticate, validateDeepCode, async (req: AuthRequest, res, next) => {
  try {
    const { code, context } = req.body;

    const docs = await deepCodeEngine["generateDocumentation"](code, {
      language: context.language || "javascript",
      purpose: context.purpose || "documentation",
      audience: context.audience || "developers",
    });

    logger.info("DeepCode documentation generated", {
      userId: req.user!.id,
      language: context.language,
      audience: context.audience,
    });

    res.json({
      success: true,
      data: docs,
    });
  } catch (error) {
    next(error);
  }
});

// Get DeepCode capabilities and status
router.get("/status", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const status = {
      deepCode: {
        available: true,
        version: "1.0.0",
        capabilities: [
          "code-analysis",
          "code-generation",
          "code-optimization",
          "quality-validation",
          "documentation-generation",
          "security-analysis",
          "performance-analysis",
          "architecture-review",
        ],
        supportedLanguages: [
          "javascript",
          "typescript",
          "python",
          "java",
          "go",
          "rust",
          "csharp",
          "php",
          "ruby",
        ],
        supportedFrameworks: [
          "react",
          "nextjs",
          "vue",
          "angular",
          "express",
          "fastapi",
          "django",
          "flask",
          "spring",
          "dotnet",
        ],
        qualityMetrics: {
          minScore: 70,
          targetScore: 85,
          excellentScore: 95,
        },
      },
    };

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
});

// Batch analyze multiple files
router.post("/batch-analyze", authenticate, validateDeepCode, async (req: AuthRequest, res, next) => {
  try {
    const { files } = req.body; // Array of { name, code, context }

    const results = await Promise.all(
      files.map(async (file: any) => {
        const analysis = await deepCodeEngine.analyzeCode(file.code, file.context);
        return {
          name: file.name,
          analysis,
          passed: analysis.overall.score >= 80,
          score: analysis.overall.score,
        };
      })
    );

    const overallScore = results.reduce((sum, result) => sum + result.score, 0) / results.length;
    const allPassed = results.every(result => result.passed);

    logger.info("DeepCode batch analysis completed", {
      userId: req.user!.id,
      filesCount: files.length,
      overallScore,
      allPassed,
    });

    res.json({
      success: true,
      data: {
        results,
        overall: {
          score: overallScore,
          passed: allPassed,
          filesCount: files.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export { router as deepcodeRoutes };
