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
  title: "Pilih Menu",
  subtitle: "Putar dan pilih tujuanmu!",
  themeColor: "gold",
  soundEnabled: true,
  items: [
    {
      id: 1,
      label: "About Me",
      description: "Kenali lebih dekat tentang saya",
      url: "https://website-liminilo-ai.vercel.app/",
      iconName: "User",
      color: "#d4af37",
    },
    {
      id: 2,
      label: "Instagram",
      description: "Lihat portofolio terbaru",
      url: "https://instagram.com/liminilo",
      iconName: "Instagram",
      color: "#e1306c",
    },
    {
      id: 3,
      label: "LinkedIN",
      description: "Lihat pengalaman profesional saya",
      url: "https://www.linkedin.com/in/caesar-a-zim-riyadi-2884b4404",
      iconName: "Linkedin",
      color: "#0077b5",
    },
    {
      id: 4,
      label: "My Project",
      description: "Lihat proyek yang sudah saya kerjakan",
      url: "https://github.com",
      iconName: "Briefcase",
      color: "#4caf50",
    },
    {
      id: 5,
      label: "Whatsapp",
      description: "Kirim pesan langsung ke saya",
      url: "https://wa.me/6285758287612",
      iconName: "MessageSquare",
      color: "#25d366",
    },
    {
      id: 6,
      label: "Gmail",
      description: "Kirim email ke saya",
      url: "mailto:liminilo23@gmail.com",
      iconName: "Mail",
      color: "#ea4335",
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
    tag: "Portofolio",
    description: "Tempat Caesar menyimpan semua project dan portofolio yang telah dia buat.",
    url: "https://website-liminilo-ai.vercel.app/",
    icon: "FolderKanban"
  },
  {
    title: "Liminilo tentor Math",
    tag: "AI Education",
    description: "Guru virtual berbasis AI membantu kamu belajar dan mengerti Math",
    url: "https://liminilo-math.vercel.app/",
    icon: "GraduationCap"
  },
  {
    title: "Sejarawan Universal",
    tag: "AI History",
    description: "Berbicara secara real-time dengan semua tokoh sejarah di dunia",
    url: "https://sejarawan-universal.vercel.app/",
    icon: "BookOpen"
  }
];
