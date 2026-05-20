import {
    GraduationCap,
    Globe,
    ArrowLeftRight,
    BookOpen,
} from 'lucide-react';

export const features = [
    {
        id: 'study-kg',
        icon: GraduationCap,
        titleKey: 'features.studyKgTitle',
        descriptionKey: 'features.studyKgDesc',
        linkTextKey: 'features.studyKgLink',
        linkPath: '/universities',
    },
    {
        id: 'study-abroad',
        icon: Globe,
        titleKey: 'features.studyAbroadTitle',
        descriptionKey: 'features.studyAbroadDesc',
        linkTextKey: 'features.studyAbroadLink',
        linkPath: '/universities?abroad=true',
    },
    {
        id: 'exchange',
        icon: ArrowLeftRight,
        titleKey: 'features.exchangeTitle',
        descriptionKey: 'features.exchangeDesc',
        linkTextKey: 'features.exchangeLink',
        linkPath: '/scholarships',
    },
    {
        id: 'ort-prep',
        icon: BookOpen,
        titleKey: 'features.ortTitle',
        descriptionKey: 'features.ortDesc',
        linkTextKey: 'features.ortLink',
        linkPath: '/ort-prep',
    },
];

export const howItWorks = [
    { step: 1, titleKey: 'howItWorks.step1Title', descriptionKey: 'howItWorks.step1Desc' },
    { step: 2, titleKey: 'howItWorks.step2Title', descriptionKey: 'howItWorks.step2Desc' },
    { step: 3, titleKey: 'howItWorks.step3Title', descriptionKey: 'howItWorks.step3Desc' },
];

export const universities = [
    {
        id: 'auca',
        name: 'AUCA',
        fullName: 'American University of Central Asia',
        location: 'Bishkek, Kyrgyzstan',
        score: '85+',
        logo: null,
        logoColor: '#1B6B4A',
        logoBg: '#E8F5EE',
        tags: ['Liberal Arts', 'English'],
        rating: 4.8,
    },
    {
        id: 'ktmu',
        name: 'KTMU',
        fullName: 'Manas',
        subtitle: 'KYRGYZ-TURKISH MANAS UNIVERSITY',
        location: 'Bishkek, Kyrgyzstan',
        score: '160+',
        logo: null,
        logoColor: '#374151',
        logoBg: '#F3F4F6',
        tags: ['Public', 'Free Tuition'],
        rating: 4.6,
    },
    {
        id: 'ala-too',
        name: 'Ala-Too',
        fullName: 'Ala-Too International University',
        subtitle: 'INTERNATIONAL UNIVERSITY',
        location: 'Bishkek, Kyrgyzstan',
        score: '120+',
        logo: null,
        logoColor: '#065F46',
        logoBg: '#ECFDF5',
        tags: ['Technology', 'International'],
        rating: 4.5,
    },
];
