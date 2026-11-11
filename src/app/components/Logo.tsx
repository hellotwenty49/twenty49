type LogoProps = {
  /** "light" = for light backgrounds, "dark" = for dark backgrounds */
  variant?: "light" | "dark";
  className?: string;
};

/** twenty49 logo image (plum for light backgrounds, cream for dark). */
export default function Logo({ variant = "light", className = "" }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={variant === "dark" ? "/logo-dark.png" : "/logo-light.png"}
      alt="twenty49"
      width={500}
      height={213}
      className={`block w-auto ${className}`}
    />
  );
}
