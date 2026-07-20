import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: ButtonLinkProps) {
  const classes =
    variant === "primary"
      ? "bg-[var(--foreground)] text-[#1a1026] hover:bg-[var(--lavender)]"
      : "border border-white/20 text-[var(--foreground)] hover:border-[var(--lavender)] hover:bg-white/10";

  return (
    <Link
      className={`focus-ring inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] px-5 text-sm font-bold transition ${classes}`}
      href={href}
    >
      {children}
    </Link>
  );
}
