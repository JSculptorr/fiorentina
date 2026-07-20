type IconProps = {
  className?: string;
};

function IconShell({ children, className }: React.PropsWithChildren<IconProps>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

export function StadiumIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <path d="M4 20c3.5-3 7.5-4.5 12-4.5S24.5 17 28 20" />
      <path d="M6 21.5c2.9 2.2 6.2 3.3 10 3.3s7.1-1.1 10-3.3" />
      <path d="M8 11 11 4M24 11l-3-7" />
      <path d="M10 10h12M7 24v3m18-3v3M12 25v3m8-3v3" />
    </IconShell>
  );
}

export function MatchIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <rect height="20" rx="2" width="24" x="4" y="6" />
      <path d="M16 6v20M4 16h7m10 0h7" />
      <circle cx="16" cy="16" r="4" />
      <path d="M8 10h4M20 22h4" />
    </IconShell>
  );
}

export function ScarfIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <path d="M5 10c6-4 16-4 22 0v12c-6-4-16-4-22 0V10Z" />
      <path d="M9 8v12m5-14v12m4-12v12m5-10v12" />
      <path d="M5 22v5m5-3v4m17-6v5m-5-3v4" />
    </IconShell>
  );
}

export function TrophyIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <path d="M11 6h10v6c0 4-2 7-5 7s-5-3-5-7V6Z" />
      <path d="M11 9H6c0 4 2 7 6 7M21 9h5c0 4-2 7-6 7" />
      <path d="M16 19v5M11 26h10M13 24h6" />
    </IconShell>
  );
}

export function SendIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <path d="M5 16 27 5l-6 22-5-9-8 6 4-9-7 1Z" />
      <path d="m12 15 9-5" />
    </IconShell>
  );
}

export function RankingIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <path d="M7 25V14h5v11M14 25V7h5v18M21 25V11h5v14" />
      <path d="M5 25h23" />
      <path d="m14 5 2-2 2 2" />
    </IconShell>
  );
}
