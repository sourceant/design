import { cva, type VariantProps } from 'class-variance-authority'

/** What every form control looks like, at the sizes a button comes in.
 *
 * A select, an input and a button standing next to each other were three
 * different heights, because each was written out by hand with whatever padding
 * looked right on its own. They share one scale here instead, and the heights
 * are the button's: a row of controls is only ever as tidy as its tallest
 * member agrees to be.
 *
 * A textarea takes the padding and the type size but not the height, which its
 * rows decide.
 */
export const controlVariants = cva(
  [
    'w-full rounded-md border bg-muted/50 text-foreground outline-none transition-colors',
    'placeholder:text-muted-foreground focus:border-primary/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-9 px-3 text-sm',
        lg: 'h-11 px-4 text-base',
      },
      invalid: {
        true: 'border-destructive/60 focus:border-destructive',
        false: '',
      },
    },
    defaultVariants: { size: 'default', invalid: false },
  },
)

/** The same, for a control whose height comes from its content. */
export const roomyVariants = cva(
  [
    'w-full resize-y rounded-md border bg-muted/50 text-foreground outline-none transition-colors',
    'placeholder:text-muted-foreground focus:border-primary/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'px-3 py-1.5 text-xs',
        default: 'px-3 py-2 text-sm',
        lg: 'px-4 py-2.5 text-base',
      },
      invalid: {
        true: 'border-destructive/60 focus:border-destructive',
        false: '',
      },
    },
    defaultVariants: { size: 'default', invalid: false },
  },
)

export type ControlSize = NonNullable<VariantProps<typeof controlVariants>['size']>
