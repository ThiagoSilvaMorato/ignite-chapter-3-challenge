import Link from 'next/link';

export default function Header(): JSX.Element {
  return (
    <header>
      <div>
        <nav>
          <Link href="/">
            <img src="/img/logo.svg" alt="logo" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
