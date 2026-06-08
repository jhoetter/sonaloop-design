/**
 * sonaloop-design/website — icon registry.
 *
 * Marketing content references icons by a stable string key (`IconKey`); this map resolves the
 * key to a shared hi-fi icon component. Keeps content/data files free of component imports and
 * gives every page one consistent icon vocabulary. Lifted from the website so the website blocks
 * (mega-menu, cards, rails) and the website's own content registry share one source.
 */
import type { ComponentType } from 'react';
import {
  SonaloopHifi,
  SonaloopCloudHifi,
  SonaloopResearchHifi,
  CouncilsHifi,
  PersonasHifi,
  MemoryHifi,
  ExchangeHifi,
  PanelHifi,
  CompassHifi,
  CheckHifi,
  SettingsHifi,
  AnalyticsHifi,
  TargetHifi,
  SearchHifi,
  BulbHifi,
  PlanHifi,
  OverviewHifi,
  JtbdHifi,
  PricingResearchHifi,
  PositioningHifi,
  DesignThinkingHmwHifi,
  ContinuousDiscoveryHifi,
  PressureTestHifi,
} from './index';

export type IconKey =
  | 'open-core'
  | 'cloud'
  | 'research'
  | 'councils'
  | 'personas'
  | 'memory'
  | 'exchange'
  | 'panel'
  | 'compass'
  | 'check'
  | 'settings'
  | 'analytics'
  | 'target'
  | 'search'
  | 'bulb'
  | 'plan'
  | 'overview'
  | 'jtbd'
  | 'pricing-research'
  | 'positioning'
  | 'design-thinking-hmw'
  | 'continuous-discovery'
  | 'pressure-test';

type HifiComponent = ComponentType<{ size?: number | string; className?: string; animate?: boolean }>;

const MAP: Record<IconKey, HifiComponent> = {
  'open-core': SonaloopHifi,
  cloud: SonaloopCloudHifi,
  research: SonaloopResearchHifi,
  councils: CouncilsHifi,
  personas: PersonasHifi,
  memory: MemoryHifi,
  exchange: ExchangeHifi,
  panel: PanelHifi,
  compass: CompassHifi,
  check: CheckHifi,
  settings: SettingsHifi,
  analytics: AnalyticsHifi,
  target: TargetHifi,
  search: SearchHifi,
  bulb: BulbHifi,
  plan: PlanHifi,
  overview: OverviewHifi,
  jtbd: JtbdHifi,
  'pricing-research': PricingResearchHifi,
  positioning: PositioningHifi,
  'design-thinking-hmw': DesignThinkingHmwHifi,
  'continuous-discovery': ContinuousDiscoveryHifi,
  'pressure-test': PressureTestHifi,
};

export type IconProps = { name: IconKey; size?: number; className?: string; animate?: boolean };

export function Icon({ name, size = 40, className, animate }: IconProps) {
  const Cmp = MAP[name];
  return Cmp ? <Cmp size={size} className={className} animate={animate} /> : null;
}
