"use client";
import css from "./NotePreview.module.css";
import Modal from "@/components/Modal/Modal";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";

export default function NotePreviewClient() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <p>Loading...</p>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
      <Modal onClose={handleClose}>
        <p>Something went wrong.</p>
      </Modal>
    );
  }

  const dateLabel = note.updatedAt
    ? `Updated at: ${note.updatedAt}`
    : `Created at: ${note.createdAt}`;

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <button className={css.backBtn} type="button" onClick={handleClose}>
            Back
          </button>

          <div className={css.header}>
            <h2>{note.title}</h2>
            {note.tag ? <span className={css.tag}>{note.tag}</span> : null}
          </div>

          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{dateLabel}</p>
        </div>
      </div>
    </Modal>
  );
}