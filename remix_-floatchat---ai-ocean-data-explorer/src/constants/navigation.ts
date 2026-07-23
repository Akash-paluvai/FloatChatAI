import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  path: string;
  badge?: string;
  isExternal?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'Demo', path: ROUTES.DEMO },
  { label: 'Dashboard', path: ROUTES.DASHBOARD },
  { label: 'Docs', path: ROUTES.DOCS },
  { label: 'About', path: ROUTES.ABOUT },
  { label: 'Status', path: ROUTES.STATUS, badge: 'v1.0' },
];

export const FOOTER_LINKS = {
  product: [
    { label: 'Explore Demo', path: ROUTES.DEMO },
    { label: 'Analytics Dashboard', path: ROUTES.DASHBOARD },
    { label: 'Documentation', path: ROUTES.DOCS },
    { label: 'System Status', path: ROUTES.STATUS },
  ],
  company: [
    { label: 'About Mission', path: ROUTES.ABOUT },
    { label: 'ARGO Research', path: '/docs#research' },
    { label: 'Architecture', path: '/docs#architecture' },
  ],
  legal: [
    { label: 'Open Data License', path: '#' },
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Service', path: '#' },
  ],
};
