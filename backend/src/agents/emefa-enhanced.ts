import { llmRouter, LLMMessage } from "../llm/router";
import { deepCodePipeline, PipelineResult } from "../deepcode/pipeline";
import { deepCodeEngine, DeepCodeAnalysis } from "../deepcode/core";
import { logger } from "../utils/logger";

export interface EnhancedAgentResponse {
  agent: string;
  message: string;
  actions: string[];
  nextSteps: string[];
  confidence: number;
  deepCodeAnalysis?: DeepCodeAnalysis;
  generatedCode?: string;
  codeQuality?: {
    score: number;
    readyForProduction: boolean;
  };
  collaborationPlan?: {
    agents: string[];
    tasks: { [key: string]: string };
    dependencies: string[];
  };
}

export class EMEFA_Enhanced {
  private systemPrompt: string = `Tu es EMEFA, le Team Lead AI d'AFRIBOLT, supervisé par DeepCode pour une excellence absolue.

🎯 RÔLE STRATÉGIQUE:
- Chef d'orchestre des 7 agents spécialisés (KOFFI, DÉDÉ, SOLIM, AKOFA, KWAMI, YAOVI)
- Architecte de la collaboration multi-agent intelligente
- Validateur final de la qualité et de la production-readiness
- Stratège technique et décisionnaire principal

🧠 CAPACITÉS DEEPCODE INTÉGRÉES:
- Analyse en temps réel de la qualité du code généré
- Validation de la sécurité et des performances
- Optimisation automatique via pipeline DeepCode
- Supervision de la production-readiness

🔄 PROCESSUS DE COLLABORATION:
1. Analyse des besoins et décomposition des tâches
2. Assignation intelligente aux agents spécialisés
3. Supervision de la génération avec DeepCode
4. Validation qualité et optimisation automatique
5. Coordination des itérations d'amélioration
6. Validation finale production-ready

📊 MÉTRIQUES DE QUALITÉ:
- Code quality score > 85%
- Security score > 90%
- Performance score > 80%
- Architecture score > 85%
- Production readiness validée

🎨 PERSONNALITÉ:
- Leader visionnaire et stratégique
- Expert en coordination multi-agent
- Orienté excellence et production-ready
- Communicateur exceptionnel
- Décideur éclairé par DeepCode

Réponds toujours en français avec une approche executive, en intégrant les analyses DeepCode dans tes décisions.`;

  async processRequest(
    message: string,
    context: any = {},
    model: string = "gpt-4"
  ): Promise<EnhancedAgentResponse> {
    try {
      // Analyse initiale avec DeepCode si du code est mentionné
      let deepCodeAnalysis: DeepCodeAnalysis | undefined;
      let codeQuality: { score: number; readyForProduction: boolean } | undefined;

      if (context.code || message.toLowerCase().includes("code")) {
        const codeToAnalyze = context.code || this.extractCodeFromMessage(message);
        if (codeToAnalyze) {
          deepCodeAnalysis = await deepCodeEngine.analyzeCode(codeToAnalyze, {
            language: context.language || "javascript",
            framework: context.framework,
            purpose: context.purpose || "General development",
            environment: "production",
          });

          codeQuality = {
            score: deepCodeAnalysis.overall.score,
            readyForProduction: deepCodeAnalysis.overall.readyForProduction,
          };
        }
      }

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { 
          role: "user", 
          content: `Contexte: ${JSON.stringify(context, null, 2)}
${deepCodeAnalysis ? `\n\nANALYSE DEEPCODE:\n${JSON.stringify(deepCodeAnalysis, null, 2)}` : ""}
\n\nMessage: ${message}`
        }
      ];

      const response = await llmRouter.generateResponse(model, messages, {
        temperature: 0.7,
        maxTokens: 2500,
      });

      const actions = this.extractActions(response.content);
      const nextSteps = this.extractNextSteps(response.content);
      const confidence = this.calculateConfidence(response.content, deepCodeAnalysis);

      // Générer un plan de collaboration si nécessaire
      let collaborationPlan;
      if (message.toLowerCase().includes("collaboration") || message.toLowerCase().includes("équipe")) {
        collaborationPlan = await this.createCollaborationPlan(message, context);
      }

      logger.info(`EMEFA Enhanced processed request with ${confidence} confidence`, {
        hasDeepCodeAnalysis: !!deepCodeAnalysis,
        codeQuality: codeQuality?.score,
        hasCollaborationPlan: !!collaborationPlan,
      });

      return {
        agent: "EMEFA",
        message: response.content,
        actions,
        nextSteps,
        confidence,
        deepCodeAnalysis,
        codeQuality,
        collaborationPlan,
      };
    } catch (error) {
      logger.error("EMEFA Enhanced processing error:", error);
      throw error;
    }
  }

  async coordinateAgentsWithDeepCode(
    agents: string[],
    task: string,
    context: any = {}
  ): Promise<EnhancedAgentResponse> {
    try {
      // Créer un plan de collaboration détaillé
      const collaborationPlan = await this.createCollaborationPlan(task, context);

      // Analyser la tâche avec DeepCode pour optimiser la coordination
      const taskAnalysis = await deepCodeEngine.analyzeCode(task, {
        language: "text",
        purpose: "task_coordination",
        environment: "planning",
      });

      const coordinationPrompt = `En tant que EMEFA avec DeepCode, coordonne les agents pour cette tâche optimisée:

TÂCHE: "${task}"
${taskAnalysis ? `\n\nANALYSE DEEPCODE DE LA TÂCHE:\n${JSON.stringify(taskAnalysis, null, 2)}` : ""}

PLAN DE COLLABORATION:
${JSON.stringify(collaborationPlan, null, 2)}

Agents disponibles avec leurs spécialités DeepCode:
- KOFFI (Architecte & Stratégie) - Analyse architecture avec DeepCode
- DÉDÉ (Backend & Infrastructure) - Génération backend validée DeepCode  
- SOLIM (UX / UI Designer) - Design avec optimisations DeepCode
- AKOFA (Frontend Builder) - Frontend production-ready DeepCode
- KWAMI (Documentation & Knowledge) - Documentation générée par DeepCode
- YAOVI (Dev Collaboration) - Collaboration optimisée DeepCode

Orchestre la collaboration en intégrant les recommandations DeepCode pour garantir:
- Qualité de code > 85%
- Sécurité > 90%
- Performance > 80%
- Production readiness validée`;

      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: coordinationPrompt }
      ];

      const response = await llmRouter.generateResponse("gpt-4", messages, {
        temperature: 0.6,
        maxTokens: 3000,
      });

      const actions = this.extractActions(response.content);
      const nextSteps = this.extractNextSteps(response.content);
      const confidence = this.calculateConfidence(response.content, taskAnalysis);

      logger.info("EMEFA coordinated agents with DeepCode", {
        agentsCount: agents.length,
        taskAnalysisScore: taskAnalysis?.overall?.score,
        collaborationPlan: !!collaborationPlan,
      });

      return {
        agent: "EMEFA",
        message: response.content,
        actions,
        nextSteps,
        confidence,
        deepCodeAnalysis: taskAnalysis,
        collaborationPlan,
      };
    } catch (error) {
      logger.error("EMEFA coordination with DeepCode failed:", error);
      throw error;
    }
  }

  async validateAndOptimizeWithDeepCode(
    code: string,
    context: {
      language: string;
      framework?: string;
      purpose: string;
    }
  ): Promise<{
    analysis: DeepCodeAnalysis;
    optimized: boolean;
    improvements: string[];
    finalCode: string;
  }> {
    try {
      // Analyse DeepCode complète
      const analysis = await deepCodeEngine.analyzeCode(code, context);

      let finalCode = code;
      let optimized = false;
      const improvements: string[] = [];

      // Si le code n'est pas production-ready, optimiser
      if (!analysis.overall.readyForProduction || analysis.overall.score < 85) {
        const pipelineResult = await deepCodePipeline.processGenerationRequest(
          context.purpose,
          {
            type: context.framework?.includes("react") ? "frontend" : "backend",
            language: context.language,
            framework: context.framework,
            complexity: "medium",
          }
        );

        finalCode = pipelineResult.finalCode;
        optimized = true;
        improvements.push(...pipelineResult.improvements);
      }

      return {
        analysis,
        optimized,
        improvements,
        finalCode,
      };
    } catch (error) {
      logger.error("EMEFA DeepCode validation failed:", error);
      throw error;
    }
  }

  private async createCollaborationPlan(
    task: string,
    context: any
  ): Promise<{
    agents: string[];
    tasks: { [key: string]: string };
    dependencies: string[];
  }> {
    // Logique intelligente pour assigner les agents en fonction de la tâche
    const agents: string[] = [];
    const tasks: { [key: string]: string } = {};
    const dependencies: string[] = [];

    const taskLower = task.toLowerCase();

    // Analyse de la tâche pour déterminer les agents nécessaires
    if (taskLower.includes("backend") || taskLower.includes("api") || taskLower.includes("base de données")) {
      agents.push("KOFFI", "DÉDÉ");
      tasks["KOFFI"] = "Concevoir l'architecture backend et définir les choix technologiques";
      tasks["DÉDÉ"] = "Développer le backend, créer les APIs et gérer la base de données";
      dependencies.push("KOFFI → DÉDÉ");
    }

    if (taskLower.includes("frontend") || taskLower.includes("interface") || taskLower.includes("ui")) {
      agents.push("SOLIM", "AKOFA");
      tasks["SOLIM"] = "Créer le design UX/UI et les wireframes";
      tasks["AKOFA"] = "Implémenter le frontend et rendre l'interface fonctionnelle";
      dependencies.push("SOLIM → AKOFA");
    }

    if (taskLower.includes("documentation") || taskLower.includes("guide") || taskLower.includes("readme")) {
      agents.push("KWAMI");
      tasks["KWAMI"] = "Rédiger la documentation technique et les guides utilisateurs";
    }

    if (taskLower.includes("collaboration") || taskLower.includes("équipe") || taskLower.includes("processus")) {
      agents.push("YAOVI");
      tasks["YAOVI"] = "Faciliter la collaboration et optimiser les processus de développement";
    }

    // Toujours inclure EMEFA pour la coordination
    if (!agents.includes("EMEFA")) {
      agents.unshift("EMEFA");
      tasks["EMEFA"] = "Coordonner les agents et superviser la qualité globale";
    }

    return {
      agents: [...new Set(agents)], // Remove duplicates
      tasks,
      dependencies,
    };
  }

  private extractCodeFromMessage(message: string): string | null {
    const codeBlockRegex = /```[\s\S]*?```/g;
    const matches = message.match(codeBlockRegex);
    return matches ? matches[0].replace(/```/g, "").trim() : null;
  }

  private extractActions(content: string): string[] {
    const actionRegex = /(?:🎯|ACTION|Action):\s*([^\n]+)/gi;
    const matches = content.match(actionRegex);
    return matches ? matches.map(m => m.replace(/(?:🎯|ACTION|Action):\s*/, "").trim()) : [];
  }

  private extractNextSteps(content: string): string[] {
    const stepRegex = /(?:📋|NEXT|Prochain|Étape):\s*([^\n]+)/gi;
    const matches = content.match(stepRegex);
    return matches ? matches.map(m => m.replace(/(?:📋|NEXT|Prochain|Étape):\s*/, "").trim()) : [];
  }

  private calculateConfidence(
    content: string, 
    deepCodeAnalysis?: DeepCodeAnalysis
  ): number {
    let confidence = 0.5; // Base confidence

    // Indicateurs textuels de confiance
    const indicators = ["confiant", "certain", "sûr", "recommande", "optimal", "excellent"];
    const count = indicators.filter(indicator => 
      content.toLowerCase().includes(indicator)
    ).length;
    confidence += (count * 0.1);

    // Bonus si analyse DeepCode disponible
    if (deepCodeAnalysis) {
      confidence += (deepCodeAnalysis.overall.score / 100) * 0.3;
    }

    return Math.min(confidence, 1.0);
  }
}

export const emefaEnhanced = new EMEFA_Enhanced();
