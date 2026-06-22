import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { SidebarImage } from "./quartz/components"

const config = await loadQuartzConfig()
const layout = await loadQuartzLayout()

layout.byPageType.content ??= {}

layout.byPageType.content.right = [
  SidebarImage({
    src: "/images/meh.jpg",
    alt: "Digital garden illustration",
    onlyIndex: false,
  }),
  ...(layout.byPageType.content.right ?? []),
]

export default config
export { layout }
