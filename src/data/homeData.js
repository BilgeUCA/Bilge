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
