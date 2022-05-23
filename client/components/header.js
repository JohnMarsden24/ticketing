import Link from 'next/link';

export default function Header({ currentUser }) {
  const links = [
    ...(!currentUser ? [{ label: 'Sign up', href: '/auth/sign-up' }] : []),
    ...(!currentUser ? [{ label: 'Sign in', href: '/auth/sign-in' }] : []),
    ...(currentUser ? [{ label: 'Sign out', href: '/auth/sign-out' }] : []),
  ];

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links.map(({ label, href }) => (
            <li key={href} className="nav-item">
              <Link href={href}>
                <a className="nav-link">{label}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
