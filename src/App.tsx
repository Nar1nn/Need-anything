import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StarParticleBg from './components/StarParticleBg';
import ProfileCard from './components/ProfileCard';
import Wheel from './components/Wheel';
import LinkDetailsModal from './components/LinkDetailsModal';
import { LinktreeProfile, WheelLinkItem } from './types';
import { decompressProfile } from './utils/helpers';
import { DEFAULT_PROFILE } from './config/linksConfig';

export default function App() {
  const [profile, setProfile] = useState<LinktreeProfile>(DEFAULT_PROFILE);
  const [selectedItem, setSelectedItem] = useState<WheelLinkItem | null>(null);

  // Initialize and listen to URL hash changes for dynamic share links reloading
  useEffect(() => {
    function loadProfileFromUrlOrLocal() {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#data=')) {
        const payload = hash.substring(6);
        const decompressed = decompressProfile(payload);
        if (decompressed) {
          setProfile(decompressed);
          return;
        }
      }

      // Fallback: check localStorage
      try {
        const local = localStorage.getItem('interactive_wheel_profile');
        if (local) {
          const parsed = JSON.parse(local) as LinktreeProfile;
          if (parsed && parsed.name && Array.isArray(parsed.items)) {
            let changed = false;
            // Auto-migrate older avatars to the new uploaded Caesar.jpg portrait
            if (
              parsed.avatarUrl === "/src/assets/images/jae_avatar_1779260795947.png" ||
              parsed.avatarUrl === "/src/assets/images/jae_formal_avatar_1779262496854.png" ||
              parsed.avatarUrl === "/src/assets/images/jae_cool_bw_portrait_1779262653434.png"
            ) {
              parsed.avatarUrl = "/src/assets/images/Caesar.jpg";
              changed = true;
            }
            if (parsed.name === "Jae") {
              parsed.name = "Caesar AR";
              changed = true;
            }
            if (parsed.bio === "A man for adventure") {
              parsed.bio = "Turning Big Dreams Into Reality";
              changed = true;
            }
            
            // Auto-migrate default placeholder URLs
            if (Array.isArray(parsed.items)) {
              parsed.items = parsed.items.map(item => {
                if (item.label === "About Me" && item.url === "https://github.com") {
                  item.url = "https://website-liminilo-ai.vercel.app/";
                  changed = true;
                }
                if (item.label === "Instagram" && (item.url === "https://instagram.com" || item.url === "https://instagram.com/jae")) {
                  item.url = "https://instagram.com/liminilo";
                  changed = true;
                }
                if (item.label === "LinkedIN" && (item.url === "https://linkedin.com" || item.url === "https://www.linkedin.com/in/jae")) {
                  item.url = "https://www.linkedin.com/in/caesar-a-zim-riyadi-2884b4404";
                  changed = true;
                }
                if (item.label === "Whatsapp" && (item.url === "https://wa.me/628123456789" || item.url === "https://wa.me/628123456")) {
                  item.url = "https://wa.me/6285758287612";
                  changed = true;
                }
                if (item.label === "Gmail" && (item.url === "mailto:caesar@gmail.com" || item.url === "mailto:jae@gmail.com")) {
                  item.url = "mailto:liminilo23@gmail.com";
                  changed = true;
                }
                return item;
              });
            }

            if (changed) {
              try {
                localStorage.setItem('interactive_wheel_profile', JSON.stringify(parsed));
              } catch (_) {}
            }
            setProfile(parsed);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to parse localStorage profile:', err);
      }

      // Standard default profile
      setProfile(DEFAULT_PROFILE);
    }

    loadProfileFromUrlOrLocal();

    window.addEventListener('hashchange', loadProfileFromUrlOrLocal);
    return () => {
      window.removeEventListener('hashchange', loadProfileFromUrlOrLocal);
    };
  }, []);

  const handleProfileReset = () => {
    // Clear URL hash & local representation
    window.location.hash = '';
    localStorage.removeItem('interactive_wheel_profile');
    setProfile(DEFAULT_PROFILE);
  };

  const getThemeTextClass = () => {
    switch (profile.themeColor) {
      case 'emerald': return 'text-emerald-400';
      case 'ruby': return 'text-red-400';
      case 'sapphire': return 'text-blue-400';
      case 'violet': return 'text-violet-400';
      case 'gold':
      default:
        return 'text-amber-500/80';
    }
  };

  return (
    <div id="full-viewport-container" className="relative min-h-screen overflow-x-hidden text-neutral-100 flex flex-col justify-between font-sans">
      {/* 1. Starry Night Atmospheric Background */}
      <StarParticleBg />

      {/* 2. Main Center Smartphone Column Mockup Card */}
      <main
        id="device-viewport-frame"
        className="relative w-full max-w-[450px] min-h-screen mx-auto flex flex-col justify-between px-4 py-8 z-10"
      >
        {/* Profile Details Header Block */}
        <ProfileCard profile={profile} />

        {/* Dynamic Physics Spinning Wheel */}
        <Wheel
          profile={profile}
          onSelect={(item) => setSelectedItem(item)}
          selectedItem={selectedItem}
        />

        {/* Footer Text "BUILDING THE FUTURE... ✦" */}
        <footer id="screenshot-footer-citation" className="flex flex-col items-center justify-center text-center py-4 select-none">
          <div className="flex items-center space-x-1.5 tracking-[0.22em] text-[10px] uppercase font-mono font-medium text-neutral-400">
            <span>Building The Future...</span>
            <span className="text-amber-400 animate-pulse font-sans">✦</span>
          </div>
          
          <span className="text-[9px] font-mono text-neutral-600 mt-1.5 tracking-wider">
            Humanoid Robotics • AI • Innovation
          </span>
        </footer>
      </main>

      {/* 4. Link detail popup overlay card */}
      <AnimatePresence>
        {selectedItem && (
          <LinkDetailsModal
            item={selectedItem}
            profile={profile}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
