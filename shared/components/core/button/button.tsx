import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { springs, transitions } from '@/shared/styles/motion/spring'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90',
        destructive: 'bg-red-500 text-zinc-50 hover:bg-red-500/90',
        outline: 'border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50',
        secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80',
        ghost: 'hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50',
        link: 'text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50',
        // Platform-specific variants
        hub: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-zinc-50 hover:opacity-90',
        ascenders: 'bg-orange-500 text-zinc-50 hover:bg-orange-500/90 dark:bg-orange-400 dark:text-zinc-900 dark:hover:bg-orange-400/90',
        neothinkers: 'bg-amber-500 text-zinc-50 hover:bg-amber-500/90 dark:bg-amber-400 dark:text-zinc-900 dark:hover:bg-amber-400/90',
        immortals: 'bg-red-500 text-zinc-50 hover:bg-red-500/90 dark:bg-red-400 dark:text-zinc-900 dark:hover:bg-red-400/90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
      motion: {
        none: '',
        subtle: 'transition-all duration-200 ease-in-out',
        spring: 'transform transition-transform',
        bounce: 'transform transition-transform',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      motion: 'subtle',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  feedback?: 'none' | 'haptic' | 'sound'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    motion: motionVariant = 'subtle',
    asChild = false,
    loading = false,
    icon,
    iconPosition = 'left',
    feedback = 'none',
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : motion.button

    // Motion variants based on button state
    const motionConfig = {
      initial: { scale: 1 },
      whileHover: motionVariant === 'spring' 
        ? { scale: 1.02, transition: springs.subtle }
        : motionVariant === 'bounce'
        ? { scale: 1.05, transition: springs.bouncy }
        : {},
      whileTap: motionVariant === 'spring' || motionVariant === 'bounce'
        ? { scale: 0.98, transition: springs.responsive }
        : {},
      transition: transitions.base,
    }

    // Handle haptic/sound feedback
    const handleFeedback = () => {
      if (feedback === 'haptic' && 'vibrate' in navigator) {
        navigator.vibrate(10)
      } else if (feedback === 'sound') {
        // Play subtle click sound
        const audio = new Audio('/sounds/click.mp3')
        audio.volume = 0.2
        audio.play()
      }
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, motion: motionVariant, className }),
          loading && 'opacity-80 cursor-wait'
        )}
        ref={ref}
        onClick={(e) => {
          handleFeedback()
          props.onClick?.(e)
        }}
        {...motionConfig}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <motion.div
              className="w-4 h-4 border-2 border-current rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <span>{children}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
          </div>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants } 