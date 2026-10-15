import HomeSections from "@/components/site/home";
import { type Locale } from "@/components/internationalization/config";
import { getDictionary } from "@/components/internationalization/dictionaries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <HomeSections lang={lang} dictionary={dictionary} />;
}
