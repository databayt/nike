import AuthForm from "@/components/AuthForm";
import { AccountsOff } from "@/components/site/showcase/accounts-off";
import { SHOWCASE } from "@/lib/showcase";
import { signIn } from "@/lib/auth/actions";
import { getDictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  if (SHOWCASE) return <AccountsOff lang={lang} />;
  const dictionary = await getDictionary(lang);
  return <AuthForm mode="sign-in" onSubmit={signIn} dictionary={dictionary} lang={lang} />;
}