import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import legacyStyle from "./styles/legacyToc.scss"
import modernStyle from "./styles/toc.scss"
import { classNames } from "../util/lang"

// @ts-ignore
import script from "./scripts/toc.inline"
import { i18n } from "../i18n"
import OverflowListFactory from "./OverflowList"
import { concatenateResources } from "../util/resources"

// Configuration options
interface Options {
  layout: "modern" | "legacy"
}

const defaultOptions: Options = {
  layout: "modern",
}

export default ((opts?: Partial<Options>) => {
  const layout = opts?.layout ?? defaultOptions.layout
  const { OverflowList, overflowListAfterDOMLoaded } = OverflowListFactory()
    const isModernLayout = layout === "modern"

  const TableOfContents: QuartzComponent = ({ fileData, displayClass, cfg }: QuartzComponentProps) => {
    if (!fileData.toc) {
      return null
    }
  const ContentContainer = isModernLayout ? OverflowList : "ul"

    return (
      <div class={classNames(displayClass, "toc")}>
        {isModernLayout && (
          <button
            type="button"
            class={fileData.collapseToc ? "collapsed toc-header" : "toc-header"}
            aria-controls="toc-content"
            aria-expanded={!fileData.collapseToc}
          >
            <h3>{i18n(cfg.locale).components.tableOfContents.title}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="fold"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        )}
        <ContentContainer class={fileData.collapseToc ? "collapsed toc-content" : "toc-content"}>
          {fileData.toc.map((tocEntry) => (
            <li key={tocEntry.slug} class={`depth-${tocEntry.depth}`}>
              <a href={`#${tocEntry.slug}`} data-for={tocEntry.slug}>
                {tocEntry.text}
              </a>
            </li>
          ))}
        </ContentContainer>
      </div>
    )
  }

  TableOfContents.css = isModernLayout ? modernStyle : legacyStyle;
  TableOfContents.afterDOMLoaded = isModernLayout
    ? concatenateResources(script, overflowListAfterDOMLoaded)
    : script

  return TableOfContents
}) satisfies QuartzComponentConstructor