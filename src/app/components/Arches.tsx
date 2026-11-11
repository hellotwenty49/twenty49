/** Flat arch illustration on a coral panel. Decorative. */
export default function Arches({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full rounded-[30px] bg-coral relative overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 220"
        preserveAspectRatio="xMidYMax meet"
        className="absolute inset-x-0 bottom-0 mx-auto h-full w-auto max-w-full"
      >
        <path d="M60 220V120a70 70 0 0 1 140 0v100z" fill="#55263D" />
        <path d="M230 220V90a70 70 0 0 1 140 0v130z" fill="#F5E8CC" />
        <path d="M400 220V130a70 70 0 0 1 140 0v90z" fill="#FFAA76" />
        <path d="M100 220v-70a30 30 0 0 1 60 0v70z" fill="#F5E8CC" />
        <path d="M270 220v-100a30 30 0 0 1 60 0v100z" fill="#55263D" />
        <path d="M440 220v-60a30 30 0 0 1 60 0v60z" fill="#55263D" />
      </svg>
    </div>
  );
}
