/**
 * sonaloop-design — FacetBar (always-visible faceted filtering).
 *
 * Chip rows per facet group, every option on the page with its live count: the host owns
 * the semantics (OR within a group, AND across groups) and the counting — the bar is purely
 * presentational (selection in, toggles out). Open-ended groups collapse past `collapseAt`
 * behind a "+N more" expander (selected values stay visible while collapsed); a
 * "Clear filters" action appears once anything is selected. Distinct from FilterBar
 * (components.tsx), whose facets live behind a "+ Filter" menu.
 * Styled by the `.sl-facet-*` classes (styles/components.css).
 */
import { useState } from 'react';
import type { HTMLAttributes } from 'react';

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

export interface FacetOption {
  value: string;
  /** Display text — defaults to the value. */
  label?: string;
  /** Live count of matches under the current selection. */
  count?: number;
}
export interface FacetGroup {
  key: string;
  label: string;
  options: FacetOption[];
}
export interface FacetBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  groups: FacetGroup[];
  /** Selected option values per group key. */
  selected: Record<string, string[]>;
  onToggle: (key: string, value: string) => void;
  /** Clear the whole selection — the "Clear filters" action only renders when this is set
   *  AND something is selected. */
  onClear?: () => void;
  /** Options shown per group before the "+N more" expander. Default 14. */
  collapseAt?: number;
}

function FacetGroupRow({
  group, selected, collapseAt, onToggle,
}: { group: FacetGroup; selected: string[]; collapseAt: number; onToggle: (value: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const overflow = group.options.length > collapseAt;
  const visible = expanded || !overflow
    ? group.options
    : group.options.filter((o, i) => i < collapseAt || selected.includes(o.value));
  return (
    <div className="sl-facet-group">
      <span className="sl-facet-group__label">{group.label}</span>
      <div className="sl-facet-group__chips">
        {visible.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              className={cx('sl-facet-chip', active && 'is-active')}
              aria-pressed={active}
              onClick={() => onToggle(o.value)}
            >
              {o.label ?? o.value}
              {o.count != null && <span className="sl-facet-chip__count">{o.count}</span>}
            </button>
          );
        })}
        {overflow && (
          <button type="button" className="sl-facet-more" onClick={() => setExpanded((e) => !e)}>
            {expanded ? 'less' : `+${group.options.length - collapseAt} more`}
          </button>
        )}
      </div>
    </div>
  );
}

/** Always-visible facet chip rows with live counts — OR within a group, AND across groups. */
export function FacetBar({ groups, selected, onToggle, onClear, collapseAt = 14, className, ...rest }: FacetBarProps) {
  const active = Object.values(selected).some((v) => v && v.length > 0);
  return (
    <div className={cx('sl-facet-bar', className)} {...rest}>
      {groups.map((g) => (
        <FacetGroupRow
          key={g.key}
          group={g}
          selected={selected[g.key] ?? []}
          collapseAt={collapseAt}
          onToggle={(v) => onToggle(g.key, v)}
        />
      ))}
      {active && onClear && (
        <button type="button" className="sl-facet-clear" onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  );
}
