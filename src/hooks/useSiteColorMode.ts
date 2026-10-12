import { useSyncExternalStore } from 'react';

type ColorMode = 'light' | 'dark';
const storageKey = 'chakra-ui-color-mode';
const getSnapshot = (): ColorMode =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
const getServerSnapshot = (): ColorMode => 'light';

function applyColorMode(mode: ColorMode) {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    document.body.classList.toggle('chakra-ui-dark', mode === 'dark');
    document.body.classList.toggle('chakra-ui-light', mode === 'light');
}

function subscribe(notify: () => void) {
    const observer = new MutationObserver(notify);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
    });
    const storage = (event: StorageEvent) => {
        if (
            event.key === storageKey &&
            (event.newValue === 'light' || event.newValue === 'dark')
        )
            applyColorMode(event.newValue);
    };
    window.addEventListener('storage', storage);
    return () => {
        observer.disconnect();
        window.removeEventListener('storage', storage);
    };
}

// Shares Chakra's bootstrap and storage key without loading its component runtime.
export function useSiteColorMode() {
    const colorMode = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );
    const toggleColorMode = () => {
        const next = getSnapshot() === 'dark' ? 'light' : 'dark';
        try {
            localStorage.setItem(storageKey, next);
        } catch {
            /* Appearance still works without storage. */
        }
        applyColorMode(next);
    };
    return { colorMode, toggleColorMode };
}
