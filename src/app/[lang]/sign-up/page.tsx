import AuthForm from "@/components/AuthForm";
import { AccountsOff } from "@/components/site/showcase/accounts-off";
import { SHOWCASE } from "@/lib/showcase";
import { signUp } from "@/lib/auth/actions";
import { getDictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  if (SHOWCASE) return <AccountsOff lang={lang} />;
  const dictionary = await getDictionary(lang);
  return <AuthForm mode="sign-up" onSubmit={signUp} dictionary={dictionary} lang={lang} />;
}