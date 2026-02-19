import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { emefaAgent, AgentResponse } from "./emefa";
import { llmRouter, LLMMessage } from "../llm/router";
import { logger } from "../utils/logger";
import { createError } from "../middleware/errorHandler";

export class AgentOrchestrator {
  private io: Server | null;
  private prisma: PrismaClient;

  constructor(io: Server | null, prisma: PrismaClient) {
    this.io = io;
    this.prisma = prisma;
  }

  async processRequest(data: any): Promise<any> {
    const { type, payload, userId, projectId } = data;

    try {
      switch (type) {
        case "agent_chat":
          return await this.processAgentRequest(
            payload.agentType,
            payload.message,
            payload.context,
            payload.model,
            userId
          );
        
        case "coordinate_agents":
          return await this.coordinateAgents(
            payload.agents,
            payload.task,
            payload.context,
            userId
          );
        
        default:
          throw createError(`Unknown request type: ${type}`, 400);
      }
    } catch (error) {
      logger.error("Orchestrator processing error:", error);
      throw error;
    }
  }

  async processAgentRequest(
    agentType: string,
    message: string,
    context: any = {},
    model: string = "gpt-4",
    userId: string
  ): Promise<AgentResponse> {
    try {
      let response: AgentResponse;

      switch (agentType.toLowerCase()) {
        case "emefa":
          response = await emefaAgent.processRequest(message, context, model);
          break;
        
        case "koffi":
          response = await this.processKoffiRequest(message, context, model);
          break;
        
        case "dede":
          response = await this.processDedeRequest(message, context, model);
          break;
        
        case "solim":
          response = await this.processSolimRequest(message, context, model);
          break;
        
        case "akofa":
          response = await this.processAkofaRequest(message, context, model);
          break;
        
        case "kwami":
          response = await this.processKwamiRequest(message, context, model);
          break;
        
        case "yaovi":
          response = await this.processYaoviRequest(message, context, model);
          break;
        
        default:
          throw createError(`Unknown agent type: ${agentType}`, 400);
      }

      await this.logAgentInteraction(agentType, message, response, userId, context.projectId);

      if (this.io && context.projectId) {
        this.io.to(`project-${context.projectId}`).emit("agent-response", {
          agent: agentType,
          response,
          timestamp: new Date().toISOString(),
        });
      }

      return response;
    } catch (error) {
      logger.error(`Agent ${agentType} processing error:`, error);
      throw error;
    }
  }

  private async processKoffiRequest(
    message: string,
    context: any,
    model: string
  ): Promise<AgentResponse> {
    const systemPrompt = `Tu es KOFFI, lArchitecte & Stratège Technique dAFRIBOLT.

Ta mission:
- Concevoir larchitecture applicative
- Structurer les projets
- Faire les choix technologiques
- Définir les critères de scalabilité
- Planifier la stratégie technique

Réponds toujours en français avec expertise technique.`;

    const messages: LLMMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ];

    const llmResponse = await llmRouter.generateResponse(model, messages);

    return {
      agent: "KOFFI",
      message: llmResponse.content,
      actions: this.extractTechnicalActions(llmResponse.content),
      nextSteps: this.extractNextSteps(llmResponse.content),
      confidence: 0.8,
    };
  }

  private async processDedeRequest(
    message: string,
    context: any,
    model: string
  ): Promise<AgentResponse> {
    const systemPrompt = `Tu es DÉDÉ, le spécialiste Backend & Infrastructure dAFRIBOLT.

Ta mission:
- Développer le backend
- Créer les APIs
- Gérer les bases de données
- Assurer sécurité et performances
- Garantir fiabilité

Réponds toujours en français avec expertise backend.`;

    const messages: LLMMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ];

    const llmResponse = await llmRouter.generateResponse(model, messages);

    return {
      agent: "DÉDÉ",
      message: llmResponse.content,
      actions: this.extractBackendActions(llmResponse.content),
      nextSteps: this.extractNextSteps(llmResponse.content),
      confidence: 0.85,
    };
  }

  private async processSolimRequest(
    message: string,
    context: any,
    model: string
  ): Promise<AgentResponse> {
    const systemPrompt = `Tu es SOLIM, le UX / UI Designer dAFRIBOLT.

Ta mission:
- Design professionnel
- Expérience utilisateur premium
- Créer des wireframes
- Concevoir des interfaces élégantes
- Assurer accessibilité

Réponds toujours en français avec expertise design.`;

    const messages: LLMMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ];

    const llmResponse = await llmRouter.generateResponse(model, messages);

    return {
      agent: "SOLIM",
      message: llmResponse.content,
      actions: this.extractDesignActions(llmResponse.content),
      nextSteps: this.extractNextSteps(llmResponse.content),
      confidence: 0.9,
    };
  }

  private async processAkofaRequest(
    message: string,
    context: any,
    model: string
  ): Promise<AgentResponse> {
    const systemPrompt = `Tu es AKOFA, le Frontend Builder dAFRIBOLT.

Ta mission:
- Implémenter les interfaces
- Composer le fonctionnement
- Rendre le produit utilisable
- Optimiser les performances frontend
- Assurer responsive design

Réponds toujours en français avec expertise frontend.`;

    const messages: LLMMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ];

    const llmResponse = await llmRouter.generateResponse(model, messages);

    return {
      agent: "AKOFA",
      message: llmResponse.content,
      actions: this.extractFrontendActions(llmResponse.content),
      nextSteps: this.extractNextSteps(llmResponse.content),
      confidence: 0.85,
    };
  }

  private async processKwamiRequest(
    message: string,
    context: any,
    model: string
  ): Promise<AgentResponse> {
    const systemPrompt = `Tu es KWAMI, le Documentation & Knowledge AI dAFRIBOLT.

Ta mission:
- Rédiger la documentation
- Créer des guides utilisateurs
- Écrire des guides techniques
- Maintenir le README
- Organiser la connaissance

Réponds toujours en français avec expertise documentation.`;

    const messages: LLMMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ];

    const llmResponse = await llmRouter.generateResponse(model, messages);

    return {
      agent: "KWAMI",
      message: llmResponse.content,
      actions: this.extractDocumentationActions(llmResponse.content),
      nextSteps: this.extractNextSteps(llmResponse.content),
      confidence: 0.95,
    };
  }

  private async processYaoviRequest(
    message: string,
    context: any,
    model: string
  ): Promise<AgentResponse> {
    const systemPrompt = `Tu es YAOVI, le Dev Collaboration Agent dAFRIBOLT.

Ta mission:
- Aider au bug fixing
- Assurer cohérence globale
- Améliorer les processus dev
- Faciliter la collaboration
- Optimiser le workflow

Réponds toujours en français avec expertise collaboration.`;

    const messages: LLMMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ];

    const llmResponse = await llmRouter.generateResponse(model, messages);

    return {
      agent: "YAOVI",
      message: llmResponse.content,
      actions: this.extractCollaborationActions(llmResponse.content),
      nextSteps: this.extractNextSteps(llmResponse.content),
      confidence: 0.8,
    };
  }

  private extractTechnicalActions(content: string): string[] {
    const patterns = [/architecture:/gi, /technologie:/gi, /scalabilité:/gi];
    return this.extractWithPatterns(content, patterns);
  }

  private extractBackendActions(content: string): string[] {
    const patterns = [/api:/gi, /base de données:/gi, /sécurité:/gi];
    return this.extractWithPatterns(content, patterns);
  }

  private extractDesignActions(content: string): string[] {
    const patterns = [/design:/gi, /interface:/gi, /ux:/gi];
    return this.extractWithPatterns(content, patterns);
  }

  private extractFrontendActions(content: string): string[] {
    const patterns = [/frontend:/gi, /composant:/gi, /responsive:/gi];
    return this.extractWithPatterns(content, patterns);
  }

  private extractDocumentationActions(content: string): string[] {
    const patterns = [/documentation:/gi, /guide:/gi, /readme:/gi];
    return this.extractWithPatterns(content, patterns);
  }

  private extractCollaborationActions(content: string): string[] {
    const patterns = [/collaboration:/gi, /processus:/gi, /optimisation:/gi];
    return this.extractWithPatterns(content, patterns);
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

  private extractNextSteps(content: string): string[] {
    const stepRegex = /(?:📋|next|prochain|étape):\\s*([^\\n]+)/gi;
    const matches = content.match(stepRegex);
    return matches ? matches.map(m => m.replace(/(?:📋|next|prochain|étape):\\s*/, "").trim()) : [];
  }

  private async logAgentInteraction(
    agentType: string,
    message: string,
    response: AgentResponse,
    userId: string,
    projectId?: string
  ): Promise<void> {
    try {
      await this.prisma.history.create({
        data: {
          type: "agent_interaction",
          content: {
            agentType,
            message,
            response,
            userId,
            timestamp: new Date().toISOString(),
          },
          agentId: undefined,
          projectId: projectId || "",
        },
      });
    } catch (error) {
      logger.error("Failed to log agent interaction:", error);
    }
  }

  async coordinateAgents(
    agents: string[],
    task: string,
    context: any = {},
    userId: string
  ): Promise<{ [key: string]: AgentResponse }> {
    const coordination = await emefaAgent.coordinateAgents(agents, task, context);
    
    const results: { [key: string]: AgentResponse } = {
      emefa: coordination,
    };

    for (const agentType of agents) {
      if (agentType !== "emefa") {
        try {
          const agentResponse = await this.processAgentRequest(
            agentType,
            task,
            context,
            "gpt-4",
            userId
          );
          results[agentType] = agentResponse;
        } catch (error) {
          logger.error(`Failed to coordinate agent ${agentType}:`, error);
        }
      }
    }

    return results;
  }
}