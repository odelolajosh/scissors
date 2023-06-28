import cn from 'clsx';

type SpinnerProps = {
  light?: boolean;
}

export default function Spinner({ light = true }: SpinnerProps) {
  const classes = cn('br-spinner', {
    'br-spinner--dark-bg': !light,
  })

  return (
    <span className={classes} />
  )
}