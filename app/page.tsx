import { redirect } from "next/navigation";

export default function HomePage() {
  // Sistem akan membuang tampilan ini dan langsung melompat ke /login
  redirect("/login");
}