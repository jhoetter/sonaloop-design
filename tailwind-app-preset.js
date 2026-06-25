/** Tailwind preset for Sonaloop product apps.
 *
 * It layers on the canonical token preset and names app-level surfaces that are
 * expected in MCP-first tools with a browser editor/inspector shell.
 */
import basePreset from './tailwind-preset.js';

export default {
  presets: [basePreset],
  theme: {
    extend: {
      colors: {
        sl: {
          bg: 'var(--sl-bg)',
          surface: 'var(--sl-surface)',
          'surface-2': 'var(--sl-surface-2)',
          hover: 'var(--sl-hover)',
          selected: 'var(--sl-sel)',
          line: 'var(--sl-line)',
          ink: 'var(--sl-ink)',
          muted: 'var(--sl-muted)',
          faint: 'var(--sl-faint)',
          accent: 'var(--sl-accent)',
          'accent-weak': 'var(--sl-accent-weak)',
          'accent-ink': 'var(--sl-accent-ink)',
        },
      },
      spacing: {
        'sl-1': 'var(--sl-s-1)',
        'sl-2': 'var(--sl-s-2)',
        'sl-3': 'var(--sl-s-3)',
        'sl-4': 'var(--sl-s-4)',
        'sl-5': 'var(--sl-s-5)',
        'sl-row': 'var(--sl-row)',
        'sl-row-h': 'var(--sl-row-h)',
      },
      boxShadow: {
        'sl-popover': '0 20px 70px color-mix(in srgb, var(--sl-ink) 18%, transparent)',
      },
    },
  },
};
