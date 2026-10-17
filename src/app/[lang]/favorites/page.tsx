import type { Metadata } from "next";
import { FavoritesView } from "@/components/site/favorites/favorites-view";

export const metadata: Metadata = { title: "Favorites", robots: { index: false } };

export default async function FavoritesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <FavoritesView lang={lang} />;
}
