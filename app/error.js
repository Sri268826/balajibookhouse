'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', padding: '2rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Something went wrong!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We apologize for the inconvenience. Please try again.</p>
                <button
                    onClick={() => reset()}
                    className="btn btn-primary"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
