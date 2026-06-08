import { AnimatePresence, motion } from 'framer-motion'

interface SlideBackdropProps {
  imageUrl: string
  slideId: string
}

export default function SlideBackdrop({ imageUrl, slideId }: SlideBackdropProps) {
  return (
    <div className="slide-backdrop absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slideId}
          className="slide-backdrop__layer"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={imageUrl}
            alt=""
            draggable={false}
            className="slide-backdrop__image"
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden'
            }}
          />
        </motion.div>
      </AnimatePresence>
      <div className="slide-backdrop__vignette" />
    </div>
  )
}
