import Link from "next/link";
import { Briefcase, MessageSquareText, Home } from "lucide-react";

export default function NavBar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <nav className="container flex items-center gap-6 py-3">
        <Link href="/" className="font-semibold text-xl">
          <span className="text-brand-700">Locked</span>In
        </Link>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <Link className="flex items-center gap-2 hover:underline" href="/"><Home size={18}/> Home</Link>
          <Link className="flex items-center gap-2 hover:underline" href="/jobs"><Briefcase size={18}/> Jobs</Link>
          <Link className="flex items-center gap-2 hover:underline" href="/messages"><MessageSquareText size={18}/> Messages</Link>
        </div>
      </nav>
    </header>
  );
}
