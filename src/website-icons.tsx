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
  SonaloopDataHifi,
  SonaloopWebsiteHifi,
  SonaloopDesignHifi,
  SonafileHifi,
  SonatileHifi,
  SonameshHifi,
  SonamillHifi,
  SonapageHifi,
  SonaseedHifi,
  SonataskHifi,
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
  // newer feature + chrome vocabulary
  SoulHifi,
  SentimentHifi,
  QuoteHifi,
  ChatHifi,
  MicHifi,
  SparklesHifi,
  NetworkHifi,
  AvatarHifi,
  CalendarHifi,
  ActivityHifi,
  InboxHifi,
  PackageHifi,
  VerifiedHifi,
  ShieldHifi,
  ShieldCheckHifi,
  LockHifi,
  KeyHifi,
  GlobeHifi,
  TerminalHifi,
  CommandHifi,
  DatabaseHifi,
  CreditCardHifi,
  MailHifi,
  BellHifi,
  BookHifi,
  RocketHifi,
  TrendHifi,
  PieChartHifi,
} from './index';

export type IconKey =
  | 'open-core'
  | 'cloud'
  | 'research'
  | 'data'
  | 'website'
  | 'design'
  | 'sonafile'
  | 'sonatile'
  | 'sonamesh'
  | 'sonamill'
  | 'sonapage'
  | 'sonaseed'
  | 'sonatask'
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
  | 'pressure-test'
  | 'soul'
  | 'sentiment'
  | 'quote'
  | 'chat'
  | 'mic'
  | 'sparkles'
  | 'network'
  | 'avatar'
  | 'calendar'
  | 'activity'
  | 'inbox'
  | 'package'
  | 'verified'
  | 'shield'
  | 'shield-check'
  | 'lock'
  | 'key'
  | 'globe'
  | 'terminal'
  | 'command'
  | 'database'
  | 'credit-card'
  | 'mail'
  | 'bell'
  | 'book'
  | 'rocket'
  | 'trend'
  | 'pie-chart';

type HifiComponent = ComponentType<{ size?: number | string; className?: string; animate?: boolean }>;

const MAP: Record<IconKey, HifiComponent> = {
  'open-core': SonaloopHifi,
  cloud: SonaloopCloudHifi,
  research: SonaloopResearchHifi,
  data: SonaloopDataHifi,
  website: SonaloopWebsiteHifi,
  design: SonaloopDesignHifi,
  sonafile: SonafileHifi,
  sonatile: SonatileHifi,
  sonamesh: SonameshHifi,
  sonamill: SonamillHifi,
  sonapage: SonapageHifi,
  sonaseed: SonaseedHifi,
  sonatask: SonataskHifi,
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
  soul: SoulHifi,
  sentiment: SentimentHifi,
  quote: QuoteHifi,
  chat: ChatHifi,
  mic: MicHifi,
  sparkles: SparklesHifi,
  network: NetworkHifi,
  avatar: AvatarHifi,
  calendar: CalendarHifi,
  activity: ActivityHifi,
  inbox: InboxHifi,
  package: PackageHifi,
  verified: VerifiedHifi,
  shield: ShieldHifi,
  'shield-check': ShieldCheckHifi,
  lock: LockHifi,
  key: KeyHifi,
  globe: GlobeHifi,
  terminal: TerminalHifi,
  command: CommandHifi,
  database: DatabaseHifi,
  'credit-card': CreditCardHifi,
  mail: MailHifi,
  bell: BellHifi,
  book: BookHifi,
  rocket: RocketHifi,
  trend: TrendHifi,
  'pie-chart': PieChartHifi,
};

export type IconProps = { name: IconKey; size?: number; className?: string; animate?: boolean };

export function Icon({ name, size = 40, className, animate }: IconProps) {
  const Cmp = MAP[name];
  return Cmp ? <Cmp size={size} className={className} animate={animate} /> : null;
}
