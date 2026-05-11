import { useEffect, useState } from 'preact/hooks';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Snippets', href: '/snippets/' },
] as const;

interface Props {
  currentPath: string;
}

export default function Nav({ currentPath }: Props) {
  const [pathname, setPathname] = useState(currentPath);

  useEffect(() => {
    const handlePageLoad = () => setPathname(window.location.pathname);
    document.addEventListener('astro:page-load', handlePageLoad);
    return () =>
      document.removeEventListener('astro:page-load', handlePageLoad);
  }, []);

  return (
    <nav role="navigation" tabIndex={-1}>
      <ul>
        {NAV_ITEMS.map(({ label, href }) => {
          const isCurrent =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href}>
              <a href={href} aria-current={isCurrent ? 'page' : undefined}>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
