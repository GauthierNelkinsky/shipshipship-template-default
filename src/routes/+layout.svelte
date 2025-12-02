<script lang="ts">
    import "../app.css";
    import { onMount } from "svelte";
    import { settings, loadSettings } from "$lib/stores/settings";
    import { theme } from "$lib/stores/theme";
    import { Toaster } from "$lib/components/ui/sonner";
    import ConfigStatus from "$lib/components/ConfigStatus.svelte";
    import * as m from "$lib/paraglide/messages";

    let faviconUrl = "";

    onMount(async () => {
        // Initialize theme
        theme.init();

        // Load project settings
        await loadSettings();
    });

    // Reactive statement to update favicon when settings change
    $: {
        faviconUrl = $settings.favicon_url || "";
        updateFavicon(faviconUrl);
    }

    function updateFavicon(url: string) {
        if (typeof window === "undefined") return;

        // Remove existing favicon links
        const existingLinks = document.querySelectorAll('link[rel*="icon"]');
        existingLinks.forEach((link) => link.remove());

        if (url) {
            // Add new favicon
            const link = document.createElement("link");
            link.rel = "icon";
            link.type = "image/x-icon";
            link.href = url;
            document.head.appendChild(link);
        } else {
            // Fallback to default favicon.ico
            const link = document.createElement("link");
            link.rel = "icon";
            link.type = "image/x-icon";
            link.href = "/favicon.ico";
            document.head.appendChild(link);
        }
    }
</script>

<svelte:head>
    <title>{$settings.title || m.layout_title()}</title>
    <meta name="description" content={m.layout_description()} />
    {#if faviconUrl}
        <link rel="icon" type="image/x-icon" href={faviconUrl} />
    {/if}
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
    <slot />
    <Toaster />
    <ConfigStatus />
</div>
