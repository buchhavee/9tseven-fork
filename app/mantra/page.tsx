import type { Metadata } from "next";
import MantraPage from "../components/MantraPage";

export const metadata: Metadata = {
  title: "Mantra",
  description:
    "The mantra behind 9TSEVEN — the principles, people, and runs that shape the brand. More than running.",
  alternates: { canonical: "/mantra" },
  openGraph: { url: "/mantra" },
};

export default function Mantra() {
  return (
    <main>
      <MantraPage />
    </main>
  );
}
