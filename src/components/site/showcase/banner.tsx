/** Always-on disclosure: this is a portfolio clone, not the brand's store. */
export function ShowcaseBanner() {
  return (
    <div role="note" className="bg-dark-900 px-4 py-2 text-center text-xs leading-5 text-light-100">
      Portfolio demo by{" "}
      <a href="https://databayt.org" className="underline underline-offset-2">
        databayt
      </a>{" "}
      — not affiliated with or endorsed by Nike, Inc. Nothing here is for sale; no accounts or payments.
    </div>
  );
}
