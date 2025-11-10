import NoteDetailsClient from "../NoteDetailsClient";

interface Props {
  params: { id: string };
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params; 
  return <NoteDetailsClient id={id} />;
}