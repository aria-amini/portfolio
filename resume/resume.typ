#let data = yaml("resume.yaml")

// ===== Palette =====
// Mirrors the site theme in src/styles.css so the PDF reads as the same brand.
#let ink = oklch(28%, 0.12, 270deg) // --foreground
#let accent = oklch(52%, 0.22, 5deg) // --primary-ink
#let body-ink = oklch(30%, 0.035, 270deg)
#let muted = oklch(50%, 0.06, 270deg)
#let hairline = oklch(88%, 0.03, 270deg)

#set document(title: data.name + " — Resume", author: data.name)
#set page(paper: "us-letter", margin: (x: 0.65in, y: 0.6in))
// fallback: false keeps machine fonts out, so every build renders identical glyphs.
#set text(font: "Inter", size: 10.5pt, fill: body-ink, lang: "en", fallback: false)
#set par(leading: 0.62em, spacing: 0.62em)
#set list(
  marker: text(fill: muted, size: 8pt, baseline: -0.05em, sym.bullet),
  indent: 0.1em,
  body-indent: 0.55em,
  spacing: 0.7em,
)
#show strong: set text(weight: "medium", fill: ink)
#show link: underline.with(stroke: 0.5pt + hairline, offset: 2pt)

// ===== Helpers =====
// Only *term* is markup. Everything else stays literal, so ~, @, and # in the YAML need no escapes.
// The box keeps an emphasized term on one line.
#let rich(source) = {
  source
    .split("*")
    .enumerate()
    .map(((index, part)) => if calc.odd(index) { strong(box(part)) } else { part })
    .join()
}

#let month(value) = {
  let (year, month) = str(value).split("-").map(int)
  datetime(year: year, month: month, day: 1).display("[month repr:short] [year]")
}

#let period(job) = month(job.start) + " – " + if "end" in job { month(job.end) } else { "Present" }

#let meta(body) = text(size: 9.5pt, fill: muted, body)

#let section(title) = {
  v(1.7em, weak: true)
  grid(
    columns: (auto, 1fr),
    column-gutter: 0.6em,
    align: horizon,
    text(size: 9pt, weight: "semibold", tracking: 0.1em, fill: accent, upper(title)),
    line(length: 100%, stroke: 0.5pt + hairline),
  )
  v(0.85em, weak: true)
}

#let separator = h(0.4em) + text(fill: muted, "·") + h(0.4em)

#let heading-line(left, right) = grid(
  columns: (1fr, auto),
  column-gutter: 1em,
  left, meta(text(number-width: "tabular", right)),
)

// ===== Header =====
#text(font: "Inter Display", size: 26pt, weight: "semibold", fill: ink, tracking: -0.01em, data.name)
#v(0.7em, weak: true)
#let contact = data.contact
#let divider = h(0.45em) + text(fill: hairline, "|") + h(0.45em)
#let links(items) = items.map(item => link(item.url, item.label))
#let contact-lines = (
  (contact.phone, link("mailto:" + contact.email, contact.email), ..links(contact.links)),
  links(contact.profiles),
  (contact.location,),
)
#for line in contact-lines {
  meta(line.join(divider))
  v(0.7em, weak: true)
}

// ===== Body =====
#section("Education")
#for school in data.education [
  #text(weight: "semibold", fill: ink, school.degree)#separator#emph(school.school)#separator#meta(school.details)
]

#section("Experience")
#for job in data.experience {
  block(breakable: false, below: 1.35em)[
    #heading-line(
      [#text(weight: "semibold", fill: ink, job.company)#separator#job.role],
      period(job),
    )
    #v(0.65em, weak: true)
    #list(..job.bullets.map(rich))
  ]
}

#section("Projects")
#for project in data.projects [
  #text(weight: "semibold", fill: ink, link(project.url, project.name))#text(fill: muted)[:] #rich(project.summary)
]

#section("Skills")
#data.skills.join([~#text(fill: muted)[·] ])
