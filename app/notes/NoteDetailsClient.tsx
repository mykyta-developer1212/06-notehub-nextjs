"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../lib/api";

interface NoteDetailsClientProps {
  id: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  const { data: note, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p>{new Date(note.createdAt).toLocaleDateString()}</p>
      <p>Tag: {note.tag}</p>
    </div>
  );
}