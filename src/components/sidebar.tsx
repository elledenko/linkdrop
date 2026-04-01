"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { format, parseISO, isToday } from "date-fns";
import {
  Droplets,
  CalendarDays,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

const TAB_COLORS = [
  "var(--color-tab-coral)",
  "var(--color-tab-amber)",
  "var(--color-tab-gold)",
  "var(--color-tab-sage)",
  "var(--color-tab-teal)",
  "var(--color-tab-slate)",
  "var(--color-tab-mauve)",
  "var(--color-tab-rose)",
];

export function Sidebar({
  dates,
  digests,
  profile,
}: {
  dates: string[];
  digests: Array<{ id: string; digest_date: string; title: string | null }>;
  profile: Profile;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const today = format(new Date(), "yyyy-MM-dd");
  const allDates = dates.includes(today) ? dates : [today, ...dates];

  return (
    <aside className="w-64 bg-cream-light border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-text">LinkDrop</span>
        </Link>
      </div>

      {/* Today button */}
      <div className="p-3">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            pathname === "/dashboard"
              ? "bg-primary text-white"
              : "text-text hover:bg-cream"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Today
        </Link>
      </div>

      {/* Date tabs */}
      <div className="flex-1 overflow-y-auto px-3">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 mb-2">
          Daily Folders
        </p>
        <div className="space-y-0.5">
          {allDates.slice(0, 30).map((date, i) => {
            const isActive =
              pathname === `/dashboard/${date}` ||
              (pathname === "/dashboard" && date === today);
            const color = TAB_COLORS[i % TAB_COLORS.length];
            const dateObj = parseISO(date);

            return (
              <Link
                key={date}
                href={date === today ? "/dashboard" : `/dashboard/${date}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors group ${
                  isActive
                    ? "bg-cream font-medium text-text"
                    : "text-text-secondary hover:bg-cream hover:text-text"
                }`}
              >
                <div
                  className="w-3 h-6 rounded-sm shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span>
                  {isToday(dateObj)
                    ? "Today"
                    : format(dateObj, "MMM d, yyyy")}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Digests section */}
        {digests.length > 0 && (
          <>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 mb-2 mt-6">
              Digests
            </p>
            <div className="space-y-0.5">
              {digests.map((digest) => (
                <Link
                  key={digest.id}
                  href={`/digest/${digest.id}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === `/digest/${digest.id}`
                      ? "bg-cream font-medium text-text"
                      : "text-text-secondary hover:bg-cream hover:text-text"
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {format(parseISO(digest.digest_date), "MMM d")}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom */}
      <div className="p-3 border-t border-border space-y-0.5">
        <Link
          href="/settings"
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
            pathname === "/settings"
              ? "bg-cream font-medium text-text"
              : "text-text-secondary hover:bg-cream hover:text-text"
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-cream hover:text-text transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
