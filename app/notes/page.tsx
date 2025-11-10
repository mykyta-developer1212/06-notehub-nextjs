import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, 10, ""],
    queryFn: () => fetchNotes({ page: 1, perPage: 10 }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient />
    </HydrationBoundary>
  );
}