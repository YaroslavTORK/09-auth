"use client";
import { useEffect, useState } from "react";
import css from "./NotesPage.module.css";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/lib/api/clientApi";
import { useQuery } from "@tanstack/react-query";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Link from "next/link";
import type { NoteTags } from "@/types/note";

const PER_PAGE = 12;

type Props = {
  tag?: NoteTags;
};

export default function NotesClient({ tag }: Props) {
  const [page, setPage] = useState(1);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 400);

  useEffect(() => {
    setPage(1);
  }, [tag]);

  const search = debouncedSearch.trim() || undefined;
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["notes", page, PER_PAGE, debouncedSearch, tag],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search, tag }),
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const onSearchChange = (value: string) => {
    setSearchText(value);
    setPage(1);
  };

  const onPageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchText} onChange={onSearchChange} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}

        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {(isLoading || isFetching) && <p>Loading...</p>}
      {isError && <p>Something went wrong</p>}
      {!isError && !isLoading && !isFetching && notes.length > 0 && (
        <NoteList notes={notes} />
      )}
    </div>
  );
}
