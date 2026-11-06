"use client";

import { useActionState } from "react";
import { connexion, type EtatConnexion } from "@/app/admin/actions";
import { LogoSymbole } from "@/components/layout/Logo";

const etatInitial: EtatConnexion = {};

export function Connexion({ configure }: { configure: boolean }) {
  const [etat, action, envoi] = useActionState(connexion, etatInitial);

  return (
    <div className="flex min-h-dvh items-center justify-center p-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <LogoSymbole className="h-10" />
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Tableau de bord</h1>
        {configure ? (
          <form action={action} className="mt-6 space-y-4">
            <div>
              <label htmlFor="motDePasse" className="text-sm font-medium">
                Mot de passe
              </label>
              <input
                id="motDePasse"
                name="motDePasse"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                aria-invalid={!!etat.erreur}
                aria-describedby={etat.erreur ? "erreur-connexion" : undefined}
                className="mt-1.5 w-full rounded-lg border border-[#d4d4d8] px-3 py-2.5 focus:border-[#18181b] focus:outline-none"
              />
            </div>
            {etat.erreur && (
              <p id="erreur-connexion" role="alert" className="text-sm text-red-700">
                {etat.erreur}
              </p>
            )}
            <button type="submit" disabled={envoi} className="w-full rounded-lg bg-[#18181b] py-2.5 text-sm font-medium text-white disabled:opacity-60">
              {envoi ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        ) : (
          <p role="alert" className="mt-4 text-sm leading-relaxed text-[#62626b]">
            L&apos;accès n&apos;est pas configuré : définissez la variable <code>ADMIN_PASSWORD</code> sur le serveur.
          </p>
        )}
      </div>
    </div>
  );
}
