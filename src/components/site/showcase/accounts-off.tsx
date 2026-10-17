import Link from "next/link";

/** Stands in for the sign-in / sign-up forms on the public showcase. */
export function AccountsOff({ lang }: { lang: string }) {
  return (
    <main className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-2xl font-medium">Accounts are off in this demo</h1>
      <p className="pt-3 text-base text-[#707072]">
        This site is a portfolio clone built by databayt. It does not create accounts or accept passwords.
      </p>
      <Link href={`/${lang}`} className="mt-8 inline-block rounded-full bg-dark-900 px-6 py-3 font-medium text-light-100">
        Back to home
      </Link>
    </main>
  );
}
