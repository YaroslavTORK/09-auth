import css from "./Header.module.css";
import Link from "next/link";
import AuthNavigation from "../AuthNavigation/AuthNavigation";

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" prefetch={false}>
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/" prefetch={false}>
              Home
            </Link>
          </li> 

          <li>
            <Link href="/notes/filter/all" prefetch={false}>
              Notes
            </Link>
          </li>

          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}
