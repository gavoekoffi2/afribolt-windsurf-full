import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { emefaEnhanced, EnhancedAgentResponse } from "./emefa-enhanced";
import { koffiEnhanced } from "./koffi-enhanced";
import { dedeEnhanced } from "./dede-enhanced";
import { solimEnhanced } from "./solim-enhanced";
import { akofaEnhanced } from "./akofa-enhanced";
import { kwamiEnhanced } from "./kwami-enhanced";
import { yaoviEnhanced } from "./yaovi-enhanced";
import { deepCodePipeline, PipelineResult } from "../deepcode/pipeline";
import { deepCodeEngine, DeepCodeAnalysis } from "../deepcode/core";
import { logger } from "../utils/logger";
import { createError } from "../middleware/errorHandler";

export class EnhancedAgentOrchestrator {
  private io: Server | null;
  private prisma: PrismaClient;
  private activeSessions: Map<string, any> = new Map();

  constructor(io: Server | null, prisma: PrismaClient) {
    this.io = io;
    this.prisma = prisma;
  }

  async processRequest(data: any): Promise<any> {
    const { type, payload, userId, projectId } = data;

    try {
      switch (type) {
        case "agent_chat":
          return await this.processEnhancedAgentRequest(
            payload.agentType,
            payload.message,
            payload.context,
            payload.model,
            userId
          );
        
        case "coordinate_agents":
          return await this.coordinateEnhancedAgents(
            payload.agents,
            payload.task,
            payload.context,
            userId
          );
        
        case "deepcode_analysis":
          return await this.performDeepCodeAnalysis(
            payload.code,
            payload.context,
            userId
          );
        
        case "deepcode_generation":
          return await this.performDeepCodeGeneration(
            payload.description,
            payload.context,
            userId
          );
        
        case "deepcode_optimization":
          return await this.performDeepCodeOptimization(
            payload.code,
            payload.issues,
            payload.context,
            userId
          );
        
        default:
          throw createError(`Unknown request type: ${type}`, 400);
      }
    } catch (error) {
      logger.error("Enhanced Orchestrator processing error:", error);
      throw error;
    }
  }

  async processEnhancedAgentRequest(
    agentType: string,
    message: string,
    context: any = {},
    model: string = "gpt-4",
    userId: string
  ): Promise<EnhancedAgentResponse> {
    try {
      let response: EnhancedAgentResponse;

      switch (agentType.toLowerCase()) {
        case "emefa":
          response = await emefaEnhanced.processRequest(message, context, model);
          break;
        
        case "koffi":
          response = await koffiEnhanced.processRequest(message, context, model);
          break;
        
        case "dede":
          response = await dedeEnhanced.processRequest(message, context, model);
          break;
        
        case "solim":
          response = await solimEnhanced.processRequest(message, context, model);
          break;
        
        case "akofa":
          response = await akofaEnhanced.processRequest(message, context, model);
          break;
        
        case "kwami":
          response = await kwamiEnhanced.processRequest(message, context, model);
          break;
        
        case "yaovi":
          response = await yaoviEnhanced.processRequest(message, context, model);
          break;
        
        default:
          throw createError(`Unknown enhanced agent type: ${agentType}`, 400);
      }

      // Apply DeepCode validation if code was generated
      if (response.generatedCode) {
        const deepCodeValidation = await deepCodeEngine.analyzeCode(response.generatedCode, {
          language: context.language || "typescript",
          framework: context.framework,
          purpose: context.purpose || "generated-code",
          environment: "production",
        });

        response.deepCodeAnalysis = deepCodeValidation;
        response.codeQuality = {
          score: deepCodeValidation.overall.score,
          readyForProduction: deepCodeValidation.overall.readyForProduction,
        };
      }

      await this.logEnhancedAgentInteraction(agentType, message, response, userId, context.projectId);

      if (this.io && context.projectId) {
        this.io.to(`project-${context.projectId}`).emit("enhanced-agent-response", {
          agent: agentType,
          response,
          timestamp: new Date().toISOString(),
        });
      }

      return response;
    } catch (error) {
      logger.error(`Enhanced Agent ${agentType} processing error:`, error);
      throw error;
    }
  }

  async coordinateEnhancedAgents(
    agents: string[],
    task: string,
    context: any = {},
    userId: string
  ): Promise<{ [key: string]: EnhancedAgentResponse }> {
    try {
      // Start with EMEFA coordination
      const emefaCoordination = await emefaEnhanced.coordinateAgentsWithDeepCode(
        agents,
        task,
        context
      );
      
      const results: { [key: string]: EnhancedAgentResponse } = {
        emefa: emefaCoordination,
      };

      // Create collaborative session
      const sessionId = `session-${Date.now()}-${userId}`;
      this.activeSessions.set(sessionId, {
        task,
        agents,
        startTime: new Date(),
        results: {},
      });

      // Process each agent with DeepCode integration
      for (const agentType of agents) {
        if (agentType !== "emefa") {
          try {
            const agentResponse = await this.processEnhancedAgentRequest(
              agentType,
              task,
              {
                ...context,
                sessionId,
                collaborationPlan: emefaCoordination.collaborationPlan,
              },
              "gpt-4",
              userId
            );
            
            results[agentType] = agentResponse;
            
            // Update session progress
            const session = this.activeSessions.get(sessionId);
            if (session) {
              session.results[agentType] = agentResponse;
              session.progress = Object.keys(session.results).length / agents.length;
            }
          } catch (error) {
            logger.error(`Failed to coordinate enhanced agent ${agentType}:`, error);
            const errMsg = error instanceof Error ? error.message : "Unknown error";
            results[agentType] = {
              agent: agentType,
              message: `Error: ${errMsg}`,
              actions: [],
              nextSteps: [],
              confidence: 0,
            } as EnhancedAgentResponse;
          }
        }
      }

      // Perform final DeepCode validation of the collaborative result
      const collaborativeValidation = await this.validateCollaborativeResult(results, task, context);

      // Add validation to results
      results["validation"] = {
        agent: "DeepCode",
        message: collaborativeValidation.summary,
        actions: collaborativeValidation.actions,
        nextSteps: collaborativeValidation.nextSteps,
        confidence: collaborativeValidation.confidence,
        deepCodeAnalysis: collaborativeValidation.analysis,
      } as EnhancedAgentResponse;

      // Clean up session
      this.activeSessions.delete(sessionId);

      logger.info("Enhanced agent coordination completed", {
        sessionId,
        agentsCount: agents.length,
        successRate: Object.values(results).filter(r => r.confidence > 0.7).length / agents.length,
      });

      return results;
    } catch (error) {
      logger.error("Enhanced agent coordination failed:", error);
      throw error;
    }
  }

  async performDeepCodeAnalysis(
    code: string,
    context: {
      language: string;
      framework?: string;
      purpose?: string;
    },
    userId: string
  ): Promise<DeepCodeAnalysis> {
    try {
      const analysis = await deepCodeEngine.analyzeCode(code, {
        language: context.language,
        framework: context.framework,
        purpose: context.purpose || "code-analysis",
        environment: "production",
      });

      await this.logDeepCodeInteraction("analysis", code, analysis, userId);

      return analysis;
    } catch (error) {
      logger.error("DeepCode analysis failed:", error);
      throw error;
    }
  }

  async performDeepCodeGeneration(
    description: string,
    context: {
      type: "frontend" | "backend" | "fullstack";
      language: string;
      framework?: string;
      features?: string[];
      complexity?: "simple" | "medium" | "complex";
    },
    userId: string
  ): Promise<PipelineResult> {
    try {
      const pipelineResult = await deepCodePipeline.processGenerationRequest(
        description,
        context
      );

      await this.logDeepCodeInteraction("generation", description, pipelineResult, userId);

      return pipelineResult;
    } catch (error) {
      logger.error("DeepCode generation failed:", error);
      throw error;
    }
  }

  async performDeepCodeOptimization(
    code: string,
    issues: string[],
    context: {
      language: string;
      optimizationGoals: ("performance" | "security" | "maintainability" | "readability")[];
    },
    userId: string
  ): Promise<{
    optimizedCode: string;
    analysis: DeepCodeAnalysis;
    improvements: string[];
  }> {
    try {
      const optimization = await deepCodeEngine.optimizeCode(code, issues, context);

      await this.logDeepCodeInteraction("optimization", code, optimization, userId);

      return {
        optimizedCode: optimization.code,
        analysis: await deepCodeEngine.analyzeCode(optimization.code, {
          language: context.language,
          framework: context.framework,
          purpose: "optimized-code",
          environment: "production",
        }),
        improvements: optimization.explanation.split("\n").filter(line => line.trim()),
      };
    } catch (error) {
      logger.error("DeepCode optimization failed:", error);
      throw error;
    }
  }

  private async validateCollaborativeResult(
    results: { [key: string]: EnhancedAgentResponse },
    task: string,
    context: any
  ): Promise<{
    summary: string;
    actions: string[];
    nextSteps: string[];
    confidence: number;
    analysis: DeepCodeAnalysis;
  }> {
    try {
      // Collect all generated code
      const generatedCodes = Object.values(results)
        .filter(result => result.generatedCode)
        .map(result => result.generatedCode);

      if (generatedCodes.length === 0) {
        return {
          summary: "No code generated for validation",
          actions: [],
          nextSteps: ["Generate code first"],
          confidence: 0.5,
          analysis: {} as DeepCodeAnalysis,
        };
      }

      // Combine all code for comprehensive analysis
      const combinedCode = generatedCodes.join("\n\n");

      // Perform DeepCode analysis on the collaborative result
      const analysis = await deepCodeEngine.analyzeCode(combinedCode, {
        language: "typescript",
        framework: "multi-agent-collaboration",
        purpose: "collaborative-result",
        environment: "production",
      });

      // Generate summary and recommendations
      const confidence = this.calculateCollaborativeConfidence(results, analysis);
      const actions = this.extractCollaborativeActions(results, analysis);
      const nextSteps = this.generateCollaborativeNextSteps(results, analysis);

      const summary = `Collaborative result validation completed. Overall quality score: ${analysis.overall.score}/100. Production ready: ${analysis.overall.readyForProduction}.`;

      return {
        summary,
        actions,
        nextSteps,
        confidence,
        analysis,
      };
    } catch (error) {
      logger.error("Collaborative result validation failed:", error);
      throw error;
    }
  }

  private calculateCollaborativeConfidence(
    results: { [key: string]: EnhancedAgentResponse },
    analysis: DeepCodeAnalysis
  ): number {
    const agentConfidences = Object.values(results)
      .filter(result => result.confidence)
      .map(result => result.confidence);

    const avgAgentConfidence = agentConfidences.length > 0 
      ? agentConfidences.reduce((sum, conf) => sum + conf, 0) / agentConfidences.length
      : 0.5;

    const deepCodeConfidence = analysis.overall.score / 100;

    return (avgAgentConfidence + deepCodeConfidence) / 2;
  }

  private extractCollaborativeActions(
    results: { [key: string]: EnhancedAgentResponse },
    analysis: DeepCodeAnalysis
  ): string[] {
    const actions = [];

    // Extract actions from all agents
    Object.values(results).forEach(result => {
      if (result.actions) {
        actions.push(...result.actions);
      }
    });

    // Add DeepCode recommendations
    if (analysis.quality.suggestions) {
      actions.push(...analysis.quality.suggestions);
    }

    return [...new Set(actions)]; // Remove duplicates
  }

  private generateCollaborativeNextSteps(
    results: { [key: string]: EnhancedAgentResponse },
    analysis: DeepCodeAnalysis
  ): string[] {
    const nextSteps = [];

    // Extract next steps from all agents
    Object.values(results).forEach(result => {
      if (result.nextSteps) {
        nextSteps.push(...result.nextSteps);
      }
    });

    // Add DeepCode critical issues as next steps
    if (analysis.overall.criticalIssues.length > 0) {
      nextSteps.push(...analysis.overall.criticalIssues.map(issue => `Fix critical issue: ${issue}`));
    }

    return [...new Set(nextSteps)]; // Remove duplicates
  }

  private async logEnhancedAgentInteraction(
    agentType: string,
    message: string,
    response: EnhancedAgentResponse,
    userId: string,
    projectId?: string
  ): Promise<void> {
    try {
      await this.prisma.history.create({
        data: {
          type: "enhanced_agent_interaction",
          content: {
            agentType,
            message,
            response: {
              agent: response.agent,
              message: response.message,
              actions: response.actions,
              nextSteps: response.nextSteps,
              confidence: response.confidence,
              deepCodeAnalysis: response.deepCodeAnalysis,
              codeQuality: response.codeQuality,
            },
            userId,
            timestamp: new Date().toISOString(),
          },
          projectId: projectId || null,
        },
      });
    } catch (error) {
      logger.error("Failed to log enhanced agent interaction:", error);
    }
  }

  private async logDeepCodeInteraction(
    type: string,
    input: string,
    result: any,
    userId: string
  ): Promise<void> {
    try {
      await this.prisma.history.create({
        data: {
          type: `deepcode_${type}`,
          content: {
            type,
            input,
            result,
            userId,
            timestamp: new Date().toISOString(),
          },
          agentId: undefined,
          projectId: "",
        },
      });
    } catch (error) {
      logger.error("Failed to log DeepCode interaction:", error);
    }
  }

  async getActiveSession(sessionId: string): Promise<any> {
    return this.activeSessions.get(sessionId);
  }

  async getSessionHistory(userId: string): Promise<any[]> {
    try {
      const history = await this.prisma.history.findMany({
        where: {
          content: {
            path: ["userId"],
            equals: userId,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      });

      return history;
    } catch (error) {
      logger.error("Failed to get session history:", error);
      return [];
    }
  }
}

// Lazy initialization - do not instantiate with null PrismaClient at module level
let _enhancedOrchestrator: EnhancedAgentOrchestrator | null = null;

export function getEnhancedAgentOrchestrator(io?: Server | null, prisma?: PrismaClient): EnhancedAgentOrchestrator {
  if (!_enhancedOrchestrator) {
    if (!prisma) {
      throw new Error("PrismaClient required for first initialization");
    }
    _enhancedOrchestrator = new EnhancedAgentOrchestrator(io || null, prisma);
  }
  return _enhancedOrchestrator;
}
