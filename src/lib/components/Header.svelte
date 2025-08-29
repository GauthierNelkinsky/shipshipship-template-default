<script lang="ts">
    import { goto } from "$app/navigation";
    import { settings } from "$lib/stores/settings";
    import ThemeSelector from "$lib/components/ThemeSelector.svelte";
    import { ArrowLeft } from "lucide-svelte";
    import { getApiEndpoint } from "$lib/config";

    export let showBackButton = false;
    export let title = ""; // Optional override for the title

    // Function to get the complete URL for images that might be relative to the API
    function getCompleteImageUrl(url: string | undefined): string {
        if (!url) return "";

        // If the URL is already absolute (starts with http:// or https://) or is a data URL, return as is
        if (
            url.startsWith("http://") ||
            url.startsWith("https://") ||
            url.startsWith("data:")
        ) {
            return url;
        }

        // If the URL starts with '/api/upload/', use the API endpoint
        if (url.startsWith("/api/upload/")) {
            // Remove the '/api' prefix as getApiEndpoint will add it
            const path = url.substring(4);
            return getApiEndpoint(path);
        }

        // For other relative URLs, return as is
        return url;
    }
</script>

<header
    class="{showBackButton
        ? 'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
        : 'border-b border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm'}
        sticky top-0 z-40"
>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-10 min-w-0">
            <!-- Back Button + Logo/Title -->
            <div
                class="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1"
            >
                {#if showBackButton}
                    <button
                        on:click={() => goto("/")}
                        class="flex items-center justify-center w-7 h-7 rounded-md hover:bg-accent/50 transition-colors flex-shrink-0"
                        title="Back to changelog"
                    >
                        <ArrowLeft class="h-4 w-4" />
                    </button>
                {/if}

                {#if $settings?.website_url}
                    <a
                        href={$settings.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity min-w-0 flex-1"
                    >
                        {#if $settings?.logo_url}
                            <img
                                src={getCompleteImageUrl($settings.logo_url)}
                                alt="Logo"
                                class="h-8 max-h-8 w-auto object-contain dark:hidden"
                            />
                            {#if $settings?.dark_logo_url}
                                <img
                                    src={getCompleteImageUrl(
                                        $settings.dark_logo_url,
                                    )}
                                    alt="Logo"
                                    class="h-8 max-h-8 w-auto object-contain hidden dark:block"
                                />
                            {:else}
                                <img
                                    src={getCompleteImageUrl(
                                        $settings.logo_url,
                                    )}
                                    alt="Logo"
                                    class="h-8 max-h-8 w-auto object-contain hidden dark:block"
                                />
                            {/if}
                        {/if}
                        <h1
                            class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-neutral-100 truncate"
                        >
                            {title || $settings?.title || "Changelog"}
                        </h1>
                    </a>
                {:else}
                    <div
                        class="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1"
                    >
                        {#if $settings?.logo_url}
                            <img
                                src={getCompleteImageUrl($settings.logo_url)}
                                alt="Logo"
                                class="h-8 max-h-8 w-auto object-contain dark:hidden"
                            />
                            {#if $settings?.dark_logo_url}
                                <img
                                    src={getCompleteImageUrl(
                                        $settings.dark_logo_url,
                                    )}
                                    alt="Logo"
                                    class="h-8 max-h-8 w-auto object-contain hidden dark:block"
                                />
                            {:else}
                                <img
                                    src={getCompleteImageUrl(
                                        $settings.logo_url,
                                    )}
                                    alt="Logo"
                                    class="h-8 max-h-8 w-auto object-contain hidden dark:block"
                                />
                            {/if}
                        {/if}
                        <h1
                            class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-neutral-100 truncate"
                        >
                            {title || $settings?.title || "Changelog"}
                        </h1>
                    </div>
                {/if}
            </div>

            <!-- Theme Toggle -->
            <ThemeSelector />
        </div>
    </div>
</header>
