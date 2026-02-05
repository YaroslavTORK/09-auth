"use client";

import type { NoteTags } from "../../types/note";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useNoteStore, initialDraft } from "@/lib/store/noteStore";

interface NoteFormProps {
  categories: readonly NoteTags[];
}

export default function NoteForm({ categories }: NoteFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();     
      router.back();  
    },
  });

  const handleCancel = () => {
    router.back(); 
  };

  const handleSubmit = (formData: FormData) => {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "");
    const tag = (formData.get("tag") as NoteTags) ?? initialDraft.tag;

    if (title.length < 3 || title.length > 50) return;
    if (content.length > 500) return;

    mutate({ title, content, tag });
  };


  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          required
          minLength={3}
          maxLength={50}
          disabled={isPending}
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          maxLength={500}
          disabled={isPending}
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          disabled={isPending}
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value as NoteTags })}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" onClick={handleCancel} disabled={isPending}>
          Cancel
        </button>

        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}
