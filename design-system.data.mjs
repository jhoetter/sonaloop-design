/**
 * Workspace design-system instance contract.
 *
 * This is the machine-readable default Sonaloop instance for customer-owned
 * workspace design systems. It is deliberately data, not CSS: cloud/core
 * consumers validate customer payloads against this role vocabulary, then
 * compile the canonical object into CSS variables, chart palettes and deck
 * renderer inputs.
 */
import { fonts, scales, website, inspector } from './tokens.data.mjs';
import {
  palette as deckPalette,
  frame as deckFrame,
  type as deckType,
  tones as deckTones,
  layouts as deckLayouts,
  deckIcons,
  deckIconTints,
  deckLogos,
  deckCanvases,
} from './deck.data.mjs';

export const WORKSPACE_DESIGN_SYSTEM_SPEC_VERSION = 'workspace_design_system.v2';

export const fieldPolicy = {
  editable: [
    'brand',
    'colors',
    'typography',
    'layout',
    'imagery',
    'charts',
    'deck',
    'exports',
  ],
  derived: [
    'compiled_css',
    'font_face_css',
    'pptx_renditions',
    'asset_hashes',
    'contrast_report',
  ],
  internal: [
    'component_class_contract',
    'renderer_layout_painters',
    'python_vendor_modules',
  ],
  unsupported: [
    'arbitrary_css',
    'workspace_javascript',
    'workspace_react_components',
    'workspace_python_components',
    'remote_runtime_fonts',
    'arbitrary_pptx_template_import',
  ],
};

export const colorRoles = [
  { key: 'paper', label: 'Main background', css_vars: ['--paper', '--bg'] },
  { key: 'paper_2', label: 'Secondary background', css_vars: ['--paper-2', '--panel-2'] },
  { key: 'ink', label: 'Primary text', css_vars: ['--ink', '--sl-ink'] },
  { key: 'ink_2', label: 'Secondary text', css_vars: ['--ink-2'] },
  { key: 'muted', label: 'Muted text', css_vars: ['--muted', '--sl-muted'] },
  { key: 'faint', label: 'Faint metadata', css_vars: ['--faint', '--sl-faint'] },
  { key: 'line', label: 'Hairline border', css_vars: ['--line', '--sl-line'] },
  { key: 'line_2', label: 'Subtle divider', css_vars: ['--line-2', '--sl-line-2'] },
  { key: 'panel', label: 'Card and report panel', css_vars: ['--panel', '--sl-surface'] },
  { key: 'panel_2', label: 'Nested panel', css_vars: ['--panel-2', '--sl-surface-2'] },
  { key: 'sidebar', label: 'App navigation surface', css_vars: ['--sidebar', '--sl-sidebar'] },
  { key: 'overlay', label: 'Modal and popover surface', css_vars: ['--overlay', '--sl-overlay'] },
  { key: 'accent', label: 'Primary accent', css_vars: ['--accent', '--sl-accent'] },
  { key: 'accent_ink', label: 'Text on accent', css_vars: ['--accent-ink', '--sl-accent-ink'] },
  { key: 'accent_weak', label: 'Weak accent fill', css_vars: ['--accent-weak', '--sl-accent-weak'] },
  { key: 'hover', label: 'Hover fill', css_vars: ['--hover', '--sl-hover'] },
  { key: 'selected', label: 'Selected fill', css_vars: ['--sel', '--sl-sel'] },
  { key: 'green', label: 'Positive and recommendation', css_vars: ['--green', '--sl-green'] },
  { key: 'amber', label: 'Warning and risk', css_vars: ['--amber', '--sl-amber'] },
  { key: 'red', label: 'Negative and error', css_vars: ['--red', '--sl-red'] },
  { key: 'blue', label: 'Informational hue', css_vars: ['--blue', '--sl-blue'] },
  { key: 'violet', label: 'Secondary categorical hue', css_vars: ['--violet', '--sl-violet'] },
  { key: 'skeptical', label: 'Skepticism and opposition signal', css_vars: ['--skep', '--sl-skep'] },
];

export const typographyRoles = [
  { key: 'sans', label: 'UI, reports and deck default' },
  { key: 'serif', label: 'Optional editorial heading role' },
  { key: 'mono', label: 'IDs, code-like labels and metadata' },
  { key: 'display', label: 'Optional cover and hero role' },
  { key: 'pixel', label: 'Rare instrument accent role' },
];

export const layoutRoles = {
  radius: ['radius_sm', 'radius', 'radius_lg', 'radius_full'],
  spacing: ['s_1', 's_2', 's_3', 's_4', 's_5', 's_6', 's_8'],
  gaps: ['gap_tight', 'gap_item', 'gap_group', 'gap_section', 'gap_region'],
  density: ['row_dense', 'row', 'row_h', 'ctl_sm'],
  reading: ['measure_prose'],
  motion: ['ease'],
  elevation: ['shadow_sm', 'shadow_lg'],
};

export const imageryRoles = [
  'canvas',
  'hero',
  'report_cover',
  'deck_cover',
  'section',
  'closing',
  'pattern',
  'product_frame',
];

export const brandLogoRoles = [
  'icon',
  'wordmark',
  'lockup',
  'lockup_dark',
  'mono',
  'reversed',
  'favicon',
];

const canvasPairs = {
  canvas: {
    label: 'Canvas',
    description: 'Atmospheric oil-painted backdrop with soft hills under a wide sky.',
    light_file: 'images/canvas/dawn.jpg',
    dark_file: 'images/canvas/dusk.jpg',
    deck_file: `images/canvas/${deckCanvases.dawn}`,
    width: 1800,
    height: 1200,
  },
  abstract: {
    label: 'Abstract',
    description: 'Pure colour-field wash in the brand palette.',
    light_file: 'images/canvas/abstract-light.jpg',
    dark_file: 'images/canvas/abstract-dark.jpg',
    deck_file: `images/canvas/${deckCanvases.abstract}`,
    width: 1800,
    height: 1200,
  },
  mist: {
    label: 'Mist',
    description: 'Layered morning mist over a still reflective plane.',
    light_file: 'images/canvas/mist-light.jpg',
    dark_file: 'images/canvas/mist-dark.jpg',
    deck_file: `images/canvas/${deckCanvases.mist}`,
    width: 1800,
    height: 1200,
  },
  meadow: {
    label: 'Meadow',
    description: 'Soft blurred wildflower meadow under an open sky.',
    light_file: 'images/canvas/meadow-light.jpg',
    dark_file: 'images/canvas/meadow-dark.jpg',
    deck_file: `images/canvas/${deckCanvases.meadow}`,
    width: 1800,
    height: 1200,
  },
  sky: {
    label: 'Sky',
    description: 'Almost-empty atmospheric sky with soft cloud banding.',
    light_file: 'images/canvas/sky-light.jpg',
    dark_file: 'images/canvas/sky-dark.jpg',
    deck_file: `images/canvas/${deckCanvases.sky}`,
    width: 1800,
    height: 1200,
  },
};

const colorDefaults = {
  light: {
    paper: website.light.paper,
    paper_2: website.light['paper-2'],
    ink: inspector.light.ink,
    ink_2: website.light['ink-2'],
    muted: inspector.light.muted,
    faint: inspector.light.faint,
    line: inspector.light.line,
    line_2: inspector.light['line-2'],
    panel: inspector.light.panel,
    panel_2: inspector.light['panel-2'],
    sidebar: inspector.light.sidebar,
    overlay: inspector.light.overlay,
    accent: inspector.light.accent,
    accent_ink: inspector.light['accent-ink'],
    accent_weak: inspector.light['accent-weak'],
    hover: inspector.light.hover,
    selected: inspector.light.sel,
    green: inspector.light.green,
    amber: inspector.light.amber,
    red: inspector.light.red,
    blue: inspector.light.blue,
    violet: inspector.light.violet,
    skeptical: inspector.light.skep,
  },
  dark: {
    paper: website.dark.paper,
    paper_2: website.dark['paper-2'],
    ink: inspector.dark.ink,
    ink_2: website.dark['ink-2'],
    muted: inspector.dark.muted,
    faint: inspector.dark.faint,
    line: inspector.dark.line,
    line_2: inspector.dark['line-2'],
    panel: inspector.dark.panel,
    panel_2: inspector.dark['panel-2'],
    sidebar: inspector.dark.sidebar,
    overlay: inspector.dark.overlay,
    accent: inspector.dark.accent,
    accent_ink: inspector.dark['accent-ink'],
    accent_weak: inspector.dark['accent-weak'],
    hover: inspector.dark.hover,
    selected: inspector.dark.sel,
    green: inspector.dark.green,
    amber: inspector.dark.amber,
    red: inspector.dark.red,
    blue: inspector.dark.blue,
    violet: inspector.dark.violet,
    skeptical: inspector.dark.skep,
  },
};

const typeScale = {
  t_xs: scales['t-xs'],
  t_sm: scales['t-sm'],
  t_body: scales['t-body'],
  t_md: scales['t-md'],
  t_prose: scales['t-prose'],
  t_lg: scales['t-lg'],
  t_xl: scales['t-xl'],
  t_2xl: scales['t-2xl'],
};

const layoutDefaults = {
  radius: {
    radius_sm: scales['radius-sm'],
    radius: scales.radius,
    radius_lg: scales['radius-lg'],
    radius_full: scales['radius-full'],
  },
  spacing: {
    s_1: scales['s-1'],
    s_2: scales['s-2'],
    s_3: scales['s-3'],
    s_4: scales['s-4'],
    s_5: scales['s-5'],
    s_6: scales['s-6'],
    s_8: scales['s-8'],
  },
  gaps: {
    gap_tight: scales['gap-tight'],
    gap_item: scales['gap-item'],
    gap_group: scales['gap-group'],
    gap_section: scales['gap-section'],
    gap_region: scales['gap-region'],
  },
  density: {
    row_dense: scales['row-dense'],
    row: scales.row,
    row_h: scales['row-h'],
    ctl_sm: scales['ctl-sm'],
  },
  reading: {
    measure_prose: scales['measure-prose'],
  },
  motion: {
    ease: scales.ease,
  },
  elevation: {
    light: {
      shadow_sm: inspector.light['shadow-sm'],
      shadow_lg: inspector.light['shadow-lg'],
    },
    dark: {
      shadow_sm: inspector.dark['shadow-sm'],
      shadow_lg: inspector.dark['shadow-lg'],
    },
  },
};

export const workspaceDesignSystemSpec = {
  spec_version: WORKSPACE_DESIGN_SYSTEM_SPEC_VERSION,
  title: 'Workspace design-system instance',
  description: 'A customer-owned data instance of the Sonaloop design-system role vocabulary.',
  surfaces: ['app', 'report', 'public', 'html_export', 'pdf_export', 'pptx_deck'],
  field_policy: fieldPolicy,
  groups: {
    brand: {
      editable: true,
      fields: brandLogoRoles,
      required: ['name'],
      notes: ['Logos are asset refs. SVGs must be sanitized; PPTX consumes generated PNG renditions.'],
    },
    colors: {
      editable: true,
      schemes: ['light', 'dark'],
      roles: colorRoles,
      validation: [
        'ink_on_paper_contrast',
        'accent_ink_on_accent_contrast',
        'line_visibility',
        'chart_series_distinguishable',
      ],
    },
    typography: {
      editable: true,
      roles: typographyRoles,
      validation: ['uploaded_fonts_are_local_assets', 'font_stacks_include_fallbacks'],
    },
    layout: {
      editable: true,
      roles: layoutRoles,
      validation: ['bounded_radius', 'bounded_spacing', 'minimum_row_height', 'maximum_type_scale'],
    },
    imagery: {
      editable: true,
      roles: imageryRoles,
      validation: ['local_assets_only', 'renditions_for_pdf_and_pptx'],
    },
    charts: {
      editable: true,
      validation: ['series_count', 'semantic_status_colors', 'gridline_contrast'],
    },
    deck: {
      editable: true,
      boundary: 'tokenized_master_deck',
      layouts: deckLayouts.map(({ key, title }) => ({ key, title })),
      validation: ['native_shapes_only', 'pptx_safe_asset_renditions', 'font_availability_warning'],
    },
    exports: {
      editable: true,
      validation: ['snapshot_version_id', 'snapshot_asset_hashes', 'self_contained_html_pdf'],
    },
  },
};

export const defaultWorkspaceDesignSystem = {
  spec_version: WORKSPACE_DESIGN_SYSTEM_SPEC_VERSION,
  meta: {
    name: 'Sonaloop default',
    source: 'sonaloop-design',
    description: 'The default Sonaloop design-system instance used when a workspace has no customer system.',
  },
  brand: {
    name: 'Sonaloop',
    short_name: 'Sonaloop',
    tagline: 'Synthetic research that disagrees with you',
    logo_variants: {
      icon: { kind: 'builtin_icon', ref: 'regular.sonaloop', source: 'icons.data.mjs' },
      wordmark: { kind: 'text_lockup', text: 'Sonaloop', source: 'components.css .sl-logo' },
      lockup: { kind: 'composite', icon: 'icon', wordmark: 'wordmark' },
      mono: { kind: 'builtin_icon', ref: 'regular.sonaloop', source: 'icons.data.mjs' },
      favicon: { kind: 'file', ref: 'site/favicon.svg' },
    },
    logo_preferred: 'lockup',
    deck_logo_preferred: 'icon',
    report_logo_preferred: 'lockup',
  },
  colors: colorDefaults,
  typography: {
    fonts: {
      sans: { family: 'Sona', stack: fonts.sans, source: 'fonts/Sona-Variable.woff2' },
      serif: { family: 'Sona', stack: fonts.serif, source: 'fonts/Sona-Variable.woff2' },
      mono: { family: 'Sona Mono', stack: fonts.mono, source: 'fonts/SonaMono-Variable.woff2' },
      display: { family: 'Sona', stack: fonts.sans, source: 'fonts/Sona-Variable.woff2' },
      pixel: { family: 'Sona Pixel', stack: fonts.pixel, source: 'fonts/SonaPixel-Line.woff2' },
    },
    type_scale: typeScale,
  },
  layout: layoutDefaults,
  imagery: {
    sets: canvasPairs,
    roles: {
      canvas: 'canvas',
      hero: 'canvas',
      report_cover: 'canvas',
      deck_cover: 'canvas',
      section: 'meadow',
      closing: 'sky',
      pattern: 'abstract',
      product_frame: 'mist',
    },
  },
  charts: {
    series: deckPalette.series,
    status: {
      positive: colorDefaults.light.green,
      warning: colorDefaults.light.amber,
      negative: colorDefaults.light.red,
      skeptical: colorDefaults.light.skeptical,
      neutral: colorDefaults.light.muted,
    },
    grid: colorDefaults.light.line,
    label_font_role: 'sans',
  },
  deck: {
    boundary: 'tokenized_master_deck',
    frame: deckFrame,
    palette: deckPalette,
    type: deckType,
    tones: deckTones,
    layouts: deckLayouts.map(({ key, title, desc, usage }) => ({ key, title, desc, usage })),
    recommended_icons: deckIcons,
    icon_tints: deckIconTints,
    logo_roles: deckLogos,
    canvases: deckCanvases,
  },
  exports: {
    html: { bundle_assets: true, snapshot_design_system_version: true },
    pdf: { render_from_html: true, snapshot_design_system_version: true },
    pptx: { native_shapes: true, snapshot_design_system_version: true, warn_on_uninstalled_fonts: true },
  },
};

export const slimThemeMigration = {
  source: 'sonaloop.theming.validate_customer_theme slim schema',
  target_spec_version: WORKSPACE_DESIGN_SYSTEM_SPEC_VERSION,
  defaults: 'All unmapped fields inherit defaultWorkspaceDesignSystem.',
  color_var_to_role: {
    '--bg': 'colors.light.paper',
    '--panel': 'colors.light.panel',
    '--sidebar': 'colors.light.sidebar',
    '--line': 'colors.light.line',
    '--ink': 'colors.light.ink',
    '--ink-2': 'colors.light.ink_2',
    '--muted': 'colors.light.muted',
    '--faint': 'colors.light.faint',
    '--accent': 'colors.light.accent',
    '--accent-ink': 'colors.light.accent_ink',
    '--accent-weak': 'colors.light.accent_weak',
    '--green': 'colors.light.green',
    '--amber': 'colors.light.amber',
    '--red': 'colors.light.red',
  },
  font_var_to_role: {
    '--sl-sans': 'typography.fonts.sans.stack',
    '--sl-mono': 'typography.fonts.mono.stack',
  },
  brand_fields: {
    name: 'brand.name',
    logo: 'brand.logo_variants.lockup.asset_ref',
  },
  notes: [
    'Slim themes did not distinguish light and dark schemes; migrated dark values inherit defaults unless supplied later.',
    'Slim logos become a primary lockup asset and should get PPTX-safe renditions during the asset-library phase.',
    'Spacing, radius, imagery, charts and deck fields inherit the Sonaloop default instance.',
  ],
};

export default defaultWorkspaceDesignSystem;
