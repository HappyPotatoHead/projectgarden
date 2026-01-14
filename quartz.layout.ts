import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const tagsToRemove = ["graph-exclude", "explorer-exclude", "backlinks-exclude", "recents-exclude", "search-exclude", "listing-exclude"]
const graphConfig = {
  localGraph: {
    removeTags: tagsToRemove,
    excludeTags: ["graph-exclude"]
  },
  globalGraph: {
    removeTags: tagsToRemove,
    excludeTags: ["graph-exclude", "slurp"]
  }
};

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    // Component.ConditionalRender({
    //   component: Component.Comments({
    //     provider: 'giscus',
    //     options: {
    //       // from data-repo
    //       repo: 'HappyPotatoHead/projectgarden',
    //       // from data-repo-id
    //       repoId: 'R_kgDOOYwR8g',
    //       // from data-category
    //       category: 'Announcements',
    //       // from data-category-id
    //       categoryId: 'DIC_kwDOOYwR8s4CpDaN',
    //       mapping: "specific",
    //       inputPosition: "top",
    //       lightTheme: "light",
    //       darkTheme: "dark"
    //     }
    //   }),
    //   condition: (page) => page.fileData.slug === "index"
    // })

  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/HappyPotatoHead/"
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ConditionalRender({
      component: Component.ContentMeta({showReadingTime: false}), 
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.TagList(),
    Component.MobileOnly(Component._TableOfContents({layout:"modern"})),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search({}),
          // grow: true,
        },
        { 
          Component: Component.Darkmode()
        },
        { 
            Component: Component.DesktopOnly(Component.ReaderMode()), 
            justify: "end",
        },
      ],
      gap:"0.5rem",
    }),
    Component.DesktopOnly(    
        Component.ConditionalRender({
            component: Component.TableOfContents(),
            condition: (page) => page.fileData.slug !== "index"
        })
    ),
    // Component.TableOfContents()),
    Component.ConditionalRender({
      component: Component.Explorer({folderDefaultState: "open"}),
      condition: (page) => page.fileData.slug === "index"
    }),
    Component.FloatingButtons({position: 'right'})
  ],
  right: [
    Component.Graph(graphConfig),
    // Component.DesktopOnly(Component.TableOfContents()),
    // Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
    Component.FloatingButtons({position: 'right'}),
  ],
  right: [Component.HiddenGlobalGraph()],
}
