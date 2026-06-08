import { getGuidelinePageContent } from '../lib/sellerGuidelineContent'

const INTRO_CONTENT = getGuidelinePageContent(1)

export default function IntroGuidePanel() {
  return (
    <aside className="intro-guide-panel" aria-label="Seller guide overview">
      {INTRO_CONTENT.eyebrow ? (
        <p className="intro-guide-panel__eyebrow">{INTRO_CONTENT.eyebrow}</p>
      ) : null}
      {INTRO_CONTENT.subtitle ? (
        <h2 className="intro-guide-panel__title">{INTRO_CONTENT.subtitle}</h2>
      ) : null}
      {INTRO_CONTENT.paragraphs?.[0] ? (
        <p className="intro-guide-panel__body">{INTRO_CONTENT.paragraphs[0]}</p>
      ) : null}
      {INTRO_CONTENT.bullets?.length ? (
        <ul className="intro-guide-panel__list">
          {INTRO_CONTENT.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {INTRO_CONTENT.callouts?.[0]?.body ? (
        <p className="intro-guide-panel__meta">{INTRO_CONTENT.callouts[0].body}</p>
      ) : null}
    </aside>
  )
}
