import type { Metadata } from "next";
import { BagView } from "@/components/site/bag/bag-view";

export const metadata: Metadata = { title: "Bag" };

export default async function CartPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <BagView lang={lang} />;
}
