import { Sparkles } from 'lucide-react';
import DynamicIcon from './DynamicIcon.jsx';
import { resolveServiceLucideName } from '../utils/serviceIconNames.js';
import { cn } from '../utils/cn.js';

const monoImgClass = 'h-6 w-6 shrink-0 object-contain opacity-60 brightness-0 invert';

export default function ServiceIcon({ title, icon, className }) {
  const trimmed = icon?.trim();
  if (trimmed && /^https?:\/\//i.test(trimmed)) {
    return <img src={trimmed} alt="" className={cn(monoImgClass, className)} />;
  }

  const lucideName = resolveServiceLucideName(title, trimmed);
  if (lucideName) {
    return <DynamicIcon name={lucideName} className={cn('h-6 w-6 shrink-0', className)} />;
  }

  return <Sparkles className={cn('h-6 w-6 shrink-0', className)} aria-hidden />;
}
