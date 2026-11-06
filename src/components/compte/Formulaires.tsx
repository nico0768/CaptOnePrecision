"use client";

import Link from "next/link";
import { useActionState } from "react";
import { connexionClient, inscription, reserver, supprimerMonCompte, type EtatFormulaire } from "@/app/mon-espace/actions";

const etatInitial: EtatFormulaire = {};
const styleChamp =
  "mt-1.5 w-full rounded-xl border border-line bg-bg px-4 py-3 text-base transition-colors focus:border-accent focus:outline-none aria-[invalid=true]:border-red-600";
const styleBouton =
  "inline-flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-60";

function Champ({ id, label, erreur, aide, children }: { id: string; label: string; erreur?: string; aide?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {aide && !erreur && <p className="mt-1 text-xs text-muted">{aide}</p>}
      {erreur && (
        <p id={`${id}-erreur`} className="mt-1 text-sm text-red-700 dark:text-red-400">
          {erreur}
        </p>
      )}
    </div>
  );
}

function Alerte({ texte }: { texte?: string }) {
  if (!texte) return null;
  return (
    <p role="alert" className="rounded-xl border border-red-600/40 bg-red-600/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
      {texte}
    </p>
  );
}

const lien = (base: string, formule?: string) => (formule ? `${base}?formule=${encodeURIComponent(formule)}` : base);
const decrire = (e: EtatFormulaire, id: string) => ({ "aria-invalid": !!e.erreurs?.[id], "aria-describedby": e.erreurs?.[id] ? `${id}-erreur` : undefined });

export function FormulaireConnexion({ formule }: { formule?: string }) {
  const [etat, action, envoi] = useActionState(connexionClient, etatInitial);
  return (
    <form action={action} className="space-y-5">
      {formule && <input type="hidden" name="formule" value={formule} />}
      <Champ id="email" label="E-mail">
        <input id="email" name="email" type="email" required autoComplete="email" inputMode="email" defaultValue={etat.valeurs?.email} className={styleChamp} />
      </Champ>
      <Champ id="motDePasse" label="Mot de passe">
        <input id="motDePasse" name="motDePasse" type="password" required autoComplete="current-password" className={styleChamp} />
      </Champ>
      <Alerte texte={etat.erreur} />
      <button type="submit" disabled={envoi} className={styleBouton}>
        {envoi ? "Connexion…" : "Se connecter"}
      </button>
      <p className="text-center text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link href={lien("/inscription", formule)} className="font-semibold text-accent">
          Créer un compte
        </Link>
      </p>
      <p className="text-center text-sm text-muted">
        Mot de passe oublié ?{" "}
        <Link href="/contact" className="underline">
          Contactez-nous
        </Link>
      </p>
    </form>
  );
}

export function FormulaireInscription({ formule }: { formule?: string }) {
  const [etat, action, envoi] = useActionState(inscription, etatInitial);
  const v = etat.valeurs ?? {};
  const e = etat.erreurs ?? {};
  return (
    <form action={action} noValidate className="space-y-5">
      {formule && <input type="hidden" name="formule" value={formule} />}
      <Champ id="nom" label="Nom complet" erreur={e.nom}>
        <input id="nom" name="nom" required autoComplete="name" defaultValue={v.nom} {...decrire(etat, "nom")} className={styleChamp} />
      </Champ>
      <Champ id="email" label="E-mail" erreur={e.email}>
        <input id="email" name="email" type="email" required autoComplete="email" inputMode="email" defaultValue={v.email} {...decrire(etat, "email")} className={styleChamp} />
      </Champ>
      <Champ id="telephone" label="Téléphone" erreur={e.telephone} aide="Pour confirmer vos réservations.">
        <input id="telephone" name="telephone" type="tel" required autoComplete="tel" defaultValue={v.telephone} {...decrire(etat, "telephone")} className={styleChamp} />
      </Champ>
      <Champ id="motDePasse" label="Mot de passe" erreur={e.motDePasse} aide="8 caractères minimum.">
        <input id="motDePasse" name="motDePasse" type="password" required minLength={8} autoComplete="new-password" {...decrire(etat, "motDePasse")} className={styleChamp} />
      </Champ>
      <div>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="consentement" value="oui" required className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]" />
          J&apos;accepte que Capt One PRECISION conserve ces informations pour gérer mon compte et mes réservations. Je peux supprimer mon compte à tout moment.
        </label>
        {e.consentement && <p className="mt-1 text-sm text-red-700 dark:text-red-400">{e.consentement}</p>}
      </div>
      <Alerte texte={etat.erreur} />
      <button type="submit" disabled={envoi} className={styleBouton}>
        {envoi ? "Création du compte…" : "Créer mon compte"}
      </button>
      <p className="text-center text-sm text-muted">
        Déjà inscrit ?{" "}
        <Link href={lien("/connexion", formule)} className="font-semibold text-accent">
          Se connecter
        </Link>
      </p>
    </form>
  );
}

export function FormulaireReservation({
  prestations,
  prestationInitiale,
  telephone,
  dateMin,
}: {
  prestations: string[];
  prestationInitiale?: string;
  telephone: string;
  dateMin: string;
}) {
  const [etat, action, envoi] = useActionState(reserver, etatInitial);
  const v = etat.valeurs ?? {};
  const e = etat.erreurs ?? {};
  return (
    <form action={action} noValidate className="space-y-5">
      <Champ id="prestation" label="Prestation" erreur={e.prestation}>
        <select id="prestation" name="prestation" defaultValue={v.prestation || prestationInitiale || prestations[0]} {...decrire(etat, "prestation")} className={styleChamp}>
          {prestations.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Champ>
      <div className="grid gap-5 sm:grid-cols-2">
        <Champ id="date" label="Date souhaitée" erreur={e.date}>
          <input id="date" name="date" type="date" required min={dateMin} defaultValue={v.date} {...decrire(etat, "date")} className={styleChamp} />
        </Champ>
        <Champ id="telephone" label="Téléphone" erreur={e.telephone}>
          <input id="telephone" name="telephone" type="tel" required autoComplete="tel" defaultValue={v.telephone ?? telephone} {...decrire(etat, "telephone")} className={styleChamp} />
        </Champ>
      </div>
      <Champ id="lieu" label="Lieu (facultatif)" erreur={e.lieu}>
        <input id="lieu" name="lieu" maxLength={200} defaultValue={v.lieu} className={styleChamp} />
      </Champ>
      <Champ id="message" label="Précisions (facultatif)" erreur={e.message}>
        <textarea id="message" name="message" rows={4} maxLength={2000} defaultValue={v.message} className={`${styleChamp} resize-y`} />
      </Champ>
      <Alerte texte={etat.erreur} />
      {etat.succes && (
        <p role="status" className="rounded-xl border border-green-700/40 bg-green-700/10 px-4 py-3 text-sm text-green-800 dark:text-green-300">
          {etat.succes}
        </p>
      )}
      <button type="submit" disabled={envoi} className={styleBouton}>
        {envoi ? "Envoi…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}

export function BoutonSupprimerCompte() {
  return (
    <form
      action={supprimerMonCompte}
      onSubmit={(e) => {
        if (!window.confirm("Supprimer définitivement votre compte et vos réservations ?")) e.preventDefault();
      }}
    >
      <button type="submit" className="text-sm text-muted underline hover:text-red-700">
        Supprimer mon compte
      </button>
    </form>
  );
}
