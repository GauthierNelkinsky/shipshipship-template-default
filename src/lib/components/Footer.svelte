<script lang="ts">
    import { onMount } from "svelte";
    import { themeSettings } from "$lib/stores/themeSettings";
    import { ExternalLink } from "lucide-svelte";
    import * as m from "$lib/paraglide/messages";

    onMount(async () => {
        await themeSettings.load();
    });

    function getLinksForColumn(column: "left" | "middle" | "right") {
        const columnKey =
            `footer-links-${column}` as keyof typeof $themeSettings;
        return (
            ($themeSettings[columnKey] as Array<{
                displayName: string;
                url: string;
            }>) || []
        );
    }

    function hasAnyLinks() {
        return (
            getLinksForColumn("left").length > 0 ||
            getLinksForColumn("middle").length > 0 ||
            getLinksForColumn("right").length > 0
        );
    }
</script>

<footer
    class="border-t border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm"
>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {#if hasAnyLinks()}
            <!-- Footer with custom links -->
            <div class="py-8">
                <div
                    class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-start"
                >
                    <!-- Left Column -->
                    <div
                        class="space-y-3 text-center md:text-left max-w-xs mx-auto md:mx-0"
                    >
                        {#each getLinksForColumn("left") as link}
                            <a
                                href={link.url}
                                target={link.url.startsWith("http")
                                    ? "_blank"
                                    : "_self"}
                                rel={link.url.startsWith("http")
                                    ? "noopener noreferrer"
                                    : ""}
                                class="block text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors"
                            >
                                <span class="flex items-center gap-1">
                                    {link.displayName}
                                    {#if link.url.startsWith("http")}
                                        <ExternalLink class="h-3 w-3" />
                                    {/if}
                                </span>
                            </a>
                        {/each}
                    </div>

                    <!-- Middle Column (with ShipShipShip attribution) -->
                    <div
                        class="space-y-3 text-center px-4 md:px-8 max-w-xs mx-auto"
                    >
                        <!-- ShipShipShip Attribution (first to align with other columns) -->
                        {#if getLinksForColumn("middle").length === 0}
                            <div class="text-center">
                                <p
                                    class="text-sm text-gray-500 dark:text-neutral-400 flex items-center justify-center gap-2"
                                >
                                    {m.footer_shipped_with()}
                                    <a
                                        href="https://github.com/GauthierNelkinsky/ShipShipShip"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="font-medium text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1"
                                    >
                                        ShipShipShip 🚢
                                    </a>
                                </p>
                            </div>
                        {:else}
                            {#each getLinksForColumn("middle") as link}
                                <a
                                    href={link.url}
                                    target={link.url.startsWith("http")
                                        ? "_blank"
                                        : "_self"}
                                    rel={link.url.startsWith("http")
                                        ? "noopener noreferrer"
                                        : ""}
                                    class="block text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors text-center"
                                >
                                    <span
                                        class="flex items-center justify-center gap-1"
                                    >
                                        {link.displayName}
                                        {#if link.url.startsWith("http")}
                                            <ExternalLink class="h-3 w-3" />
                                        {/if}
                                    </span>
                                </a>
                            {/each}

                            <!-- ShipShipShip Attribution after middle links -->
                            <div class="text-center">
                                <p
                                    class="text-sm text-gray-500 dark:text-neutral-400 flex items-center justify-center gap-2"
                                >
                                    {m.footer_shipped_with()}
                                    <a
                                        href="https://github.com/GauthierNelkinsky/ShipShipShip"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="font-medium text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1"
                                    >
                                        ShipShipShip 🚢
                                    </a>
                                </p>
                            </div>
                        {/if}
                    </div>

                    <!-- Right Column -->
                    <div
                        class="space-y-3 text-center md:text-right max-w-xs mx-auto md:mx-0"
                    >
                        {#each getLinksForColumn("right") as link}
                            <a
                                href={link.url}
                                target={link.url.startsWith("http")
                                    ? "_blank"
                                    : "_self"}
                                rel={link.url.startsWith("http")
                                    ? "noopener noreferrer"
                                    : ""}
                                class="block text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors text-center md:text-right"
                            >
                                <span
                                    class="flex items-center justify-center md:justify-end gap-1"
                                >
                                    {link.displayName}
                                    {#if link.url.startsWith("http")}
                                        <ExternalLink class="h-3 w-3" />
                                    {/if}
                                </span>
                            </a>
                        {/each}
                    </div>
                </div>
            </div>
        {:else}
            <!-- Default footer without custom links -->
            <div class="flex items-center justify-center h-16 px-4">
                <p
                    class="text-sm text-gray-500 dark:text-neutral-400 flex items-center gap-2"
                >
                    {m.footer_shipped_with()}
                    <a
                        href="https://github.com/GauthierNelkinsky/ShipShipShip"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="font-medium text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1"
                    >
                        ShipShipShip 🚢
                    </a>
                </p>
            </div>
        {/if}
    </div>
</footer>
