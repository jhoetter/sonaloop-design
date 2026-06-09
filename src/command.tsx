/**
 * sonaloop-design — Command palette (⌘K) + the link adapter it rides on.
 *
 * The ONE ⌘K implementation, shared by every surface: the marketing site (via
 * sonaloop-design/website, which re-exports it), the app shell consumers (via
 * sonaloop-design/components), and the docs gallery. It lives in its own module —
 * NOT in website.tsx — so importing it never drags the marketing image canvases
 * that website.tsx pulls in at module load. Styling is the shared `.sl-cmdk` layer
 * (styles/components.css); the Python-SSR app ships its own ⌘K over the same classes.
 *
 * Data is prop-driven: pass static `groups` (nav commands), and optionally an async
 * `onSearch` for server-backed results. The host owns open state so it can wire its own
 * trigger; `hotkey` (default true) binds ⌘K / Ctrl-K to toggle it. Navigation is injected
 * via the Link adapter: items default to a plain <a>, a router app wraps once with
 * <SonaloopLinkProvider> for client-side `to` navigation.
 */
import { createContext, Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AnchorHTMLAttributes, KeyboardEvent as ReactKeyboardEvent, Ref, ReactNode } from 'react';
import { Icon, type IconKey } from './website-icons';

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

/* ── Link adapter ──────────────────────────────────────────────────────────────────────────
   Internal links render through the injected component, so a react-router app gets client-side
   navigation while the docs site / SSR fall back to a plain anchor. */
export type LinkProps = { to: string; children?: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;
export type LinkComponent = (props: LinkProps) => ReactNode;

const DefaultLink: LinkComponent = ({ to, ...rest }) => <a href={to} {...rest} />;
const LinkContext = createContext<LinkComponent>(DefaultLink);
export const SonaloopLinkProvider = LinkContext.Provider;
export const useLink = () => useContext(LinkContext);

export function L(props: LinkProps) {
  const Link = useLink();
  return <Link {...props} />;
}

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export type CommandItem = {
  title: string;
  subtitle?: string;
  /** Internal route — navigated through the injected Link adapter (client-side in a router app). */
  to?: string;
  /** External link — opens in a new tab. */
  href?: string;
  /** A pure action (no navigation). Takes priority over `to`/`href`. */
  onSelect?: () => void;
  icon?: IconKey;
  /** Extra text matched by the built-in client-side filter, beyond the title. */
  keywords?: string;
};
export type CommandGroup = {
  key: string;
  label: string;
  /** Optional CSS colour for this group's item icons (the Linear/Raycast type tint). */
  accent?: string;
  items: CommandItem[];
};

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: CommandGroup[];
  /** Server-backed results for the current query. Merged after the client-filtered static groups. */
  onSearch?: (query: string) => CommandGroup[] | Promise<CommandGroup[]>;
  placeholder?: string;
  emptyMessage?: string;
  /** Bind ⌘K / Ctrl-K globally to toggle the palette. Default true. */
  hotkey?: boolean;
  /** Show the footer hint bar. Default true. */
  footer?: boolean;
}

/** A reusable button that opens the palette: search glyph · label · ⌘K hint. Drop it in a navbar. */
export function CommandTrigger({ onClick, label = 'Search', className }: { onClick: () => void; label?: string; className?: string }) {
  return (
    <button type="button" className={cx('sl-cmdk-trigger', className)} onClick={onClick} aria-label={label}>
      <SearchGlyph className="sl-cmdk-trigger-ico" />
      <span>{label}</span>
      <kbd className="sl-kbd">⌘K</kbd>
    </button>
  );
}

function CommandFooter() {
  return (
    <div className="sl-cmdk-foot">
      <span><kbd className="sl-kbd">↑↓</kbd>Navigate</span>
      <span><kbd className="sl-kbd">↵</kbd>Open</span>
      <span><kbd className="sl-kbd">esc</kbd>Close</span>
    </div>
  );
}

function filterCommandGroups(groups: CommandGroup[], query: string): CommandGroup[] {
  const q = query.toLowerCase();
  return groups
    .map((g) => ({ ...g, items: g.items.filter((it) => it.title.toLowerCase().includes(q) || (it.keywords?.toLowerCase().includes(q) ?? false)) }))
    .filter((g) => g.items.length > 0);
}

type PanelRow =
  | { kind: 'sec'; key: string; label: string }
  | { kind: 'item'; key: string; item: CommandItem; accent?: string; i: number };

function toRows(groups: CommandGroup[]): PanelRow[] {
  const rows: PanelRow[] = [];
  let i = 0;
  for (const g of groups) {
    if (!g.items.length) continue;
    rows.push({ kind: 'sec', key: `sec-${g.key}`, label: g.label });
    for (const item of g.items) {
      rows.push({ kind: 'item', key: `${g.key}-${i}`, item, accent: g.accent, i });
      i += 1;
    }
  }
  return rows;
}

interface PanelProps {
  groups: CommandGroup[];
  query?: string;
  onQueryChange?: (q: string) => void;
  selectedIndex?: number;
  onHover?: (i: number) => void;
  onSelect?: () => void;
  placeholder?: string;
  emptyMessage?: string;
  footer?: boolean;
  inline?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  listRef?: Ref<HTMLDivElement>;
}

/** The palette's presentational surface (input · grouped list · footer). Exported so it can be
    embedded inline (docs preview, an inline search box) without the full-screen overlay. */
export function CommandPalettePanel({
  groups,
  query = '',
  onQueryChange,
  selectedIndex = 0,
  onHover,
  onSelect,
  placeholder = 'Search…',
  emptyMessage = 'No results.',
  footer = true,
  inline = false,
  inputRef,
  listRef,
}: PanelProps) {
  const rows = useMemo(() => toRows(groups), [groups]);
  const empty = rows.length === 0;

  const renderItem = (row: Extract<PanelRow, { kind: 'item' }>) => {
    const { item, accent, i } = row;
    const className = cx('sl-cmdk-item', i === selectedIndex && 'is-active');
    const ico = (
      <span className="sl-cmdk-ico" style={accent ? { color: accent } : undefined}>
        {item.icon ? <Icon name={item.icon} size={18} /> : null}
      </span>
    );
    const body = (
      <>
        {ico}
        <span className="sl-cmdk-title">{item.title}</span>
        {item.subtitle ? <span className="sl-cmdk-sub">{item.subtitle}</span> : null}
      </>
    );
    const onClick = () => {
      item.onSelect?.();
      onSelect?.();
    };
    const onMouseMove = () => onHover?.(i);
    if (item.onSelect) return <button key={row.key} type="button" className={className} onClick={onClick} onMouseMove={onMouseMove}>{body}</button>;
    if (item.to) return <L key={row.key} to={item.to} className={className} onClick={onClick} onMouseMove={onMouseMove}>{body}</L>;
    if (item.href) return <a key={row.key} href={item.href} target="_blank" rel="noreferrer" className={className} onClick={onClick} onMouseMove={onMouseMove}>{body}</a>;
    return <button key={row.key} type="button" className={className} onClick={onClick} onMouseMove={onMouseMove}>{body}</button>;
  };

  return (
    <div className={cx('sl-cmdk-panel', inline && 'sl-cmdk-panel--inline')} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="sl-cmdk-head">
        <SearchGlyph className="sl-cmdk-head-ico" />
        <input
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- refs cross a dual @types/react boundary (DS source consumed by apps with their own react types)
          ref={inputRef as any}
          className="sl-cmdk-input"
          type="text"
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          aria-label={placeholder}
        />
      </div>
      <div className="sl-cmdk-list" ref={listRef as any}>
        {empty ? (
          <div className="sl-cmdk-empty">{emptyMessage}</div>
        ) : (
          rows.map((row) => (row.kind === 'sec'
            ? <div key={row.key} className="sl-cmdk-sec">{row.label}</div>
            : <Fragment key={row.key}>{renderItem(row)}</Fragment>))
        )}
      </div>
      {footer ? <CommandFooter /> : null}
    </div>
  );
}

export function CommandPalette({
  open,
  onOpenChange,
  groups,
  onSearch,
  placeholder = 'Search…',
  emptyMessage = 'No results.',
  hotkey = true,
  footer = true,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const [asyncGroups, setAsyncGroups] = useState<CommandGroup[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ⌘K / Ctrl-K toggles the palette.
  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey, open, onOpenChange]);

  // Reset + focus each time it opens.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setAsyncGroups(null);
    setSel(0);
    inputRef.current?.focus();
  }, [open]);

  const q = query.trim();
  const staticVisible = useMemo(() => (q ? filterCommandGroups(groups, q) : groups), [groups, q]);

  // Debounced server search, merged after the client-filtered static groups.
  useEffect(() => {
    if (!onSearch) return;
    if (!q) {
      setAsyncGroups(null);
      return;
    }
    let live = true;
    const timer = setTimeout(async () => {
      try {
        const r = await onSearch(q);
        if (live) setAsyncGroups(r);
      } catch {
        if (live) setAsyncGroups(null);
      }
    }, 120);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [q, onSearch]);

  const visible = useMemo(() => (asyncGroups ? [...staticVisible, ...asyncGroups] : staticVisible), [staticVisible, asyncGroups]);
  const flatCount = useMemo(() => visible.reduce((n, g) => n + g.items.length, 0), [visible]);

  // Snap selection back to the top whenever the result set changes.
  useEffect(() => { setSel(0); }, [visible]);

  // Keep the active row in view.
  useEffect(() => {
    listRef.current?.querySelectorAll('.sl-cmdk-item')[sel]?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  if (!open) return null;

  const close = () => onOpenChange(false);
  const move = (d: number) => {
    if (!flatCount) return;
    setSel((s) => (s + d + flatCount) % flatCount);
  };
  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); (listRef.current?.querySelectorAll('.sl-cmdk-item')[sel] as HTMLElement | undefined)?.click(); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  };

  return (
    <div className="sl-cmdk" onKeyDown={onKeyDown}>
      <div className="sl-cmdk-backdrop" onClick={close} />
      <CommandPalettePanel
        groups={visible}
        query={query}
        onQueryChange={setQuery}
        selectedIndex={sel}
        onHover={setSel}
        onSelect={close}
        placeholder={placeholder}
        emptyMessage={emptyMessage}
        footer={footer}
        inputRef={inputRef}
        listRef={listRef}
      />
    </div>
  );
}
