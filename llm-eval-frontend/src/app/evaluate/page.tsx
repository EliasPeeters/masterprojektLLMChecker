'use client';

import { useEffect, useState } from 'react';

type Category = 'EXPENSE' | 'LIST_ITEM' | 'TASK'
type ItemTypes = 'pet' | 'priceSensitivity' | 'diy' | 'food' | 'ecoConsciousness';
// pet : 0 kein Haustier, 1 Haustier
// priceSensitivity : 0 preisbewusst, 1 neutral, 2 nicht preisbewusst
// diy : 0 DIY, 1 nicht DIY
// food : 0 neutral, 1 Essen bestellt
// ecoConsciousness : 0 nicht umweltbewusst, 1 neutral, 2 umweltbewusst


type EvaluationItem = {
    id: string;
    type: ItemTypes;
    text: string;
    llmResult: string;
    category: Category;
};


export default function EvaluatePage() {
    const [item, setItem] = useState<EvaluationItem | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchNext = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://masterbackend.eliaspeeters.de/api/evaluation/next');

            if (!res.ok) {
                throw new Error(`API-Fehler: ${res.status}`);
            }

            const data = await res.json();
            console.log('FETCHED ITEM', data);
            setItem(data);
        } catch (error) {
            console.error('Fehler beim Laden:', error);
            alert('Fehler: ' + (error instanceof Error ? error.message : 'Unbekannt'));
            setItem(null);
        }
        setLoading(false);
    };

    const submitAnswer = async (answer: string) => {
        const convertAnswer = (answer: string): string => {
            if (item?.type === 'priceSensitivity') {
                if (answer === 'Ja') return "0"; // Preisbewusst oder Umweltbewusst
                if (answer === 'Neutral') return "1"; // Neutral
                if (answer === 'Nein') return "2"; // Nicht preisbewusst oder nicht umweltbewusst
                return "-1"; // Unbekannt
            } else if (item?.type === 'ecoConsciousness') {
                if (answer === 'Ja') return "2"; // Preisbewusst oder Umweltbewusst
                if (answer === 'Neutral') return "1"; // Neutral
                if (answer === 'Nein') return "0"; // Nicht preisbewusst oder nicht umweltbewusst
                return "-1"; // Unbekannt
            }
            else {
                if (answer === 'Ja') return "1"; // Ja
                if (answer === 'Nein') return "0"; // Nein
                return "-1"; // Unbekannt
            }
        }

        if (!item) return;

        await fetch('https://masterbackend.eliaspeeters.de/api/evaluation/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                itemId: item.id,
                answer: convertAnswer(answer),
            }),
        });

        fetchNext();
    };

    useEffect(() => {
        fetchNext();
    }, []);

    if (loading) return <p></p>;
    if (!item) return <p>Kein Eintrag gefunden.</p>;

    const getPromptText = () => {
        const labelMap: Record<ItemTypes, string> = {
            pet: 'Handelt es sich bei {subject} um eine Ausgabe für ein Haustier?',
            priceSensitivity: 'Ist {subject} eine preisbewusste Ausgabe?',
            diy: 'Geht es bei {subject} um ein DIY-Vorhaben?',
            food: 'Wurde bei {subject} Essen bestellt?',
            ecoConsciousness: 'Ist {subject} eine umweltbewusste Entscheidung?',
        };

        const subjectMap: Record<Category, string> = {
            EXPENSE: 'diese Ausgabe',
            LIST_ITEM: 'diesen Einkaufslisteneintrag',
            TASK: 'diese Aufgabe',
        };

        const baseText = labelMap[item!.type];
        const subject = subjectMap[item!.category];

        return baseText.replace('{subject}', subject);
    };

    const getOptions = (type: ItemTypes) => {
        const multiOptionsTypes: ItemTypes[] = ['priceSensitivity', 'ecoConsciousness'];
        return multiOptionsTypes.includes(type) ? ['Ja', 'Neutral', 'Nein'] : ['Ja', 'Nein'];
    };

    return (
        <div style={{
            padding: '32px 16px',
            maxWidth: 600,
            margin: 'auto',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <h2>{getPromptText()}</h2>
            <p style={{ fontSize: 24 }}>{item.text}</p>

            <div style={{ marginTop: 24 }}>
                {getOptions(item.type).map((opt) => (
                    <button
                        key={opt}
                        onClick={() => submitAnswer(opt)}
                        style={{
                            margin: '8px',
                            padding: '12px 24px',
                            fontSize: 16,
                            borderRadius: 8,
                            border: '1px solid #ccc',
                            backgroundColor: '#f0f0f0',
                            cursor: 'pointer'
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}