// BILGE horizontal logo (Book Peaks + wordmark), inlined so it follows the theme.
// Geometry comes from brand/logo/master/bilge-horizontal.svg; colours come from
// the --logo-* tokens in globals.css (reversed colours in dark mode).
const BrandLogo = ({ className = '', title = 'BILGE' }) => (
    <svg
        className={className}
        viewBox="0 27 741.31 219.5"
        role="img"
        aria-label={title}
        xmlns="http://www.w3.org/2000/svg"
    >
        <g transform="translate(-18.92,-14.62) scale(0.95)">
            <path fill="var(--logo-page)" d="M80,44L124,120.21L124,207.87L20,180ZM176,44L132,120.21L132,207.87L236,180Z" />
            <circle fill="var(--logo-sun)" cx="128" cy="67.14" r="18" />
        </g>
        <g fill="var(--logo-ink)" transform="translate(226.31,0)">
            <path d="M30,30h26v150h-26Z" />
            <path fillRule="evenodd" d="M30,125a56.5,56.5 0 1,0 113,0a56.5,56.5 0 1,0 -113,0ZM56,125a30.5,30.5 0 1,0 61,0a30.5,30.5 0 1,0 -61,0Z" />
            <path d="M165,70h26v110h-26Z" />
            <path d="M163.5,44.5a14.5,14.5 0 1,0 29,0a14.5,14.5 0 1,0 -29,0Z" />
            <path d="M219,30h26v150h-26Z" />
            <path fillRule="evenodd" d="M267,125a56.5,56.5 0 1,0 113,0a56.5,56.5 0 1,0 -113,0ZM293,125a30.5,30.5 0 1,0 61,0a30.5,30.5 0 1,0 -61,0Z" />
            <path d="M354,70h26v120h-26Z" />
            <path d="M379.86,186.06A56.5,56.5 0 0,1 270.41,209.32L294.84,200.43A30.5,30.5 0 0,0 353.93,187.87Z" />
            <path d="M515,125A56.5,56.5 0 1,0 498.45,164.95L480.07,146.57A30.5,30.5 0 1,1 489,125Z" />
            <path d="M415,112H513.48A56.5,56.5 0 0,1 513.48,138H415Z" />
        </g>
    </svg>
);

export default BrandLogo;
