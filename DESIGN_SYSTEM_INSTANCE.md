# Workspace design-system instances

`design-system.data.mjs` is the machine-readable contract for customer-owned
workspace design systems. It exports:

- `WORKSPACE_DESIGN_SYSTEM_SPEC_VERSION`: currently `workspace_design_system.v2`.
- `workspaceDesignSystemSpec`: field policy, editable groups, roles and validation hints.
- `defaultWorkspaceDesignSystem`: the Sonaloop default instance assembled from the existing
  token, image and deck sources.
- `slimThemeMigration`: how the June slim customer-theme shape maps into v2.

The contract is data, not CSS. Cloud and core should validate a customer payload against the
role vocabulary here, merge it over `defaultWorkspaceDesignSystem`, and compile the resulting
canonical object into the surface-specific artifacts they need: CSS variables, `@font-face`
blocks, chart palettes, export bundles and PPTX deck themes.

## Boundary

Customers may edit:

- Brand metadata and logo slots.
- Light/dark color roles.
- Font roles and type scale.
- Radius, spacing, density, motion and elevation tokens within validator bounds.
- Named imagery roles and local asset references.
- Chart palette roles.
- Tokenized master-deck palette, type, logo and image slots.

Customers may not provide arbitrary CSS, JavaScript, runtime remote fonts, custom app
components, or arbitrary imported PPTX masters in this version. The deck boundary is a
tokenized instance of Sonaloop's master layout taxonomy, not a freeform slide editor.

## Migration

The previous slim schema (`colors`, `fonts`, `brand`) maps into v2 through
`slimThemeMigration`. Missing v2 fields inherit from the default Sonaloop instance, so an
existing workspace keeps its visible colors, fonts and brand while gaining default layout,
imagery, chart and deck settings.

## Consumer example

```js
import {
  WORKSPACE_DESIGN_SYSTEM_SPEC_VERSION,
  workspaceDesignSystemSpec,
  defaultWorkspaceDesignSystem,
  slimThemeMigration,
} from 'sonaloop-design/design-system';

console.log(WORKSPACE_DESIGN_SYSTEM_SPEC_VERSION);
console.log(workspaceDesignSystemSpec.groups.colors.roles);
console.log(defaultWorkspaceDesignSystem.deck.layouts.map((l) => l.key));
console.log(slimThemeMigration.color_var_to_role['--accent']);
```
