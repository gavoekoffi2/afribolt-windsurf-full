import { llmRouter, LLMMessage } from "../llm/router";
import { logger } from "../utils/logger";

export interface AgentResponse {
  agent: string;
  message: string;
  actions: string[];
  nextSteps: string[];
  confidence: number;
}

export class EMEFA_Agent {
  private systemPrompt: string = `Tu es EMEFA, le Team Lead AI dAFRIBOLT. Tu es le manager général des agents spécialisés.

Ta mission:
- Coordonner tous les autres agents (KOFFI, DÉDÉ, SOLIM, AKOFA, KWAMI, YAOVI)
- Planifier et organiser les projets de développement
- Valider la qualité des livrables
- Prendre des décisions stratégiques
- Orchestrer le pipeline de développement

Ta personnalité:
- Leader naturel et diplomate
- Visionnaire et stratégique
- Orienté résultats et qualité
- Excellent communicant
- Capacité à synthétiser et prioriser

Réponds toujours en français avec une approche professionnelle et inclusive.`;

  async processRequest(
    message: string,
    context: any = {},
    model: string = "gpt-4"
  ): Promise<AgentResponse> {
    try {
      const messages: LLMMessage[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: `Contexte: ${JSON.stringify(context, null, 2)}\n\nMessage: ${message}` }
      ];

      const response = await llmRouter.generateResponse(model, messages, {
        temperature: 0.7,
        maxTokens: 2000,
      });

      const actions = this.extractActions(response.content);
      const nextSteps = this.extractNextSteps(response.content);
      const confidence = this.calculateConfidence(response.content);

      logger.info(`EMEFA processed request with ${confidence} confidence`);

      return {
        agent: "EMEFA",
        message: response.content,
        actions,
        nextSteps,
        confidence,
      };
    } catch (error) {
      logger.error("EMEFA processing error:", error);
      throw error;
    }
  }

  private extractActions(content: string): string[] {
    const actionRegex = /(?:🎯|ACTION|Action):\s*([^\n]+)/gi;
    const matches = content.match(actionRegex);
    return matches ? matches.map(m => m.replace(/(?:🎯|ACTION|Action):\s*/, "").trim()) : [];
  }

  private extractNextSteps(content: string): string[] {
    const stepRegex = /(?:📋|NEXT|Prochain):\s*([^\n]+)/gi;
    const matches = content.match(stepRegex);
    return matches ? matches.map(m => m.replace(/(?:📋|NEXT|Prochain):\s*/, "").trim()) : [];
  }

  private calculateConfidence(content: string): number {
    const indicators = ["confiant", "certain", "sûr", "recommande", "optimal"];
    const count = indicators.filter(indicator => 
      content.toLowerCase().includes(indicator)
    ).length;
    return Math.min(0.5 + (count * 0.1), 1.0);
  }

  async coordinateAgents(
    agents: string[],
    task: string,
    context: any = {}
  ): Promise<AgentResponse> {
    const coordinationPrompt = `En tant que EMEFA, coordonne les agents suivants pour cette tâche: "${task}"

Agents disponibles:
- KOFFI (Architecte & Stratégie Technique)
- DÉDÉ (Backend & Infrastructure)  
- SOLIM (UX / UI Designer)
- AKOFA (Frontend Builder)
- KWAMI (Documentation & Knowledge)
- YAOVI (Dev Collaboration)

Planifie la collaboration et assigne les responsabilités.`;

    return await this.processRequest(coordinationPrompt, context);
  }
}

export const emefaAgent = new EMEFA_Agent();