'use client';

import { useEffect, useState } from 'react';

type EvaluationItem = {
    id: string;
    type: string;
    text: string;
    llmResult: string;
};

const OPTIONS = ['Ja', 'Neutral', 'Nein'];

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
        if (!item) return;

        await fetch('/api/evaluation/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                itemId: item.id,
                question: 'preissensibel',
                answer,
                user: 'testuser',
            }),
        });

        fetchNext();
    };

    useEffect(() => {
        fetchNext();
    }, []);

    if (loading) return <p>Lade...</p>;
    if (!item) return <p>Kein Eintrag gefunden.</p>;

    return (
        <div style={{ padding: 32, maxWidth: 600, margin: 'auto' }}>
            <h2>Ist dieser Eintrag preissensibel?</h2>
            <p style={{ fontSize: 24 }}>Frage: {item.text}</p>
            <p style={{ fontSize: 18, color: 'gray' }}>LLM-Vorschlag: {item.llmResult}</p>

            <div style={{ marginTop: 24 }}>
                {OPTIONS.map((opt) => (
                    <button key={opt} onClick={() => submitAnswer(opt)} style={{ marginRight: 16 }}>
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}