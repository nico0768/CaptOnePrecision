/** Active la palette et la typographie de l'univers Développement. */
export default function DeveloppementLayout({ children }: LayoutProps<"/developpement">) {
  return <div data-univers="dev">{children}</div>;
}
