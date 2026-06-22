import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  src: string
  alt?: string
  href?: string
  onlyIndex?: boolean
}

export default ((opts?: Options) => {
  const SidebarImage: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    const slug = String(fileData.slug ?? "")

    if (
      opts?.onlyIndex !== false &&
      slug !== "index" &&
      slug !== "" &&
      slug !== "/"
    ) {
      return null
    }

    const image = (
      <img
        class="sidebar-image"
        src={opts?.src ?? "/images/meh.jpg"}
        alt={opts?.alt ?? "Sidebar image"}
      />
    )

    return (
      <div class={`${displayClass ?? ""} sidebar-image-wrapper`}>
        {opts?.href ? <a href={opts.href}>{image}</a> : image}
      </div>
    )
  }

  SidebarImage.css = `
.sidebar-image-wrapper {
  margin-top: 1rem;
  text-align: center;
}

.sidebar-image {
  display: block;
  max-width: 12rem;
  width: 100%;
  height: auto;
  margin: 0 auto;
  border-radius: 1rem;
}
`

  return SidebarImage
}) satisfies QuartzComponentConstructor
