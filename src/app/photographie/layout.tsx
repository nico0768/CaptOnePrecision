/** Active l'univers Photographie (toujours sombre, pour mettre les images en valeur). */
export default function PhotographieLayout({ children }: LayoutProps<"/photographie">) {
  return <div data-univers="photo">{children}</div>;
}
