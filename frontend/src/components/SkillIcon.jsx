import { Sparkles } from 'lucide-react';
import DynamicIcon from './DynamicIcon.jsx';
import { resolveTechIconSlug, techIconUrl } from '../utils/techIconSlugs.js';
import { cn } from '../utils/cn.js';

/** Monochrome treatment for custom image URLs (matches neutral Simple Icons CDN color). */
const monoImgClass = 'h-4 w-4 shrink-0 object-contain opacity-60 brightness-0 invert';

/**
 * Skill row icon: brand logo (Simple Icons CDN) when name/icon matches a tech,
 * custom image URL, Lucide name, or sparkle fallback.
 */
export default function SkillIcon({ name, icon, className }) {
  const trimmed = icon?.trim();
  if (trimmed && /^https?:\/\//i.test(trimmed)) {
    return <img src={trimmed} alt="" className={cn(monoImgClass, className)} />;
  }

  const slug = resolveTechIconSlug(name, trimmed);
  if (slug) {
    return (
      <img
        src={techIconUrl(slug)}
        alt=""
        className={cn('h-4 w-4 shrink-0 object-contain opacity-90', className)}
        loading="lazy"
      />
    );
  }

  if (trimmed) {
    return <DynamicIcon name={trimmed} className={className} />;
  }

  return <Sparkles className={cn('h-4 w-4 shrink-0', className)} aria-hidden />;
}
