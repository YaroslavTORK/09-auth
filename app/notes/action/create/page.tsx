import css from "./CreateNote.module.css"
import  { Note_Tags } from "@/types/note";
import  NoteForm  from "@/components/NoteForm/NoteForm"
import type { Metadata } from "next";

const title = "Create note — NoteHub";
const description = "Create a new note and organize it with tags.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://notehub.com/notes/action/create",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Create note — NoteHub",
      },
    ],
    type: "article",
  },
};
export default function CreateNote () {
     return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>

        <NoteForm categories={Note_Tags} />
      </div>
    </main>
  );
};
