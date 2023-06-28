import cn from 'clsx';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  onTextChange?: (val: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, onTextChange, onChange, className, inputClassName, ...props }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onTextChange?.(value, e);
    onChange?.(e);
  }

  const classes = cn(
    "flex flex-col gap-1",
    className
  )

  const inputClasses = cn(
    "px-4 py-2 mt-2 bg-neutral-100 dark:bg-neutral-800 rounded-md",
    "outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-neutral-100 dark:focus:ring-offset-neutral-900 border border-transparent",
    inputClassName,
    {
      "border-neutral-200 dark:border-neutral-700": props.disabled,
    }
  )

  return (
    <div className={classes}>
      <label className="text-sm font-medium text-black dark:text-neutral-100">{label}</label>
      <input
        className={inputClasses}
        onChange={handleChange}
        {...props}
      />
    </div>
  )
}

export default Input;
