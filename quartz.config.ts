import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { defaultImage } from "./quartz/util/og"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "🥔",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "goatcounter",
      websiteId: '9719'
    },
    locale: "en-US",
    baseUrl: "happypotatohead.github.io/projectgarden",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Literata",
        body: "PT Serif",
        code: "Source Code Pro",
      },
      colors: {
        lightMode: {
          light: "rgb(255, 252, 240)",
          lightgray: "rgb(206, 205, 195)",
          gray: "rgb(16, 15, 15)",
          darkgray: "rgb(16, 15, 15)",
          dark: "rgb(16, 15, 15)",
          secondary: "rgb(208, 162, 21)",
          tertiary: "rgb(173, 131, 1)",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "rgba(135, 154, 57, 0.66)",
        },
        darkMode: {
          light: "#100f0f",
          lightgray: "rgb(64, 62, 60)",
          gray: "rgb(206, 205, 195)",
          darkgray: "rgb(206, 205, 195)",
          dark: "rgb(206, 205, 195)",
          secondary: "rgb(67, 133, 190)",
          tertiary: "rgb(32, 94, 166)",
          highlight: "rgb(218, 112, 44)",
          textHighlight: "rgb(218, 112, 44)", 
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.TelescopicText({}),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      // Plugin.TableOfContents({maxDepth: 3, collapseByDefault: false}),
      Plugin._TableOfContents({maxDepth: 3, collapseByDefault: false}),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.ClickableImages(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages({
        colorScheme: "darkMode",
        width: 1200,
        height: 630,
        excludeRoot: false,
        imageStructure: defaultImage,
      }),
    ],
  },
}

export default config
