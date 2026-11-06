"use client";

import { useActionState } from "react";
import { envoyerMessage, type EtatContact } from "@/app/contact/actions";
import { cn } from "@/lib/cn";

const etatInitial: EtatContact = { statut: "initial" };

const champ =
  "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-lg transition-colors placeholder:text-muted/60 focus:border-ink focus:ring-0 focus:outline-none aria-[invalid=true]:border-red-600";

export function FormulaireContact({ sujetInitial = "developpement" }: { sujetInitial?: "developpement" | "photographie" | "graphisme" | "autre" }) {
  const [etat, action, envoi] = useActionState(envoyerMessage, etatInitial);

  if (etat.statut === "succes") {
    return (
      <div role="status" className="border-y border-line py-16">
        <p className="font-heading text-4xl">Message envoyé.</p>
        <p className="mt-4 text-muted">{etat.message}</p>
      </div>
    );
  }

  const v = etat.valeurs ?? {};
  const e = etat.erreurs ?? {};

  return (
    <form action={action} noValidate className="space-y-8">
      {/* Champ piège anti-spam, invisible pour les humains */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Ne pas remplir
          <input type="text" name="site_web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Champ id="nom" label="Nom" erreur={e.nom}>
          <input id="nom" name="nom" autoComplete="name" required defaultValue={v.nom} aria-invalid={!!e.nom} aria-describedby={e.nom ? "nom-erreur" : undefined} className={champ} />
        </Champ>
        <Champ id="email" label="E-mail" erreur={e.email}>
          <input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} aria-invalid={!!e.email} aria-describedby={e.email ? "email-erreur" : undefined} className={champ} />
        </Champ>
      </div>

      <fieldset>
        <legend className="mb-3 font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Sujet</legend>
        <div className="flex flex-wrap gap-2">
          {[
            ["developpement", "Développement"],
            ["photographie", "Photographie"],
            ["graphisme", "Graphisme"],
            ["autre", "Autre"],
          ].map(([valeur, label]) => (
            <label key={valeur} className="cursor-pointer">
              <input
                type="radio"
                name="sujet"
                value={valeur}
                defaultChecked={(v.sujet || sujetInitial) === valeur}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-line px-4 py-2 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                {label}
              </span>
            </label>
          ))}
        </div>
        {e.sujet && <p className="mt-2 text-sm text-red-600">{e.sujet}</p>}
      </fieldset>

      <Champ id="message" label="Votre projet" erreur={e.message}>
        <textarea id="message" name="message" rows={6} required defaultValue={v.message} aria-invalid={!!e.message} aria-describedby={e.message ? "message-erreur" : undefined} className={cn(champ, "resize-y")} />
      </Champ>

      {etat.statut === "erreur" && etat.message && (
        <p role="alert" className="text-sm text-red-600">
          {etat.message}
        </p>
      )}

      <button
        type="submit"
        disabled={envoi}
        className="inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-ink transition-opacity disabled:opacity-60"
      >
        {envoi ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}

function Champ({ id, label, erreur, children }: { id: string; label: string; erreur?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
        {label}
      </label>
      {children}
      {erreur && (
        <p id={`${id}-erreur`} className="mt-2 text-sm text-red-600">
          {erreur}
        </p>
      )}
    </div>
  );
}
