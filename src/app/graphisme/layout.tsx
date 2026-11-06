/** Active la palette et la typographie de l'univers Graphisme. */
export default function GraphismeLayout({ children }: LayoutProps<"/graphisme">) {
  return <div data-univers="graphisme">{children}</div>;
}
