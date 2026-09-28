import Container from '../components/Container.jsx';
import { Link } from 'react-router-dom';
import SocialLinks, { resolveSocialLinks } from '../components/SocialLinks.jsx';
import { useSiteContent } from '../hooks/useSiteContent.jsx';

export default function Footer() {
  const { content } = useSiteContent();
  const links = resolveSocialLinks(content);

  return (
    <footer className="px-4 pb-6 pt-4 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] px-6 py-12 shadow-glass backdrop-blur-2xl sm:px-12">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[32rem] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />

        <Container className="relative flex flex-col items-center gap-8 text-center">
          <div>
            <Link to="/" className="shrink-0">
              <img
                src="/logo.png"
                alt={content?.site_title || 'Portfolio'}
                className="h-14 w-auto object-contain"
              />
            </Link>
          </div>


          <SocialLinks
            links={links}
            iconClassName="h-9 w-9 border-white/10 bg-white/5 text-ink/50 hover:border-primary-400/40"
          />

          <p className="text-xs text-ink/40">
            &copy; {new Date().getFullYear()} {content?.site_title || 'Portfolio'}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
