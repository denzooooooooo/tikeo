import { NextRequest, NextResponse } from 'next/server';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (name.length < 2) {
      return NextResponse.json({ message: 'Le prénom est requis (min 2 caractères).' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: 'Adresse email invalide.' }, { status: 400 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { message: 'Configuration API manquante (NEXT_PUBLIC_API_URL).' },
        { status: 500 },
      );
    }

    const response = await fetch(`${apiUrl}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message || 'Impossible de finaliser l’inscription newsletter.' },
        { status: response.status || 500 },
      );
    }

    return NextResponse.json(
      { message: data?.message || 'Inscription newsletter réussie.' },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: 'Erreur réseau/API lors de l’inscription newsletter.' },
      { status: 502 },
    );
  }
}
