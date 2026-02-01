import css from "./SidebarNotes.module.css"
import type { NoteTags } from "@/types/note";
import Link from "next/link";

const tags: NoteTags[] = ["Todo", "Work", "Personal", "Meeting"];

export default function SidebarNotes() {
  return (
    <>
    
    <ul className={css.menuList}>
       <li className={css.menuItem}>
        <Link href="/notes/action/create" className={css.menuLink} >Create note</Link>
       </li>
       
      <li className={css.menuItem}>
        <Link href="/notes/filter/all" className={css.menuLink}>
          All notes
        </Link>
      </li>
      
      {tags.map((tag) => (
        <li key={tag} className={css.menuItem}>
           <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
    </>
  );
}
