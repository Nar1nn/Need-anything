export interface WheelLinkItem {
  id: number;
  label: string;
  description: string;
  url: string;
  iconName: string; // lucide icon name
  color: string; // custom segment highlights or icon colors
}

export interface LinktreeProfile {
  name: string;
  bio: string;
  avatarUrl: string;
  title: string;
  subtitle: string;
  items: WheelLinkItem[];
  themeColor: 'gold' | 'emerald' | 'ruby' | 'sapphire' | 'violet';
  soundEnabled: boolean;
}

export type IconType = 'User' | 'Instagram' | 'Linkedin' | 'Briefcase' | 'MessageSquare' | 'Mail' | 'ExternalLink' | 'Gamepad' | 'Music' | 'Github';
