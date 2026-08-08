import { CreatePactForm } from "~~/components/pact/CreatePactForm";

export default function CreatePage() {
  return (
    <div>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-medium">Fund an issue</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Write a concise engineering ticket, not a payment form. Three things: which issue, what counts as done, and
          what it&apos;s worth.
        </p>
      </div>
      <div className="mt-10">
        <CreatePactForm />
      </div>
    </div>
  );
}
