import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    to,
    href,
    onClick,
    className = '',
    icon,
    iconPosition = 'right',
    fullWidth = false,
    ...props
}) => {
    const classes = [
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && 'btn--full',
        icon && 'btn--icon',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const content = (
        <>
            {icon && iconPosition === 'left' && <span className="btn__icon">{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span className="btn__icon">{icon}</span>}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {content}
            </Link>
        );
    }

    if (href) {
        // Only web links open in a new tab; mailto:/tel: stay in place
        const external = /^https?:/.test(href);
        return (
            <a
                href={href}
                className={classes}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                {...props}
            >
                {content}
            </a>
        );
    }

    return (
        <button type="button" className={classes} onClick={onClick} {...props}>
            {content}
        </button>
    );
};

export default Button;
