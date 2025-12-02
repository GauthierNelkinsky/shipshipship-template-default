<script lang="ts">
    import { getLocale, locales, setLocale } from "$lib/paraglide/runtime";
    import Icon from "@iconify/svelte";
    import * as m from "$lib/paraglide/messages";

    const languages: Record<string, string> = {
        en: "English",
        de: "Deutsch",
        fr: "Français",
        es: "Español",
        zh: "中文",
    };

    const flags: Record<string, string> = {
        en: "circle-flags:uk",
        de: "circle-flags:de",
        fr: "circle-flags:fr",
        es: "circle-flags:es",
        zh: "circle-flags:cn",
    };

    let isOpen = $state(false);

    function toggleDropdown() {
        isOpen = !isOpen;
    }

    async function switchLanguage(lang: "en" | "de" | "fr" | "es" | "zh") {
        await setLocale(lang);
        isOpen = false;
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const dropdown = document.getElementById("language-dropdown");
        if (dropdown && !dropdown.contains(target)) {
            isOpen = false;
        }
    }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="relative" id="language-dropdown">
    <button
        onclick={(e) => {
            e.stopPropagation();
            toggleDropdown();
        }}
        class="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
        title={m.language_select()}
        aria-label={m.language_select()}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
    >
        <Icon icon={flags[getLocale()]} class="h-4 w-4 flex-shrink-0" />
        <span class="hidden sm:inline">{languages[getLocale()]}</span>
        <svg
            class="h-3 w-3 flex-shrink-0 transition-transform {isOpen
                ? 'rotate-180'
                : ''}"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
            />
        </svg>
    </button>

    {#if isOpen}
        <div
            class="absolute top-full right-0 mt-1 min-w-[160px] rounded-md shadow-lg bg-popover border border-border overflow-hidden z-50"
            role="listbox"
            aria-label="Available languages"
        >
            {#each locales as lang}
                <button
                    onclick={(e) => {
                        e.stopPropagation();
                        switchLanguage(lang);
                    }}
                    class="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors {lang ===
                    getLocale()
                        ? 'bg-accent font-medium'
                        : ''}"
                    role="option"
                    aria-selected={lang === getLocale()}
                >
                    <Icon icon={flags[lang]} class="h-4 w-4 flex-shrink-0" />
                    {languages[lang]}
                </button>
            {/each}
        </div>
    {/if}
</div>
