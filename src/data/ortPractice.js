// localStorage key for saved practice results (Progress tab, account page)
export const ORT_RESULTS_KEY = 'bilge.ort.results';

// Short ORT-style diagnostic. Question formats mirror the ORT main test
// (math: arithmetic, algebra, quantitative comparison; verbal: analogies,
// vocabulary, sentence completion, reading) but the items are our own.
export const ortQuestions = [
    {
        id: 'm1',
        subject: 'math',
        prompt: 'If 3x − 7 = 11, what is the value of x?',
        options: ['4', '5', '6', '7'],
        answer: 2,
        explanation: '3x = 11 + 7 = 18, so x = 18 ÷ 3 = 6.',
    },
    {
        id: 'm2',
        subject: 'math',
        prompt: 'A jacket costs 2,400 som after a 20% discount. What was the original price?',
        options: ['2,880 som', '3,000 som', '2,600 som', '3,200 som'],
        answer: 1,
        explanation: '2,400 is 80% of the original price: 2,400 ÷ 0.8 = 3,000 som.',
    },
    {
        id: 'm3',
        subject: 'math',
        prompt: 'The average of 4, 8, 10 and x is 9. What is x?',
        options: ['11', '12', '13', '14'],
        answer: 3,
        explanation: 'The four numbers must add up to 4 × 9 = 36, so x = 36 − 22 = 14.',
    },
    {
        id: 'm4',
        subject: 'math',
        prompt: 'Compare the two quantities. Column A: 2⁵. Column B: 5².',
        options: ['A is greater', 'B is greater', 'They are equal', 'Cannot be determined'],
        answer: 0,
        explanation: '2⁵ = 32 and 5² = 25, so column A is greater.',
    },
    {
        id: 'm5',
        subject: 'math',
        prompt: 'A bus travels 180 km in 2.5 hours. What is its average speed?',
        options: ['65 km/h', '70 km/h', '72 km/h', '75 km/h'],
        answer: 2,
        explanation: 'Speed = distance ÷ time = 180 ÷ 2.5 = 72 km/h.',
    },
    {
        id: 'v1',
        subject: 'verbal',
        prompt: 'BOOK : LIBRARY  as  PAINTING : ?',
        options: ['Artist', 'Museum', 'Frame', 'Colour'],
        answer: 1,
        explanation: 'Books are kept and shown in a library; paintings are kept and shown in a museum.',
    },
    {
        id: 'v2',
        subject: 'verbal',
        prompt: 'HOT : COLD  as  ANCIENT : ?',
        options: ['Old', 'Modern', 'Historic', 'Warm'],
        answer: 1,
        explanation: 'The pair are opposites; the opposite of "ancient" is "modern".',
    },
    {
        id: 'v3',
        subject: 'verbal',
        prompt: 'Choose the word closest in meaning to "scarce".',
        options: ['Plentiful', 'Rare', 'Cheap', 'Careful'],
        answer: 1,
        explanation: '"Scarce" means in short supply, which is closest to "rare".',
    },
    {
        id: 'v4',
        subject: 'verbal',
        prompt: 'Complete the sentence: "Although the path was ___, the hikers reached the summit before noon."',
        options: ['steep', 'easy', 'short', 'flat'],
        answer: 0,
        explanation: '"Although" signals a contrast: reaching the top early is surprising only if the path was difficult (steep).',
    },
    {
        id: 'v5',
        subject: 'verbal',
        prompt: '"Naryn is one of the coldest regions of Kyrgyzstan, yet its high pastures make it a centre of livestock farming." Which statement follows from the text?',
        options: [
            'Naryn has no agriculture.',
            'The cold climate prevents all farming in Naryn.',
            'Pastures support livestock farming in Naryn.',
            'Naryn is the warmest region of Kyrgyzstan.',
        ],
        answer: 2,
        explanation: 'The text says the pastures make Naryn a centre of livestock farming despite the cold.',
    },
];
