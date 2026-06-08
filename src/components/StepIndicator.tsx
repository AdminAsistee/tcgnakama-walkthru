import { motion } from 'framer-motion'

const STEPS = ['Welcome', 'Select Card', 'Grade', 'Price', 'Summary']

interface StepIndicatorProps {
  current: number
}

export default function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center py-4 px-6">
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => {
          const isDone = i < current
          const isActive = i === current
          return (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && (
                <motion.div
                  className="h-px w-8 md:w-12"
                  style={{ background: isDone || isActive ? '#C9A84C' : '#1e2d4a' }}
                  initial={false}
                  animate={{ opacity: isDone || isActive ? 1 : 0.4 }}
                />
              )}
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  className="relative flex items-center justify-center rounded-full text-xs font-mono"
                  initial={false}
                  animate={{
                    background: isActive
                      ? 'linear-gradient(135deg, #C9A84C, #9a7a30)'
                      : isDone
                        ? 'rgba(201,168,76,0.2)'
                        : 'rgba(30,45,74,0.8)',
                    borderColor: isActive ? '#C9A84C' : isDone ? '#C9A84C' : '#1e2d4a',
                    boxShadow: isActive ? '0 0 16px rgba(201,168,76,0.5)' : 'none',
                    width: 28,
                    height: 28,
                    border: '1.5px solid',
                  }}
                >
                  {isDone ? (
                    <span style={{ color: '#C9A84C', fontSize: 12 }}>✓</span>
                  ) : (
                    <span style={{ color: isActive ? '#080c14' : '#8899bb', fontSize: 11, fontWeight: 700 }}>
                      {i + 1}
                    </span>
                  )}
                </motion.div>
                <span
                  className="hidden md:block font-display text-xs tracking-widest uppercase"
                  style={{ color: isActive ? '#C9A84C' : isDone ? '#8899bb' : '#3a4a6a', fontSize: '0.6rem' }}
                >
                  {label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
