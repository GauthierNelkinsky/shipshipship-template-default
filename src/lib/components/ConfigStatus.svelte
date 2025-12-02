<script lang="ts">
    import { config } from "../config";
    import { onMount } from "svelte";
    import * as m from "$lib/paraglide/messages";

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
                {m.config_status_title()}
            </div>

            <div class="space-y-1">
                <div class="flex justify-between">
                    <span class="text-gray-300">{m.config_status_mode()}</span>
                    <span
                        class="font-mono {config.isExternalApi
                            ? 'text-yellow-400'
                            : 'text-green-400'}"
                    >
                        {config.isExternalApi
                            ? m.config_status_mode_development()
                            : m.config_status_mode_production()}
                    </span>
                </div>

                <div class="flex justify-between">
                    <span class="text-gray-300">{m.config_status_api()}</span>
                    <span
                        class="font-mono {config.isExternalApi
                            ? 'text-blue-400'
                            : 'text-green-400'}"
                    >
                        {config.apiUrl || m.config_status_api_same_origin()}
                    </span>
                </div>

                <div class="flex justify-between">
                    <span class="text-gray-300">{m.config_status_auth()}</span>
                    <span class="font-mono text-green-400"
                        >{m.config_status_auth_go_backend()}</span
                    >
                </div>
            </div>

            {#if config.isExternalApi}
                <div class="mt-2 pt-2 border-t border-gray-700">
                    <div class="text-yellow-400 text-xs">
                        {m.config_status_dev_mode()}
                    </div>
                    <div class="text-gray-400 text-xs mt-1">
                        {m.config_status_dev_description()}
                    </div>
                </div>
            {:else}
                <div class="mt-2 pt-2 border-t border-gray-700">
                    <div class="text-green-400 text-xs">
                        {m.config_status_template_active()}
                    </div>
                    <div class="text-gray-400 text-xs mt-1">
                        {m.config_status_template_description()}
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
