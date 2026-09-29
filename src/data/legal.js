// Plain-language legal pages. They describe the site as it actually works
// today: no server, no cookies, everything stored in the visitor's browser.
export const legalDocs = {
    terms: {
        title: 'Terms of Service',
        updated: 'September 2026',
        sections: [
            {
                heading: 'About BILGE',
                body: 'BILGE is an information platform that helps students in Kyrgyzstan explore universities, scholarships and ORT preparation. It is an early-stage project and is provided free of charge.',
            },
            {
                heading: 'Information accuracy',
                body: 'We collect university and scholarship information from official and public sources, but tuition, deadlines and requirements change every year. Always confirm details on the official website linked on each page before you apply. BILGE is not responsible for decisions made using this information.',
            },
            {
                heading: 'Accounts',
                body: 'Accounts are currently stored only in your own browser. Keep your device secure, and do not reuse a password you use elsewhere.',
            },
            {
                heading: 'Acceptable use',
                body: 'Do not misuse the site, attempt to disrupt it, or copy its content for commercial purposes without permission. University names, logos and photos belong to their respective owners and are shown for identification.',
            },
            {
                heading: 'Contact',
                body: 'Questions about these terms: hello@bilge.kg.',
            },
        ],
    },
    privacy: {
        title: 'Privacy Policy',
        updated: 'September 2026',
        sections: [
            {
                heading: 'What we store',
                body: 'BILGE does not currently run a server that collects personal data. Your language and theme choices, saved universities and scholarships, document checklists, practice-test results and local account are stored in your browser\'s localStorage on your device only.',
            },
            {
                heading: 'Passwords',
                body: 'Passwords for local accounts are never stored in plain text; only a SHA-256 digest is kept in your browser.',
            },
            {
                heading: 'Contact form',
                body: 'The contact form opens your own email app with the message pre-filled. We only receive what you choose to send.',
            },
            {
                heading: 'Deleting your data',
                body: 'Sign out and clear this site\'s data in your browser settings to remove everything BILGE stored on your device.',
            },
            {
                heading: 'External links',
                body: 'University and scholarship pages link to official websites, which have their own privacy policies.',
            },
        ],
    },
    cookies: {
        title: 'Cookie Policy',
        updated: 'September 2026',
        sections: [
            {
                heading: 'We do not use cookies',
                body: 'BILGE does not set tracking, advertising or analytics cookies.',
            },
            {
                heading: 'Local storage',
                body: 'To remember your preferences (language, light/dark theme), saved items and your local account, the site uses your browser\'s localStorage. This data never leaves your device.',
            },
            {
                heading: 'Third parties',
                body: 'Fonts are loaded from Google Fonts. External sites you open from BILGE may use their own cookies.',
            },
        ],
    },
};
