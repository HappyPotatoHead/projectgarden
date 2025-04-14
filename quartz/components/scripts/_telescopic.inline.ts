// copied from https://github.com/aarnphm/aarnphm.github.io/blob/52710beda12f4ae45d79d0da6a70f0e6f92af58b/quartz/components/scripts/telescopic.inline.ts
// on feb 5 2025

document.addEventListener("nav", () => {
  const telescopics = document.querySelectorAll(".telescopic-container") as NodeListOf<HTMLElement>
  if (telescopics.length === 0) return

  telescopics.forEach((tel) => {
    const el = tel.querySelector("div#telescope") as HTMLElement
    if (!el) return

    const expandable = el.querySelectorAll('span[class~="details"]') as NodeListOf<HTMLSpanElement>

    expandable.forEach((closed) => {
      function onClick() {
        closed.classList.remove("close")
        closed.classList.add("open")
      }
      closed.addEventListener("click", onClick)
      window.addCleanup(() => closed.removeEventListener("click", onClick))
    })

    tel.querySelectorAll(".replay").forEach((rpl) => {
      function onClick() {
        expandable.forEach((open) => {
          open.classList.toggle("close", true)
          open.classList.toggle("open", false)
        })
      }
      rpl.addEventListener("click", onClick)
      window.addCleanup(() => rpl.removeEventListener("click", onClick))
    })

    tel.querySelectorAll(".expand").forEach((exp) => {
      function onClick() {
        expandable.forEach((clse) => {
          clse.classList.toggle("close", false)
          clse.classList.toggle("open", true)
        })
      }
      exp.addEventListener("click", onClick)
      window.addCleanup(() => exp.removeEventListener("click", onClick))
    })
  })
})