import { cn } from "@/lib/cn";

/** Le symbole seul. Il suit la couleur du texte, donc les thèmes clair et sombre. */
export function LogoSymbole({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 851 1000" aria-hidden className={cn("h-9 w-auto shrink-0", className)} fill="currentColor" fillRule="evenodd">
      <path d="M 404.500 0.612 C 327.342 8.677, 293.987 17.764, 239.500 45.564 C 190.999 70.309, 161.693 91.352, 125.405 127.486 C 52.584 199.999, 11.462 284.326, 1.526 381.520 C -1.234 408.519, -0.221 605.572, 2.785 626.500 C 16.516 722.090, 56.957 803.245, 124.406 870.561 C 205.883 951.878, 310.125 996.173, 428.250 999.672 L 450 1000.316 450 976.822 C 450 963.901, 450.298 930.986, 450.663 903.679 L 451.326 854.029 454.413 853.589 C 456.111 853.347, 464.566 852.439, 473.202 851.571 C 625.946 836.222, 764.082 730.666, 820.744 586 C 837.135 544.151, 848.446 494.877, 850.240 457.506 C 851.511 600.254, 851.520 599.735, 851.592 496 C 851.631 437.975, 851.365 393.200, 850.168 396.994 C 849.649 379.996, 844.093 345.540, 837.995 321.500 C 796.902 159.519, 663.491 34.832, 501 6.543 C 473 1.668, 423.500 -1.374, 404.500 0.612 M 407.500 172.015 C 286.900 182.619, 192.583 272.845, 175.447 394 C 173.223 409.725, 172.360 482.300, 173.919 522.563 C 176.783 596.560, 183.454 629.995, 203.439 670.500 C 243.156 750.998, 319.093 803.906, 407.250 812.501 L 414 813.159 414 748.227 L 414 683.295 432.750 682.688 C 472.560 681.399, 505.841 673.217, 539.268 656.498 C 646.074 603.079, 701.799 483.271, 673.920 367 C 651.140 271.996, 575.513 197.727, 480.500 177.051 C 459.186 172.413, 427.685 170.240, 407.500 172.015" />
    </svg>
  );
}

/** Le symbole accompagné du nom : « Capt One » puis « PRECISION ». */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 leading-none", className)}>
      <LogoSymbole />
      <span className="flex flex-col">
        <span className="font-heading text-lg font-semibold tracking-tight">Capt One</span>
        <span className="mt-0.5 text-[10px] font-semibold tracking-[0.28em] uppercase">Precision</span>
      </span>
    </span>
  );
}
