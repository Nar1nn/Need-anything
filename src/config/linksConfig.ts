import { LinktreeProfile } from '../types';

/**
 * CONFIGURATION GUIDE FOR MAINTENANCE & ADDONS:
 * 
 * 1. EDITING MAIN SOCIAL LINKS:
 *    To edit or add a link on the spinning wheel, simply modify the `items` array under `DEFAULT_PROFILE` below.
 *    - `id`: Must be a unique number.
 *    - `label`: Name of the button/segment.
 *    - `description`: Subtext displayed on selection.
 *    - `url`: Destination URL (for email use `mailto:`, for WhatsApp use `https://wa.me/...`).
 *    - `iconName`: Must match a Lucide Icon name (e.g., 'User', 'Instagram', 'Mail', 'Briefcase', etc.).
 *    - `color`: Custom color hex code for styling.
 * 
 * 2. EDITING 'MY PROJECT' ITEMS:
 *    To edit or add projects showing up in the project modal, modify the `PROJECTS_LIST` array below.
 *    - `title`: The major heading of the project.
 *    - `tag`: A small categorized label (e.g., 'AI', 'Web Application', 'Robotics').
 *    - `description`: Brief tagline of what the project does.
 *    - `url`: Destination link for the project.
 *    - `icon`: Must match a Lucide Icon name (e.g., 'Code', 'GraduationCap', 'BookOpen', 'Cpu', 'Bot', etc.).
 * 
 * 3. EXPORTING/IMPORTING:
 *    Any edits made here will immediately reflect upon hot-reload and build.
 */

export const DEFAULT_PROFILE: LinktreeProfile = {
  name: "Caesar AR",
  bio: "Turning Big Dreams Into Reality",
  avatarUrl: "/Caesar.jpg",
  title: "Choose Menu",
  subtitle: "Spin and choose your destination!",
  themeColor: "gold",
  soundEnabled: true,
  items: [
    {
      id: 1,
      label: "About Me",
      description: "Get to know me better",
      url: "https://website-liminilo-ai.vercel.app/",
      iconName: "User",
      color: "#d4af37",
    },
    {
      id: 2,
      label: "Social Media",
      description: "Follow my social media and professional networks",
      url: "social_media",
      iconName: "Globe",
      color: "#3f51b5",
    },
    {
      id: 3,
      label: "My Project",
      description: "View the projects I have worked on",
      url: "my_projects",
      iconName: "Briefcase",
      color: "#4caf50",
    },
    {
      id: 4,
      label: "Contact Me",
      description: "Contact me directly via WhatsApp or Gmail",
      url: "contact_me",
      iconName: "MessageSquare",
      color: "#ff9800",
    },
  ],
};

export interface ProjectItem {
  title: string;
  tag: string;
  description: string;
  url: string;
  icon: string;
}

export const PROJECTS_LIST: ProjectItem[] = [
  {
    title: "Full Portofolio",
    tag: "Portfolio",
    description: "A place where Caesar stores all projects and portfolio he has created.",
    url: "https://website-liminilo-ai.vercel.app/",
    icon: "FolderKanban"
  }
];

export const SOCIAL_MEDIA_LIST: ProjectItem[] = [
  {
    title: "LinkedIn",
    tag: "Professional",
    description: "Connect on professional networks and find my career history.",
    url: "https://www.linkedin.com/in/caesar-a-zim-riyadi-2884b4404",
    icon: "Linkedin"
  },
  {
    title: "Instagram",
    tag: "Social",
    description: "View my latest portfolio and daily activities on Instagram.",
    url: "https://instagram.com/liminilo",
    icon: "Instagram"
  },
  {
    title: "TikTok",
    tag: "Social",
    description: "Watch my videos and creative content on TikTok.",
    url: "https://www.tiktok.com/@liminilo119?is_from_webapp=1&sender_device=pc",
    icon: "Video"
  }
];

export const CONTACTS_LIST: ProjectItem[] = [
  {
    title: "WhatsApp",
    tag: "Chat",
    description: "Send me a message for building your ideas into reality or for collaboration",
    url: "https://wa.me/6285758287612",
    icon: "MessageSquare"
  },
  {
    title: "Gmail",
    tag: "Email",
    description: "Send me an email for building your ideas into reality or for collaboration",
    url: "https://mail.google.com/mail/?view=cm&fs=1&to=liminilo23@gmail.com",
    icon: "Mail"
  }
];
