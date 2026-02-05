import { Metadata } from "next"
import { fetchNoteById } from "@/lib/api/serverApi";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    const title = `Note: ${note.title}`;
    const description = (note.content ?? "").slice(0, 140);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `/notes/${id}`,
        siteName: "NoteHub",
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/og-meta.jpg",
            width: 1200,
            height: 630,
            alt: note.title,
          },
        ],
        type: "article",
      },
    };
  } catch {
    const title = "Note — NoteHub";
    const description = "View note details in NoteHub.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `/notes/${id}`,
        siteName: "NoteHub",
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "NoteHub",
          },
        ],
        type: "website",
      },
    };
  }
}

export default async function NoteDetails({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

