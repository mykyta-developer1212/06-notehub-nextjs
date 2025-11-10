"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";

interface NoteDetailsClientProps {
  id: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  const {
    data: note,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });

  if (isPending) return <p>Loading note details...</p>;
  if (isError || !note) return <p>Something went wrong while loading note.</p>;

  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p>{new Date(note.createdAt).toLocaleDateString()}</p>
    </div>
  );
}