import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { WheelLinkItem, LinktreeProfile } from '../types';
import { PROJECTS_LIST, CONTACTS_LIST, SOCIAL_MEDIA_LIST } from '../config/linksConfig';

interface LinkDetailsModalProps {
  item: WheelLinkItem | null;
  profile: LinktreeProfile;
  onClose: () => void;
}

export default function LinkDetailsModal({ item, profile, onClose }: LinkDetailsModalProps) {
  if (!item) return null;

  // Render icons inside details dynamically
  const renderDetailIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName] || Icons.ExternalLink;
    
    const getAccentColor = () => {
      switch (profile.themeColor) {
        case 'emerald': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
        case 'ruby': return 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
        case 'sapphire': return 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
        case 'violet': return 'bg-violet-500/10 text-violet-400 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]';
        case 'gold':
        default:
          return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
      }
    };

    return (
      <div className={`p-4 border border-solid rounded-full ${getAccentColor()}`}>
        <IconComp size={42} className="animate-pulse" />
      </div>
    );
  };

  const getThemeButtonClass = () => {
    switch (profile.themeColor) {
      case 'emerald':
        return 'from-emerald-500 via-emerald-600 to-teal-700 shadow-[0_4px_16px_rgba(16,185,129,0.35)]';
      case 'ruby':
        return 'from-red-500 via-red-600 to-rose-700 shadow-[0_4px_16px_rgba(239,68,68,0.35)]';
      case 'sapphire':
        return 'from-blue-500 via-blue-600 to-indigo-700 shadow-[0_4px_16px_rgba(59,130,246,0.35)]';
      case 'violet':
        return 'from-violet-500 via-violet-600 to-purple-700 shadow-[0_4px_16px_rgba(139,92,246,0.35)]';
      case 'gold':
      default:
        return 'from-amber-500 via-yellow-500 to-amber-700 shadow-[0_4px_16px_rgba(245,158,11,0.35)]';
    }
  };

  const getThemeBackgroundGlowClass = () => {
    switch (profile.themeColor) {
      case 'emerald': return 'bg-emerald-500/10';
      case 'ruby': return 'bg-red-500/10';
      case 'sapphire': return 'bg-blue-500/10';
      case 'violet': return 'bg-violet-500/10';
      case 'gold':
      default:
        return 'bg-amber-500/10';
    }
  };

  const isEmail = item.url.startsWith('mailto:');
  const isWhatsapp = item.url.startsWith('https://wa.me');
  const isProjects = item.label.toLowerCase().includes('project');
  const isContacts = item.label.toLowerCase().includes('contact') || item.label.toLowerCase().includes('hubungi');
  const isSocialMedia = item.label.toLowerCase().includes('social') || item.label.toLowerCase().includes('sosial');
  const isListView = isProjects || isContacts || isSocialMedia;
  const listItems = isProjects 
    ? PROJECTS_LIST 
    : (isContacts ? CONTACTS_LIST : (isSocialMedia ? SOCIAL_MEDIA_LIST : []));
  
  const getTargetUrl = () => {
    if (isEmail) {
      const email = item.url.replace('mailto:', '');
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
    }
    return item.url;
  };

  const getButtonText = () => {
    if (isEmail) return 'Send via Gmail';
    if (isWhatsapp) return 'Send WhatsApp';
    return 'Visit Link';
  };



  return (
    <AnimatePresence>
      <div 
        id="link-details-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      >
        {/* Click outside to close wrapper */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} />

        {/* Modal Center Drawer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className={`relative w-full ${isListView ? 'max-w-md' : 'max-w-sm'} rounded-[24px] bg-gradient-to-b from-[#16191f] to-[#0e1013] border-2 border-[#242933] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-6 z-10 flex flex-col max-h-[85vh]`}
        >
          {/* Subtle Accent Glow Spotlight in Background */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 blur-[40px] pointer-events-none rounded-full ${getThemeBackgroundGlowClass()}`} />

          {/* Close button top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-100 transition-colors p-1 bg-[#1c2029] hover:bg-[#252b37] rounded-full focus:outline-none z-20"
          >
            <Icons.X size={18} />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col items-center mt-4">
            {renderDetailIcon(item.iconName)}
            
            {/* Label / Name */}
            <h3 className="mt-5 text-xl font-semibold tracking-wide text-neutral-100 font-serif text-center">
              {item.label}
            </h3>

            {/* Description detail */}
            <p className="mt-2 text-sm text-neutral-400 font-sans tracking-wide leading-relaxed text-center px-4">
              {item.description}
            </p>
          </div>

          {!isListView ? (
            <>
              {/* URL preview string for visual feedback (safeguards user trust) */}
              <div className="mt-4 px-3 py-2 bg-[#0a0c0e]/80 rounded-[12px] border border-neutral-800/60 flex items-center space-x-2 w-full overflow-hidden">
                <Icons.Link2 className="text-amber-500/80 shrink-0" size={14} />
                <span className="text-[11px] font-mono select-all text-neutral-500 truncate w-full tracking-tighter">
                  {item.url}
                </span>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-col space-y-2.5">
                <a
                  href={getTargetUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 px-5 rounded-[14px] bg-gradient-to-r ${getThemeButtonClass()} text-center font-bold font-sans tracking-wider text-[13px] text-white active:brightness-95 hover:brightness-105 transition-all flex items-center justify-center space-x-2`}
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                >
                  <span>{getButtonText()}</span>
                  <Icons.ArrowUpRight size={16} />
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-3 px-5 rounded-[14px] text-center font-medium font-sans tracking-wide text-[12px] text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/40 transition-colors"
                >
                  Spin Again
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Scrollable Showcase Box */}
              <div className="mt-5 flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar max-h-[42vh] scrollbar-thin scrollbar-thumb-neutral-800">
                {listItems.map((proj, index) => {
                  const ProjIcon = (Icons as any)[proj.icon] || Icons.Code;
                  
                  if (isContacts || isSocialMedia) {
                    return (
                      <motion.a
                        key={index}
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="group flex flex-col items-center p-5 bg-[#13161d] hover:bg-[#181c25] border border-neutral-800/60 hover:border-amber-500/30 rounded-[20px] transition-all duration-300 text-center space-y-3"
                      >
                        {/* Atas: Logo Aplikasi */}
                        <div className="p-3 bg-neutral-900/95 text-amber-400 border border-neutral-800/80 rounded-full group-hover:text-amber-300 group-hover:scale-110 transition-transform duration-300">
                          <ProjIcon size={24} />
                        </div>

                        {/* Tengah: Nama Aplikasi */}
                        <div className="flex flex-col items-center">
                          <span className="text-neutral-100 font-sans font-semibold text-sm tracking-wide group-hover:text-amber-400 transition-colors">
                            {proj.title}
                          </span>
                          {isSocialMedia && proj.tag && (
                            <span className="text-[8px] bg-amber-500/10 text-amber-400 font-mono tracking-wider px-1.5 py-0.5 mt-1 rounded border border-amber-500/10 font-bold uppercase">
                              {proj.tag}
                            </span>
                          )}
                        </div>

                        {/* Bawah: Pesan */}
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-sans px-3">
                          {proj.description}
                        </p>
                      </motion.a>
                    );
                  }

                  return (
                    <motion.a
                      key={index}
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="group flex items-center justify-between p-3 bg-[#13161d] hover:bg-[#181c25] border border-neutral-800/60 hover:border-amber-500/30 rounded-[16px] transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3 min-w-0 mr-3">
                        <div className="p-2.5 bg-neutral-900/95 text-amber-400 border border-neutral-800/80 rounded-[12px] shrink-0 group-hover:text-amber-300">
                          <ProjIcon size={18} />
                        </div>
                        <div className="text-left min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="text-neutral-100 font-sans font-medium text-xs tracking-wide group-hover:text-amber-400 transition-colors truncate max-w-[150px]">
                              {proj.title}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 line-clamp-2 mt-0.5 leading-relaxed font-sans pr-1">
                            {proj.description}
                          </p>
                        </div>
                      </div>
                      <div className="p-1.5 bg-neutral-900 group-hover:bg-amber-500 group-hover:text-neutral-950 rounded-full text-neutral-400 transition-all border border-neutral-800/50 group-hover:border-transparent group-hover:scale-110 shrink-0">
                        <Icons.ArrowUpRight size={14} />
                      </div>
                    </motion.a>
                  );
                })}
              </div>

              {/* Dismiss footer button */}
              <div className="mt-5 pt-3 border-t border-[#242933]">
                <button
                  onClick={onClose}
                  className="w-full py-3 px-5 rounded-[14px] text-center font-medium font-sans tracking-wide text-[12px] text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/40 transition-colors"
                >
                  Spin Again
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
