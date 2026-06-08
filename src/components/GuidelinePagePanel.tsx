import type { GuidelineCallout, GuidelinePageContent } from '../lib/sellerGuidelineContent'

const CALLOUT_STYLES: Record<GuidelineCallout['type'], string> = {
  tip: 'border-emerald-500/30 bg-emerald-500/8 text-emerald-100',
  warning: 'border-amber-500/30 bg-amber-500/8 text-amber-100',
  info: 'border-slate-500/30 bg-slate-500/8 text-slate-300',
  success: 'border-yellow-500/30 bg-yellow-500/8 text-yellow-100',
}

interface GuidelinePagePanelProps {
  content: GuidelinePageContent
}

export default function GuidelinePagePanel({ content }: GuidelinePagePanelProps) {
  if (content.isBlank) {
    return (
      <div className="guideline-page-panel">
        <p className="text-sm text-slate-500">This page is blank in the original PDF.</p>
      </div>
    )
  }

  return (
    <article className="guideline-page-panel space-y-5">
      {content.eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-300">{content.eyebrow}</p>
      ) : null}

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">{content.title}</h1>
        {content.subtitle ? <p className="text-sm text-slate-400">{content.subtitle}</p> : null}
        {content.url ? (
          <p className="font-mono text-xs text-slate-500">{content.url}</p>
        ) : null}
      </header>

      {content.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="text-sm leading-7 text-slate-300 sm:text-base">
          {paragraph}
        </p>
      ))}

      {content.bullets?.length ? (
        <ul className="space-y-3">
          {content.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-300" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {content.steps?.length ? (
        <ol className="space-y-4">
          {content.steps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-xs font-semibold text-amber-200">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-100">{step.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}

      {content.definitions?.length ? (
        <dl className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
          {content.definitions.map((row) => (
            <div key={row.term} className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_1fr]">
              <dt className="text-sm font-semibold text-slate-200">{row.term}</dt>
              <dd className="text-sm leading-6 text-slate-400">{row.definition}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {content.callouts?.map((callout) => (
        <div
          key={`${callout.title ?? 'callout'}-${callout.body.slice(0, 24)}`}
          className={`rounded-xl border px-4 py-3 ${CALLOUT_STYLES[callout.type]}`}
        >
          {callout.title ? <p className="mb-1 text-sm font-semibold">{callout.title}</p> : null}
          <p className="whitespace-pre-line text-sm leading-6 opacity-90">{callout.body}</p>
        </div>
      ))}
    </article>
  )
}
