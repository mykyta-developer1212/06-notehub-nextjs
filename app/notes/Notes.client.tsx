"use client";

import { useState, useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import NoteList from "../../components/NoteList/NoteList";
import NoteForm from "../../components/NoteForm/NoteForm";
import Modal from "../../components/Modal/Modal";
import SearchBox from "../../components/SearchBox/SearchBox";
import Pagination from "../../components/Pagination/Pagination";
import { fetchNotes, type FetchNotesResponse } from "../../lib/api";
import type { DehydratedState } from "@tanstack/react-query";

interface NotesClientProps {
  dehydratedState?: DehydratedState;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function NotesClient({ dehydratedState }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, perPage, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch }),
    staleTime: 5000,
    refetchOnWindowFocus: false,

    placeholderData: (prevData) => prevData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <HydrationBoundary state={dehydratedState ?? null}>
      <div>
        <header>
          <SearchBox
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
          />
          {totalPages > 1 && (
            <Pagination
              pageCount={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
          <button onClick={() => setModalOpen(true)}>Create note +</button>
        </header>

        <main>
          {isLoading && notes.length === 0 && <p>Loading...</p>}
          {!isLoading && notes.length === 0 && <p>No notes found.</p>}
          {notes.length > 0 && <NoteList notes={notes} />}
        </main>

        {isModalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <NoteForm
              onSuccess={() => {
                setModalOpen(false);
                queryClient.invalidateQueries({ queryKey: ["notes"] });
              }}
              onCancel={() => setModalOpen(false)}
            />
          </Modal>
        )}
      </div>
    </HydrationBoundary>
  );
}