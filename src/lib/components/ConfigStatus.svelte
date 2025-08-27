<script lang="ts">
    import { config } from "../config";
    import { onMount } from "svelte";

    let showStatus = false;

    onMount(() => {
        // Development mode card disabled
        showStatus = false;
    });
</script>

{#if showStatus}
    <div class="fixed bottom-4 right-4 z-50">
        <div
            class="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg border border-gray-700 max-w-xs"
        >
            <div class="font-semibold mb-2 text-green-400">
                🎨 Template System
            </div>

            <div class="space-y-1">
                <div class="flex justify-between">
                    <span class="text-gray-300">Mode:</span>
                    <span
                        class="font-mono {config.isExternalApi
                            ? 'text-yellow-400'
                            : 'text-green-400'}"
                    >
                        {config.isExternalApi ? "Development" : "Production"}
                    </span>
                </div>

                <div class="flex justify-between">
                    <span class="text-gray-300">API:</span>
                    <span
                        class="font-mono {config.isExternalApi
                            ? 'text-blue-400'
                            : 'text-green-400'}"
                    >
                        {config.apiUrl || "Same Origin"}
                    </span>
                </div>

                <div class="flex justify-between">
                    <span class="text-gray-300">Auth:</span>
                    <span class="font-mono text-green-400">Go Backend</span>
                </div>
            </div>

            {#if config.isExternalApi}
                <div class="mt-2 pt-2 border-t border-gray-700">
                    <div class="text-yellow-400 text-xs">
                        🚧 Development Mode
                    </div>
                    <div class="text-gray-400 text-xs mt-1">
                        Frontend dev server → Go backend
                    </div>
                </div>
            {:else}
                <div class="mt-2 pt-2 border-t border-gray-700">
                    <div class="text-green-400 text-xs">
                        🎯 Template System Active
                    </div>
                    <div class="text-gray-400 text-xs mt-1">
                        Served by Go backend
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    /* Ensure the component doesn't interfere with the main layout */
    :global(body) {
        padding-bottom: 0;
    }
</style>
