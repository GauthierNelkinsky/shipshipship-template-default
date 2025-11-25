<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { api } from "$lib/api";
    import Icon from "@iconify/svelte";
    import { SmilePlus } from "lucide-svelte";

    interface Props {
        eventId: number;
        variant?: "inline" | "popover";
        size?: "sm" | "md" | "lg";
        initialReactions?: any; // Optional: reaction_summary from event API
    }

    let {
        eventId,
        variant = "inline",
        size = "md",
        initialReactions = null,
    }: Props = $props();

    const dispatch = createEventDispatcher();

    let reactions = $state<Array<{ reaction_type: string; count: number }>>([]);
    let userReactions = $state<string[]>([]);
    let totalCount = $state(0);
    let loading = $state(false);
    let error = $state("");
    let showPopover = $state(false);
    let popoverRef: HTMLDivElement;

    const reactionTypes = [
        {
            type: "thumbs_up",
            icon: "fluent-emoji-flat:thumbs-up",
            label: "Like",
        },
        { type: "heart", icon: "fluent-emoji-flat:red-heart", label: "Love" },
        { type: "fire", icon: "fluent-emoji-flat:fire", label: "Hot" },
        {
            type: "party",
            icon: "fluent-emoji-flat:party-popper",
            label: "Excited",
        },
        { type: "eyes", icon: "fluent-emoji-flat:eyes", label: "Watching" },
        {
            type: "lightbulb",
            icon: "fluent-emoji-flat:light-bulb",
            label: "Great Idea",
        },
        {
            type: "thinking",
            icon: "fluent-emoji-flat:thinking-face",
            label: "Thinking",
        },
        {
            type: "thumbs_down",
            icon: "fluent-emoji-flat:thumbs-down",
            label: "Disagree",
        },
    ];

    // Use $effect to handle initialReactions reactively
    $effect(() => {
        if (initialReactions) {
            reactions = initialReactions.reactions || [];
            userReactions = initialReactions.user_reactions || [];
            totalCount = initialReactions.total_count || 0;
        } else {
            loadReactions();
        }
    });

    onMount(() => {
        if (variant === "popover") {
            document.addEventListener("click", handleClickOutside);
            return () => {
                document.removeEventListener("click", handleClickOutside);
            };
        }
    });

    function handleClickOutside(event: MouseEvent) {
        if (
            popoverRef &&
            !popoverRef.contains(event.target as Node) &&
            showPopover
        ) {
            showPopover = false;
        }
    }

    async function loadReactions() {
        try {
            const data = await api.getEventReactions(eventId);
            reactions = data.reactions || [];
            userReactions = data.user_reactions || [];
            totalCount = data.total_count || 0;
        } catch (err) {
            console.error("Failed to load reactions:", err);
        }
    }

    async function toggleReaction(reactionType: string) {
        if (loading) return;

        loading = true;
        error = "";

        try {
            const result = await api.addOrRemoveReaction(eventId, reactionType);
            reactions = result.summary.reactions;
            userReactions = result.summary.user_reactions;
            totalCount = result.summary.total_count;

            dispatch("reactionChange", {
                eventId,
                totalCount,
                added: result.added,
                removed: result.removed,
                reactionType,
            });

            if (variant === "popover" && result.added) {
                // Keep popover open briefly after adding
                setTimeout(() => {
                    showPopover = false;
                }, 300);
            }
        } catch (err: any) {
            error = err.message || "Failed to update reaction";
            setTimeout(() => {
                error = "";
            }, 3000);
        } finally {
            loading = false;
        }
    }

    function getReactionCount(type: string): number {
        const reaction = reactions.find((r) => r.reaction_type === type);
        return reaction?.count || 0;
    }

    function isActive(type: string): boolean {
        return userReactions.includes(type);
    }

    function getButtonSizeClasses(): string {
        switch (size) {
            case "sm":
                return "px-2 py-1 text-xs gap-1";
            case "lg":
                return "px-4 py-2.5 text-base gap-2";
            default:
                return "px-3 py-1.5 text-sm gap-1.5";
        }
    }

    function getEmojiSizeClasses(): string {
        switch (size) {
            case "sm":
                return "text-sm";
            case "lg":
                return "text-xl";
            default:
                return "text-base";
        }
    }

    // Filter reactions with count > 0 for display
    let displayedReactions = $derived(reactions.filter((r) => r.count > 0));
</script>

{#if variant === "inline"}
    <div class="flex flex-wrap items-center gap-1.5">
        {#each reactionTypes as { type, icon, label }}
            {@const count = getReactionCount(type)}
            {#if count > 0 || isActive(type)}
                <button
                    type="button"
                    on:click={() => toggleReaction(type)}
                    disabled={loading}
                    class="inline-flex items-center {getButtonSizeClasses()} rounded-full border transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed {isActive(
                        type,
                    )
                        ? 'bg-primary/10 border-primary text-primary font-medium'
                        : 'bg-background border-border hover:bg-muted hover:border-muted-foreground/20'}"
                    title="{label} ({count})"
                >
                    <Icon {icon} class="h-3.5 w-3.5" />
                    {#if count > 0}
                        <span
                            class="font-medium {isActive(type)
                                ? 'text-primary'
                                : 'text-muted-foreground'}"
                        >
                            {count}
                        </span>
                    {/if}
                </button>
            {/if}
        {/each}

        <!-- Add reaction button (always visible) -->
        <button
            type="button"
            on:click={() => {
                showPopover = !showPopover;
            }}
            class="inline-flex items-center {getButtonSizeClasses()} rounded-full border border-dashed border-border hover:border-muted-foreground/40 hover:bg-muted transition-all duration-200"
            title="Add reaction"
        >
            <SmilePlus class="h-3.5 w-3.5" />
        </button>

        {#if showPopover}
            <div
                bind:this={popoverRef}
                class="absolute z-50 mt-2 p-2 bg-popover border border-border rounded-lg shadow-lg"
            >
                <div class="flex gap-1">
                    {#each reactionTypes as { type, icon, label }}
                        <button
                            type="button"
                            on:click={() => toggleReaction(type)}
                            disabled={loading}
                            class="flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors {isActive(
                                type,
                            )
                                ? 'bg-primary/10 ring-2 ring-primary'
                                : ''}"
                            title={label}
                        >
                            <Icon {icon} class="h-4 w-4" />
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        {#if error}
            <span class="text-xs text-destructive">{error}</span>
        {/if}
    </div>
{:else if variant === "popover"}
    <div class="relative inline-block" bind:this={popoverRef}>
        <!-- Display reactions with counts + add button -->
        <div class="flex items-center gap-1">
            {#each reactionTypes as { type, icon, label }}
                {@const count = getReactionCount(type)}
                {#if count > 0}
                    <button
                        type="button"
                        on:click={() => toggleReaction(type)}
                        disabled={loading}
                        class="inline-flex items-center gap-1 px-1.5 py-1 rounded-full border transition-all duration-200 hover:scale-105 disabled:opacity-50 {isActive(
                            type,
                        )
                            ? 'bg-primary/10 border-primary'
                            : 'bg-background border-border hover:bg-muted hover:border-muted-foreground/20'}"
                        title="{label} ({count})"
                    >
                        <Icon {icon} class="h-3.5 w-3.5" />
                        <span
                            class="text-xs font-medium {isActive(type)
                                ? 'text-primary'
                                : 'text-muted-foreground'}"
                        >
                            {count}
                        </span>
                    </button>
                {/if}
            {/each}

            <!-- Add reaction button -->
            <button
                type="button"
                on:click={() => {
                    showPopover = !showPopover;
                }}
                disabled={loading}
                class="inline-flex items-center px-1.5 py-1 rounded-full border border-border hover:border-muted-foreground/40 bg-background hover:bg-muted transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add reaction"
            >
                <SmilePlus class="h-3.5 w-3.5 text-muted-foreground" />
            </button>
        </div>

        <!-- Popover content -->
        {#if showPopover}
            <div
                class="absolute z-50 mt-1 right-0 p-1.5 bg-popover border border-border rounded-md shadow-lg"
            >
                <div class="flex gap-0.5">
                    {#each reactionTypes as { type, icon, label }}
                        {@const count = getReactionCount(type)}
                        <button
                            type="button"
                            on:click={() => toggleReaction(type)}
                            disabled={loading}
                            class="flex items-center justify-center p-1.5 rounded transition-all duration-150 hover:scale-110 disabled:opacity-50 {isActive(
                                type,
                            )
                                ? 'bg-primary/15'
                                : 'hover:bg-muted/50'}"
                            title={label}
                        >
                            <Icon {icon} class="h-4 w-4" />
                        </button>
                    {/each}
                </div>

                {#if error}
                    <div class="mt-2 text-xs text-destructive text-center">
                        {error}
                    </div>
                {/if}
            </div>
        {/if}
    </div>
{/if}

<style>
    /* Add smooth transitions */
    button {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 200ms;
    }

    /* Popover animation */
    .absolute {
        animation: slideIn 0.2s ease-out;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
