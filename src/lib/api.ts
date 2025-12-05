import type { Event, ProjectSettings } from "./types";
import { getApiEndpoint, getAuthHeaders, logConfig } from "./config";

class ApiClient {
  constructor() {
    // Log configuration in development
    logConfig();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = getApiEndpoint(endpoint);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...((options.headers as Record<string, string>) || {}),
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Network error" }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Public event endpoints
  async getEvents() {
    return this.request<Event[]>("/events");
  }

  async getEventsByCategory() {
    return this.request<{
      success: boolean;
      theme_id: string;
      theme_name: string;
      categories: { [categoryId: string]: Event[] };
    }>("/events/by-category");
  }

  async getEvent(id: number) {
    return this.request<Event>(`/events/${id}`);
  }

  async getEventBySlug(slug: string) {
    return this.request<Event>(`/events/slug/${slug}`);
  }

  async voteEvent(id: number) {
    return this.request<{ message: string; votes: number; voted: boolean }>(
      `/events/${id}/vote`,
      {
        method: "POST",
      },
    );
  }

  async checkVoteStatus(id: number) {
    return this.request<{ voted: boolean; votes: number }>(
      `/events/${id}/vote-status`,
    );
  }

  // New reaction endpoints
  async getReactionTypes() {
    return this.request<{
      reactions: Array<{ type: string; emoji: string; label: string }>;
    }>("/reactions/types");
  }

  async addOrRemoveReaction(eventId: number, reactionType: string) {
    return this.request<{
      message: string;
      added?: boolean;
      removed?: boolean;
      reaction: string;
      summary: {
        event_id: number;
        total_count: number;
        reactions: Array<{ reaction_type: string; count: number }>;
        user_reactions: string[];
      };
    }>(`/events/${eventId}/reactions`, {
      method: "POST",
      body: JSON.stringify({ reaction_type: reactionType }),
    });
  }

  async getEventReactions(eventId: number) {
    return this.request<{
      event_id: number;
      total_count: number;
      reactions: Array<{ reaction_type: string; count: number }>;
      user_reactions: string[];
    }>(`/events/${eventId}/reactions`);
  }

  async getMyReactions(eventId: number) {
    return this.request<{
      event_id: number;
      reactions: string[];
    }>(`/events/${eventId}/reactions/me`);
  }

  async getAllReactionCounts() {
    return this.request<{ [eventId: string]: number }>(
      "/events/reactions/counts",
    );
  }

  async submitFeedback(title: string, content: string, formStartTime: number) {
    return this.request<{ message: string; id: number }>("/feedback", {
      method: "POST",
      body: JSON.stringify({ title, content, form_start_time: formStartTime }),
    });
  }

  // Public settings endpoints
  async getSettings() {
    return this.request<ProjectSettings>("/settings");
  }

  async getThemeSettings() {
    return this.request<{
      success: boolean;
      theme_id: string;
      settings: { [key: string]: any };
    }>("/theme/settings");
  }

  async getStatusMappings() {
    return this.request<{
      success: boolean;
      theme_id: string;
      categories: { [categoryId: string]: any[] };
    }>("/theme/status-mappings");
  }

  // Newsletter endpoints
  async subscribeToNewsletter(email: string) {
    return this.request<{
      message: string;
      email: string;
      already_subscribed?: boolean;
    }>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async unsubscribeFromNewsletter(email: string) {
    return this.request<{ message: string }>("/newsletter/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async checkNewsletterSubscription(email: string) {
    return this.request<{ subscribed: boolean; active: boolean }>(
      `/newsletter/status?email=${encodeURIComponent(email)}`,
    );
  }

  // Public footer links endpoint
  async getFooterLinksByColumn() {
    return this.request<{ links: { [key: string]: any[] } }>(
      "/footer-links/by-column",
    );
  }

  // Public tags endpoint
  async getTags() {
    return this.request<any[]>("/tags");
  }
}

// Export a singleton instance
export const api = new ApiClient();

// Export types for convenience
export type { Event, ProjectSettings } from "./types";
