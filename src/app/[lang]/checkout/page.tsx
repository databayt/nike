import type { Metadata } from "next";
import { CheckoutView } from "@/components/site/bag/checkout-view";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <CheckoutView lang={lang} />;
}
