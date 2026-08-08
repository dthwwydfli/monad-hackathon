import { CreatePactForm } from "~~/components/pact/CreatePactForm";

export default function CreatePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold">Fund a pact</h1>
      <p className="mt-2 text-sm">Write a concise engineering ticket, not a payment form.</p>
      <div className="mt-8">
        <CreatePactForm />
      </div>
    </div>
  );
}
