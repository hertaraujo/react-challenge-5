import Link from 'next/link';
import classes from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={classes.header}>
      <Link href="/">
        <img src="/logo.svg" alt="logo" />
      </Link>
    </header>
  );
}
