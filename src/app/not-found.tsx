import { ArrowLink, Container, Eyebrow } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col justify-center pt-32 pb-24">
      <Eyebrow>Erreur 404</Eyebrow>
      <h1 className="mt-6 font-serif text-[clamp(3rem,10vw,8rem)] leading-[0.9]">
        Cette page <em className="italic">n&apos;existe pas.</em>
      </h1>
      <ArrowLink href="/" variant="solid" className="mt-12 self-start">
        Revenir à l&apos;accueil
      </ArrowLink>
    </Container>
  );
}
