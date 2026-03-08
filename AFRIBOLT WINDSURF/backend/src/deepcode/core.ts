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

export class DeepCodeEngine {
  private safeParseJSON<T>(content: string, fallback: T): T {
    try {
      // Try to extract JSON from markdown code blocks first
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      return JSON.parse(jsonStr) as T;
    } catch {
      logger.warn("Failed to parse LLM JSON response, using fallback");
      return fallback;
    }
  }

  private systemPrompt: string = `Tu es DeepCode, le moteur d'analyse et génération de code le plus avancé.

CAPACITÉS PRINCIPALES:
🧬 Paper2Code: Conversion d'algorithmes de recherche en code production-ready
🎨 Text2Web: Génération frontend complète à partir de descriptions textuelles  
⚙️ Text2Backend: Génération backend robuste et scalable

ANALYSE APPROFONDIE:
- Qualité de code: syntaxe, patterns, best practices
- Sécurité: vulnérabilités, injection, authentification
- Performance: optimisation, bottlenecks, scalabilité
- Architecture: patterns, modularité, maintenabilité

GÉNÉRATION AVANCÉE:
- Code production-ready avec tests unitaires
- Documentation technique complète
- Configuration déploiement incluse
- Optimisation automatique intégrée

STANDARDS DE QUALITÉ:
- Code propre, lisible et maintenable
- Tests unitaires > 80% couverture
- Documentation exhaustive
- Sécurité renforcée
- Performance optimisée

Réponds toujours en JSON structuré avec analyses détaillées et recommandations actionnables.`;

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

CONTEXTE:
- Langage: ${context.language}
- Framework: ${context.framework || "N/A"}
- Purpose: ${context.purpose || "N/A"}
- Environment: ${context.environment || "N/A"}

Fournis une analyse JSON structurée avec:
1. quality: score 0-100, issues[], suggestions[]
2. security: score 0-100, vulnerabilities[], recommendations[]
3. performance: score 0-100, bottlenecks[], optimizations[]
4. architecture: score 0-100, patterns[], improvements[]
5. overall: score 0-100, readyForProduction, criticalIssues[]

Sois critique mais constructif. Identifie les vrais problèmes et propose des solutions concrètes.`;

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: analysisPrompt }
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.1,
        maxTokens: 3000,
      });

      // Parse JSON response safely
      const analysis = this.safeParseJSON<DeepCodeAnalysis>(response.content, {
        quality: { score: 50, issues: [], suggestions: [] },
        security: { vulnerabilities: [], recommendations: [], score: 50 },
        performance: { bottlenecks: [], optimizations: [], score: 50 },
        architecture: { patterns: [], improvements: [], score: 50 },
        overall: { score: 50, readyForProduction: false, criticalIssues: ["Unable to parse LLM response"] },
      });

      logger.info("DeepCode analysis completed", {
        overallScore: analysis.overall?.score,
        readyForProduction: analysis.overall?.readyForProduction
      });

      return analysis;
    } catch (error) {
      logger.error("DeepCode analysis failed:", error);
      throw new Error("DeepCode analysis failed");
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
      const generationPrompt = `Génère du code ${context.type} production-ready:

DESCRIPTION:
${description}

CONTEXTE:
- Type: ${context.type}
- Langage: ${context.language}
- Framework: ${context.framework || "N/A"}
- Features: ${context.features?.join(", ") || "N/A"}
- Complexité: ${context.complexity || "medium"}

GÉNÈRE:
1. Code principal complet et optimisé
2. Tests unitaires (>80% couverture)
3. Documentation technique
4. Dépendances requises
5. Configuration déploiement
6. Explication de l'architecture

Le code doit être:
- Production-ready immédiatement
- Sécurisé et performant
- Bien documenté
- Testé complètement
- Facile à maintenir

Réponds en JSON structuré avec: code, explanation, tests[], documentation, dependencies[], deployment`;

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: generationPrompt }
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.3,
        maxTokens: 4000,
      });

      const generation = this.safeParseJSON<DeepCodeGeneration>(response.content, {
        code: "",
        explanation: "Failed to parse generation response",
        tests: [],
        documentation: "",
        dependencies: [],
        deployment: "",
      });

      logger.info("DeepCode generation completed", {
        type: context.type,
        language: context.language,
        codeLength: generation.code?.length
      });

      return generation;
    } catch (error) {
      logger.error("DeepCode generation failed:", error);
      throw new Error("DeepCode generation failed");
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
      const optimizationPrompt = `Optimise ce code basé sur les problèmes identifiés:

CODE ORIGINAL:
\`\`\`${context.language}
${code}
\`\`\`

PROBLÈMES À RÉSOUDRE:
${issues.map(issue => `- ${issue}`).join("\n")}

OBJECTIFS D'OPTIMISATION:
${context.optimizationGoals.join(", ")}

GÉNÈRE:
1. Code optimisé et corrigé
2. Explication des améliorations
3. Tests mis à jour
4. Documentation mise à jour
5. Impact des optimisations

Le code optimisé doit:
- Résoudre tous les problèmes identifiés
- Atteindre les objectifs d'optimisation
- Maintenir la fonctionnalité
- Être production-ready

Réponds en JSON structuré avec: code, explanation, tests[], documentation, dependencies[], deployment`;

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: optimizationPrompt }
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.2,
        maxTokens: 4000,
      });

      const optimization = this.safeParseJSON<DeepCodeGeneration>(response.content, {
        code: code,
        explanation: "Failed to parse optimization response",
        tests: [],
        documentation: "",
        dependencies: [],
        deployment: "",
      });

      logger.info("DeepCode optimization completed", {
        issuesResolved: issues.length,
        optimizationGoals: context.optimizationGoals
      });

      return optimization;
    } catch (error) {
      logger.error("DeepCode optimization failed:", error);
      throw new Error("DeepCode optimization failed");
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
      const validationPrompt = `Valide la qualité de ce code selon les standards:

CODE:
\`\`\`${context.language}
${code}
\`\`\`

STANDARDS À VÉRIFIER:
${context.standards.map(standard => `- ${standard}`).join("\n")}

ENVIRONNEMENT: ${context.environment}

VALIDATION:
- Respect des standards de codage
- Qualité et maintenabilité
- Sécurité et performance
- Préparation production

Réponds en JSON avec: passed, score 0-100, violations[], recommendations[], nextSteps[]`;

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: validationPrompt }
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.1,
        maxTokens: 2000,
      });

      const validation = this.safeParseJSON(response.content, {
        passed: false,
        score: 0,
        violations: ["Unable to parse validation response"],
        recommendations: [],
        nextSteps: ["Retry validation"],
      });

      logger.info("DeepCode validation completed", {
        passed: validation.passed,
        score: validation.score,
        violations: validation.violations?.length
      });

      return validation;
    } catch (error) {
      logger.error("DeepCode validation failed:", error);
      throw new Error("DeepCode validation failed");
    }
  }
}

export const deepCodeEngine = new DeepCodeEngine();
