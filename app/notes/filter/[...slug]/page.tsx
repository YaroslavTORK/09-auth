import type { Metadata } from "next";
import type { NoteTags } from "@/types/note";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

type Props = {
  params: Promise<{ slug: string[] }>;
};

const PER_PAGE = 12;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const raw = slug?.[0];
  const tag = raw === "all" ? undefined : raw;

  const title = !tag ? "NoteHub — Notes" : `NoteHub — Notes — ${tag}`;
  const description = !tag
    ? "All notes"
    : `Notes filtered by tag: ${tag}`;

  const url = !tag ? "/notes/filter/all" : `/notes/filter/${tag}`;

  const ogImage = "https://ac.goit.global/fullstack/react/og-meta.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "NoteHub",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: !tag ? "NoteHub — Notes" : `NoteHub — Notes — ${tag}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}


const NotesByCategory = async ({ params }: Props) => {
  const { slug } = await params;
  const tag = slug?.[0] === "all" ? undefined : (slug?.[0] as NoteTags);

  const queryClient = new QueryClient();
  const page = 1;
  const debouncedSearch = "";

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, PER_PAGE, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: undefined,
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesByCategory;
