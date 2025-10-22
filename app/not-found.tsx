import { Button } from "@/components/ui/button";
import { H1, P } from "@/components/ui/typography";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative w-64 h-64 animate-spin">
        <Image
          src="/images/jancarlo.jpg"
          alt="Página no encontrada"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col">
        <H1>404 | Not Found</H1>
        <P>Could not find requested resource</P>
      </div>

      <Button>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
