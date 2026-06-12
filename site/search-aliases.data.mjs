/**
 * sonaloop-design — docs-site search aliases.
 *
 * Curated synonyms the ⌘K palette folds into its matching, so the words people
 * actually type ("wizard", "blank state", "dark mode") land on the right page
 * instead of dead-ending at "No matches". Keyed by page id (the NAV ids in
 * site/app.js); every alias is lowercase. When a query hits an alias the palette
 * shows it as a quiet "≈ alias" subtitle so the redirect is legible.
 *
 * Keep this small and intentional — aliases are for vocabulary gaps observed in
 * real sessions, not an exhaustive thesaurus.
 */
export const searchAliases = {
  // components
  stepper: ['wizard', 'progress steps', 'steps', 'step indicator', 'onboarding flow', 'multi-step'],
  'empty-state': ['blank state', 'zero state', 'no results', 'no data', 'nothing here', 'placeholder'],
  progress: ['progress bar', 'loading bar', 'completion', 'percent bar'],
  'theme-toggle': ['dark mode', 'light mode', 'color scheme', 'appearance'],
  switch: ['toggle'],
  select: ['dropdown', 'combobox'],
  input: ['text field', 'textbox', 'search box', 'form field'],
  avatar: ['profile picture', 'initials', 'user image'],
  badge: ['status label', 'count'],
  note: ['callout', 'alert', 'banner', 'admonition'],
  snippet: ['code block', 'copy command', 'terminal command'],
  table: ['data grid', 'data table'],
  breadcrumb: ['navigation trail', 'path'],
  kbd: ['keyboard shortcut', 'hotkey', 'shortcut key'],
  'icon-button': ['ghost button'],
  'arrow-link': ['more link', 'read more'],
  // composites
  'command-palette': ['cmdk', 'cmd+k', 'search palette', 'spotlight', 'quick switcher', 'omnibox'],
  modal: ['dialog', 'confirm'],
  drawer: ['slide-over', 'side panel', 'sheet', 'peek'],
  popover: ['menu', 'dropdown menu', 'context menu'],
  'filter-bar': ['filters', 'facets', 'faceted search'],
  'app-shell': ['sidebar', 'navigation shell', 'layout shell'],
  'list-page': ['index page', 'list view'],
  'image-lightbox': ['image zoom', 'image preview'],
  // foundations
  icons: ['iconography', 'glyphs', 'arrow', 'arrows', 'symbols'],
  colors: ['palette', 'colour', 'theme colors'],
  typography: ['fonts', 'typeface', 'type'],
  layout: ['spacing', 'grid', 'radius'],
};
