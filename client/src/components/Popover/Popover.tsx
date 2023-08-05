import { FloatingPortal, Placement, arrow, offset, shift, useFloating } from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ElementType, useRef, useState } from 'react'

interface PropsPopover {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initialOpen?: boolean
  placement?: Placement
  offsetInput?: number
  isArrow?: boolean
}

function Popover({
  children,
  renderPopover,
  className,
  initialOpen,
  placement,
  offsetInput,
  isArrow = true
}: PropsPopover) {
  const [open, setOpen] = useState(initialOpen || false)
  const arrowRef = useRef<HTMLElement>(null)
  const { x, y, reference, floating, strategy, middlewareData } = useFloating({
    middleware: [offset(offsetInput || 4), shift(), arrow({ element: arrowRef })],
    placement: placement
  })
  const showPopover = () => {
    setOpen(true)
  }
  const hidePopover = () => {
    setOpen(false)
  }
  return (
    <div className={className} ref={reference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}
      <FloatingPortal>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={floating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.25 }}
            >
              {isArrow && (
                <span
                  ref={arrowRef}
                  className='absolute z-50 translate-y-[-95%] border-[11px] border-x-transparent border-b-white border-t-transparent'
                  style={{
                    left: middlewareData.arrow?.x,
                    top: middlewareData.arrow?.y
                  }}
                ></span>
              )}
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
  )
}

export default Popover
