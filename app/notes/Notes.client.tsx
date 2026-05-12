"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBar from "@/components/SearchBar/SearchBar";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./notes.module.css";

export default function NotesClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search),
  });

  function handleSearch(query: string) {
    setSearch(query);
    setPage(1);
  }

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Could not fetch the list of notes. {(error as Error).message}</p>;

  return (
    <div className={css.wrapper}>
      <div className={css.controls}>
        <SearchBar onSearch={handleSearch} initialValue={search} />
        <button
          className={css.createButton}
          onClick={() => setShowForm(true)}
        >
          + New Note
        </button>
      </div>

      <NoteList notes={data?.notes ?? []} />

      {data && data.totalPages > 1 && (
        <div className={css.pagination}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={css.pageButton}
          >
            Previous
          </button>
          <span className={css.pageInfo}>
            {page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, data.totalPages))}
            disabled={page === data.totalPages}
            className={css.pageButton}
          >
            Next
          </button>
        </div>
      )}

      {showForm && <NoteForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
