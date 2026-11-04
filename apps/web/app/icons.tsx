/**
 * Interface icons from Craftwork's "Flex Smooth Design Icons" pack, outline
 * style (https://craftwork.design/icons?icon=2744, 2526, 2902), licensed under
 * the Craftwork Commercial License: https://craftwork.design/license#icons.
 * One pack, one style for the whole app; strokes follow currentColor.
 */

type IconProps = { size?: number; className?: string };

function Icon({ size = 20, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function FingerprintIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 .77c-.74 0-1.475.094-2.168.29" />
      <path d="M.75 13.23V6.493c0-1.647.527-2.91 1.368-3.825" />
      <path d="M13.25 13.23V7.573" />
      <path d="M7 .769c2.687 0 5.32 1.254 6.05 4.075" />
      <path d="M4.345 13.23s-.335-1.055-.586-2.584" />
      <path d="M9.655 13.23s.858-2.703.858-5.72c0-.59-.077-1.09-.21-1.515" />
      <path d="M7 11.422v1" />
      <path d="M3.487 7.51C3.487 4.495 5.479 3.8 7 3.8c.45 0 .943.06 1.413.226" />
      <path d="M5.825 8.515c0-.938.526-1.449 1.175-1.449s1.175.51 1.175 1.449" />
    </Icon>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 6.05h.5" />
      <path d="M4 9.05h.5" />
      <path d="M6.75 6.05h.5" />
      <path d="M9.5 6.05h.5" />
      <path d="M6.75 9.05h.5" />
      <path d="M1.198 10.525c.161 1.44 1.331 2.582 2.778 2.652 1 .048 2.021.073 3.13.073s2.13-.025 3.13-.073c1.447-.07 2.617-1.212 2.778-2.652.109-.97.198-1.963.198-2.975s-.09-2.006-.198-2.976c-.161-1.44-1.331-2.582-2.778-2.652-1-.048-2.021-.073-3.13-.073s-2.13.025-3.13.073c-1.447.07-2.617 1.213-2.778 2.652C1.089 5.544 1 6.537 1 7.55s.09 2.006.198 2.975" />
      <path d="M4.253.75v2.5" />
      <path d="M9.75.75v2.5" />
    </Icon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M.797 6.75c0-3.697 1.55-5.282 2.068-5.81h8.27c.517.528 2.068 2.113 2.068 5.81 0 4.224-4.073 5.782-6.14 6.31C4.994 12.532.796 10.974.796 6.749" />
    </Icon>
  );
}
