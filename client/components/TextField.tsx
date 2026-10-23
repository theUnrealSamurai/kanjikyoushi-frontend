import { InputHTMLAttributes, useId } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
    label: string;
    error?: string | null;
}

/** A labelled input with an optional inline error message. */
export default function TextField({ label, error, className = "", ...rest }: Props) {
    const id = useId();
    return (
        <div className="mb-4">
            <label htmlFor={id} className="mb-1 block text-sm font-medium text-muted">{label}</label>
            <input
                id={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`field ${error ? "!border-danger" : ""} ${className}`}
                {...rest}
            />
            {error && <p id={`${id}-error`} className="mt-1 text-xs text-danger">{error}</p>}
        </div>
    );
}
