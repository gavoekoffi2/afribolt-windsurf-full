import { llmRouter, LLMMessage } from "../llm/router";
import { deepCodePipeline, PipelineResult } from "../deepcode/pipeline";
import { deepCodeEngine, DeepCodeAnalysis } from "../deepcode/core";
import { logger } from "../utils/logger";

export interface KwamiDocumentationSolution {
  technicalDocs: Array<{
    title: string;
    content: string;
    type: "api" | "guide" | "reference" | "tutorial";
    audience: "developers" | "users" | "admins";
    code: string[];
    examples: string[];
  }>;
  userGuides: Array<{
    title: string;
    description: string;
    steps: string[];
    screenshots: string[];
    troubleshooting: string[];
  }>;
  apiDocs: {
    endpoints: Array<{
      method: string;
      path: string;
      description: string;
      parameters: string[];
      responses: string[];
      examples: string[];
    }>;
    schemas: string[];
    authentication: string;
  };
  codeExamples: Array<{
    language: string;
    title: string;
    description: string;
    code: string;
    explanation: string[];
  }>;
  deepCodeValidation: {
    documentationScore: number;
    completenessScore: number;
    clarityScore: number;
    recommendations: string[];
  };
}

export class KWAMI_Enhanced {
  private systemPrompt: string = `Tu es KWAMI, le Documentation & Knowledge AI expert d'AFRIBOLT, augmenté par DeepCode pour une documentation exceptionnelle.

📚 RÔLE PRINCIPAL:
- Rédacteur technique expert et pédagogue
- Spécialiste en documentation utilisateur et développeur
- Créateur de guides et tutoriels complets
- Garant de la clarté et exhaustivité

🧠 CAPACITÉS DEEPCODE INTÉGRÉES:
- Génération de documentation technique automatique
- Analyse de code pour extraire la documentation
- Validation de la clarté et complétude
- Optimisation des exemples et tutoriels
- Création de références API interactives

🎯 SPÉCIALITÉS DOCUMENTATION:
- Documentation technique et API
- Guides utilisateurs et tutoriels
- README et documentation de projet
- Knowledge bases et FAQs
- Documentation interactive et vivante

📊 MÉTRIQUES D'EXCELLENCE:
- Documentation quality score > 90%
- Completeness score > 95%
- Clarity score > 90%
- User satisfaction > 85%
- Production readiness validée

🔧 PROCESSUS DOCUMENTATION:
1. Analyse du code et des besoins
2. Extraction automatique de la documentation
3. Création de guides structurés
4. Génération d'exemples pratiques
5. Validation avec DeepCode
6. Optimisation continue

🎨 PERSONNALITÉ:
- Pédagogue et communicatif
- Organisé et méthodique
- Orienté utilisateur et clarté
- Expert technique et vulgarisateur
- Passionné par la connaissance

Réponds toujours en français avec expertise documentation, en intégrant les analyses DeepCode pour garantir une documentation exceptionnelle et utile.`;

  async processRequest(
    message: string,
    context: any = {},
    model: string = "gpt-4"
  ): Promise<any> {
    try {
      // Analyser les besoins documentation
      const documentationAnalysis = await this.analyzeDocumentationNeeds(message, context);

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { 
          role: "user", 
          content: `Analyse documentation: ${JSON.stringify(documentationAnalysis, null, 2)}
\n\nMessage: ${message}
\n\nContexte: ${JSON.stringify(context, null, 2)}`
        }
      ];

      const response = await llmRouter.generateResponse(model, messages, {
        temperature: 0.6,
        maxTokens: 3000,
      });

      // Générer une solution documentation complète
      const documentationSolution = await this.generateDocumentationSolution(message, context);

      logger.info("KWAMI Enhanced processed documentation request", {
        hasDeepCodeAnalysis: !!documentationAnalysis,
        documentationScore: documentationSolution.deepCodeValidation.documentationScore,
        completenessScore: documentationSolution.deepCodeValidation.completenessScore,
      });

      return {
        agent: "KWAMI",
        message: response.content,
        documentationSolution,
        actions: this.extractDocumentationActions(response.content),
        nextSteps: this.extractNextSteps(response.content),
        confidence: 0.95,
      };
    } catch (error) {
      logger.error("KWAMI Enhanced processing error:", error);
      throw error;
    }
  }

  async generateTechnicalDocumentation(
    code: string,
    context: {
      language: string;
      framework: string;
      audience: "developers" | "users" | "admins";
      documentationType: "api" | "guide" | "reference" | "tutorial";
    }
  ): Promise<KwamiDocumentationSolution> {
    try {
      const documentationPrompt = `Génère une documentation technique complète et production-ready:

CODE À DOCUMENTER:
${code}

CONTEXTE:
- Langage: ${context.language}
- Framework: ${context.framework}
- Audience: ${context.audience}
- Type: ${context.documentationType}

GÉNÈRE:
1. Documentation technique structurée
2. Guides utilisateurs détaillés
3. Documentation API complète
4. Exemples de code pratiques
5. Tutoriels pas-à-pas

La documentation doit être:
- Complète et exhaustive
- Claire et facile à comprendre
- Riche en exemples pratiques
- Structurée logiquement
- Production-ready immédiatement

Réponds en JSON structuré avec: technicalDocs, userGuides, apiDocs, codeExamples, deepCodeValidation`;

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: documentationPrompt }
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.3,
        maxTokens: 4000,
      });

      const documentationSolution = JSON.parse(response.content);

      // Valider la documentation avec DeepCode
      const documentationCode = this.generateDocumentationCode(documentationSolution);
      const deepCodeValidation = await deepCodeEngine.analyzeCode(documentationCode, {
        language: "markdown",
        framework: "documentation",
        purpose: "technical-documentation",
        environment: "production",
      });

      documentationSolution.deepCodeValidation = {
        documentationScore: this.calculateDocumentationScore(documentationSolution),
        completenessScore: this.calculateCompletenessScore(documentationSolution),
        clarityScore: this.calculateClarityScore(documentationSolution),
        recommendations: [
          ...deepCodeValidation.quality.suggestions,
          ...this.getDocumentationRecommendations(documentationSolution),
        ],
      };

      logger.info("KWAMI generated technical documentation", {
        language: context.language,
        audience: context.audience,
        type: context.documentationType,
        docsCount: documentationSolution.technicalDocs.length,
        examplesCount: documentationSolution.codeExamples.length,
      });

      return documentationSolution;
    } catch (error) {
      logger.error("KWAMI technical documentation failed:", error);
      throw error;
    }
  }

  async createAPIReference(
    apiCode: string,
    context: {
      framework: string;
      authentication: string;
      endpoints: string[];
      examples: boolean;
      interactive: boolean;
    }
  ): Promise<{
    apiReference: {
      overview: string;
      authentication: string;
      endpoints: Array<{
        method: string;
        path: string;
        description: string;
        parameters: any[];
        responses: any[];
        examples: any[];
      }>;
      schemas: any[];
      errors: any[];
    };
    interactiveDocs: string;
    postmanCollection: string;
    deepCodeAnalysis: DeepCodeAnalysis;
  }> {
    try {
      // Analyser le code API
      const apiAnalysis = await deepCodeEngine.analyzeCode(apiCode, {
        language: "typescript",
        framework: context.framework,
        purpose: "api-documentation",
        environment: "production",
      });

      const apiReferencePrompt = `Crée une référence API complète et interactive:

CODE API:
${apiCode}

CONTEXTE:
- Framework: ${context.framework}
- Authentification: ${context.authentication}
- Endpoints: ${context.endpoints.join(", ")}
- Examples: ${context.examples}
- Interactive: ${context.interactive}

ANALYSE DEEPCODE:
${JSON.stringify(apiAnalysis, null, 2)}

GÉNÈRE:
1. Référence API complète
2. Documentation interactive
3. Collection Postman
4. Schémas de données
5. Gestion d'erreurs

La référence API doit être:
- Complète et précise
- Interactive et testable
- Facile à explorer
- Riche en exemples
- Production-ready

Réponds en JSON structuré.`;

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: apiReferencePrompt }
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.2,
        maxTokens: 3500,
      });

      const apiReference = JSON.parse(response.content);

      // Valider la référence API
      const referenceCode = this.generateAPIReferenceCode(apiReference);
      const referenceAnalysis = await deepCodeEngine.analyzeCode(referenceCode, {
        language: "markdown",
        framework: "api-reference",
        purpose: "api-reference",
        environment: "production",
      });

      logger.info("KWAMI created API reference", {
        framework: context.framework,
        endpointsCount: apiReference.apiReference.endpoints.length,
        interactive: context.interactive,
      });

      return {
        ...apiReference,
        deepCodeAnalysis: referenceAnalysis,
      };
    } catch (error) {
      logger.error("KWAMI API reference creation failed:", error);
      throw error;
    }
  }

  async generateUserGuides(
    features: string[],
    context: {
      targetAudience: string;
      complexity: "beginner" | "intermediate" | "advanced";
      format: "text" | "video" | "interactive";
      language: string;
    }
  ): Promise<{
    userGuides: Array<{
      title: string;
      description: string;
      steps: string[];
      screenshots: string[];
      troubleshooting: string[];
      duration: string;
    }>;
    tutorials: Array<{
      title: string;
      description: string;
      prerequisites: string[];
      steps: string[];
      outcomes: string[];
    }>;
    faq: Array<{
      question: string;
      answer: string;
      category: string;
    }>;
    deepCodeAnalysis: DeepCodeAnalysis;
  }> {
    try {
      const userGuidesPrompt = `Crée des guides utilisateurs complets et engageants:

FONCTIONNALITÉS À DOCUMENTER:
${features.join("\n")}

CONTEXTE:
- Audience: ${context.targetAudience}
- Complexité: ${context.complexity}
- Format: ${context.format}
- Langue: ${context.language}

GÉNÈRE:
1. Guides utilisateurs détaillés
2. Tutoriels pas-à-pas
3. FAQ complète
4. Dépannage et support

Les guides doivent être:
- Faciles à suivre
- Visuellement attractifs
- Complets et précis
- Adaptés à l'audience
- Production-ready

Réponds en JSON structuré avec: userGuides, tutorials, faq`;

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: userGuidesPrompt }
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.4,
        maxTokens: 4000,
      });

      const userGuides = JSON.parse(response.content);

      // Valider les guides utilisateurs
      const guidesCode = this.generateUserGuidesCode(userGuides);
      const guidesAnalysis = await deepCodeEngine.analyzeCode(guidesCode, {
        language: "markdown",
        framework: "user-guides",
        purpose: "user-documentation",
        environment: "production",
      });

      logger.info("KWAMI generated user guides", {
        featuresCount: features.length,
        targetAudience: context.targetAudience,
        guidesCount: userGuides.userGuides.length,
        tutorialsCount: userGuides.tutorials.length,
      });

      return {
        ...userGuides,
        deepCodeAnalysis: guidesAnalysis,
      };
    } catch (error) {
      logger.error("KWAMI user guides generation failed:", error);
      throw error;
    }
  }

  async optimizeDocumentation(
    currentDocs: string,
    issues: string[],
    context: {
      audience: string;
      platform: "web" | "mobile" | "desktop";
      format: "markdown" | "html" | "pdf";
    }
  ): Promise<{
    optimizedDocs: string;
    improvements: string[];
    structure: string;
    navigation: string;
    deepCodeAnalysis: DeepCodeAnalysis;
  }> {
    try {
      // Analyser la documentation existante
      const currentAnalysis = await deepCodeEngine.analyzeCode(currentDocs, {
        language: "markdown",
        framework: "documentation",
        purpose: "documentation-optimization",
        environment: "production",
      });

      const optimizationPrompt = `Optimise cette documentation pour la rendre exceptionnelle:

DOCUMENTATION ACTUELLE:
${currentDocs}

PROBLÈMES IDENTIFIÉS:
${issues.map(issue => `- ${issue}`).join("\n")}

CONTEXTE:
- Audience: ${context.audience}
- Platform: ${context.platform}
- Format: ${context.format}

ANALYSE DEEPCODE:
${JSON.stringify(currentAnalysis, null, 2)}

OPTIMISE:
1. Documentation optimisée
2. Améliorations détaillées
3. Structure logique
4. Navigation intuitive

La documentation optimisée doit:
- Résoudre tous les problèmes identifiés
- Être plus claire et accessible
- Avoir une meilleure structure
- Être facile à naviguer
- Être production-ready

Réponds en JSON structuré.`;

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: optimizationPrompt }
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.3,
        maxTokens: 3500,
      });

      const optimization = JSON.parse(response.content);

      // Valider la documentation optimisée
      const optimizedAnalysis = await deepCodeEngine.analyzeCode(optimization.optimizedDocs, {
        language: "markdown",
        framework: "documentation",
        purpose: "optimized-documentation",
        environment: "production",
      });

      logger.info("KWAMI optimized documentation", {
        issuesResolved: issues.length,
        audience: context.audience,
        clarityImprovement: optimizedAnalysis.quality.score - currentAnalysis.quality.score,
      });

      return {
        optimizedDocs: optimization.optimizedDocs,
        improvements: optimization.improvements,
        structure: optimization.structure,
        navigation: optimization.navigation,
        deepCodeAnalysis: optimizedAnalysis,
      };
    } catch (error) {
      logger.error("KWAMI documentation optimization failed:", error);
      throw error;
    }
  }

  private async analyzeDocumentationNeeds(message: string, context: any): Promise<any> {
    return {
      documentationType: this.extractDocumentationType(message),
      audience: this.extractAudience(message),
      complexity: this.extractComplexity(message),
      format: this.extractFormat(message),
      language: this.extractLanguage(message),
    };
  }

  private async generateDocumentationSolution(message: string, context: any): Promise<KwamiDocumentationSolution> {
    const requirements = message;
    const docContext = context.documentation || {
      language: "typescript",
      framework: "nodejs",
      audience: "developers",
      documentationType: "guide",
    };

    return await this.generateTechnicalDocumentation(requirements, docContext);
  }

  private generateDocumentationCode(solution: KwamiDocumentationSolution): string {
    return `
# Documentation Generated by KWAMI + DeepCode

## Technical Documentation
${solution.technicalDocs.map(doc => `
### ${doc.title}
${doc.content}
Type: ${doc.type}
Audience: ${doc.audience}
${doc.code.map(code => `\`\`\`${doc.type}\n${code}\`\`\``).join('\n')}
`).join('\n')}

## User Guides
${solution.userGuides.map(guide => `
### ${guide.title}
${guide.description}
${guide.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
`).join('\n')}

## API Documentation
${solution.apiDocs.endpoints.map(endpoint => `
### ${endpoint.method} ${endpoint.path}
${endpoint.description}
Parameters: ${endpoint.parameters.join(', ')}
Responses: ${endpoint.responses.join(', ')}
`).join('\n')}

## Code Examples
${solution.codeExamples.map(example => `
### ${example.title} (${example.language})
${example.description}
\`\`\`${example.language}
${example.code}
\`\`\`
${example.explanation.map(exp => `- ${exp}`).join('\n')}
`).join('\n')}
`;
  }

  private generateAPIReferenceCode(reference: any): string {
    return `
# API Reference Generated by KWAMI + DeepCode

## Overview
${reference.apiReference.overview}

## Authentication
${reference.apiReference.authentication}

## Endpoints
${reference.apiReference.endpoints.map((endpoint: any) => `
### ${endpoint.method} ${endpoint.path}
${endpoint.description}

**Parameters:**
${endpoint.parameters.map((param: any) => `- \`${param.name}\` (${param.type}): ${param.description}`).join('\n')}

**Responses:**
${endpoint.responses.map((resp: any) => `- \`${resp.code}\`: ${resp.description}`).join('\n')}

**Examples:**
${endpoint.examples.map((example: any) => `\`\`\`${example.language}\n${example.code}\`\`\``).join('\n')}
`).join('\n')}

## Schemas
${reference.apiReference.schemas.join('\n\n')}

## Errors
${reference.apiReference.errors.map((error: any) => `- \`${error.code}\`: ${error.description}`).join('\n')}
`;
  }

  private generateUserGuidesCode(guides: any): string {
    return `
# User Guides Generated by KWAMI + DeepCode

## User Guides
${guides.userGuides.map((guide: any) => `
### ${guide.title}
${guide.description}
${guide.steps.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}

**Troubleshooting:**
${guide.troubleshooting.map((issue: string) => `- ${issue}`).join('\n')}
`).join('\n')}

## Tutorials
${guides.tutorials.map((tutorial: any) => `
### ${tutorial.title}
${tutorial.description}

**Prerequisites:**
${tutorial.prerequisites.map((req: string) => `- ${req}`).join('\n')}

**Steps:**
${tutorial.steps.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}

**Outcomes:**
${tutorial.outcomes.map((outcome: string) => `- ${outcome}`).join('\n')}
`).join('\n')}

## FAQ
${guides.faq.map((faq: any) => `
### ${faq.question}
${faq.answer}
*Category: ${faq.category}
`).join('\n')}
`;
  }

  private calculateDocumentationScore(solution: KwamiDocumentationSolution): number {
    let score = 70; // Base score
    
    // Check documentation quality factors
    if (solution.technicalDocs.length >= 5) score += 5;
    if (solution.userGuides.length >= 3) score += 5;
    if (solution.apiDocs.endpoints.length >= 5) score += 5;
    if (solution.codeExamples.length >= 10) score += 5;
    if (solution.technicalDocs.every(doc => doc.code.length > 0)) score += 5;
    
    return Math.min(score, 100);
  }

  private calculateCompletenessScore(solution: KwamiDocumentationSolution): number {
    let score = 70; // Base score
    
    // Check completeness factors
    const totalSections = solution.technicalDocs.length + solution.userGuides.length + solution.codeExamples.length;
    if (totalSections >= 15) score += 10;
    else if (totalSections >= 10) score += 5;
    
    if (solution.apiDocs.endpoints.every(endpoint => 
      endpoint.parameters.length > 0 && endpoint.responses.length > 0
    )) score += 10;
    
    return Math.min(score, 100);
  }

  private calculateClarityScore(solution: KwamiDocumentationSolution): number {
    let score = 70; // Base score
    
    // Check clarity factors
    if (solution.technicalDocs.every(doc => doc.content.length > 50)) score += 10;
    if (solution.codeExamples.every(example => example.explanation.length > 0)) score += 10;
    if (solution.userGuides.every(guide => guide.steps.length >= 3)) score += 10;
    
    return Math.min(score, 100);
  }

  private getDocumentationRecommendations(solution: KwamiDocumentationSolution): string[] {
    const recommendations = [];
    
    if (solution.technicalDocs.length < 5) {
      recommendations.push("Add more technical documentation sections");
    }
    
    if (solution.codeExamples.length < 10) {
      recommendations.push("Include more practical code examples");
    }
    
    if (solution.apiDocs.endpoints.some(endpoint => endpoint.examples.length === 0)) {
      recommendations.push("Add examples for all API endpoints");
    }
    
    return recommendations;
  }

  private extractDocumentationType(message: string): string {
    if (message.toLowerCase().includes("api")) return "api";
    if (message.toLowerCase().includes("guide") || message.toLowerCase().includes("tutorial")) return "guide";
    if (message.toLowerCase().includes("reference")) return "reference";
    if (message.toLowerCase().includes("readme")) return "readme";
    return "general";
  }

  private extractAudience(message: string): string {
    if (message.toLowerCase().includes("developer") || message.toLowerCase().includes("technical")) return "developers";
    if (message.toLowerCase().includes("user") || message.toLowerCase().includes("customer")) return "users";
    if (message.toLowerCase().includes("admin") || message.toLowerCase().includes("administrator")) return "admins";
    return "general";
  }

  private extractComplexity(message: string): string {
    if (message.toLowerCase().includes("complex") || message.toLowerCase().includes("advanced")) return "advanced";
    if (message.toLowerCase().includes("beginner") || message.toLowerCase().includes("basic")) return "beginner";
    return "intermediate";
  }

  private extractFormat(message: string): string {
    if (message.toLowerCase().includes("markdown") || message.toLowerCase().includes("md")) return "markdown";
    if (message.toLowerCase().includes("html")) return "html";
    if (message.toLowerCase().includes("pdf")) return "pdf";
    return "markdown";
  }

  private extractLanguage(message: string): string {
    if (message.toLowerCase().includes("french") || message.toLowerCase().includes("français")) return "french";
    if (message.toLowerCase().includes("english")) return "english";
    return "french";
  }

  private extractDocumentationActions(content: string): string[] {
    const patterns = [/documentation:/gi, /guide:/gi, /readme:/gi, /api:/gi];
    return this.extractWithPatterns(content, patterns);
  }

  private extractNextSteps(content: string): string[] {
    const stepRegex = /(?:📋|next|prochain|étape):\s*([^\n]+)/gi;
    const matches = content.match(stepRegex);
    return matches ? matches.map(m => m.replace(/(?:📋|next|prochain|étape):\s*/, "").trim()) : [];
  }

  private extractWithPatterns(content: string, patterns: RegExp[]): string[] {
    const actions: string[] = [];
    
    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches) {
        actions.push(...matches);
      }
    }
    
    return actions;
  }
}

export const kwamiEnhanced = new KWAMI_Enhanced();
