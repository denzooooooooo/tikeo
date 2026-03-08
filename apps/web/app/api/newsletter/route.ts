import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface NewsletterEntry {
  name: string;
  email: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'apps/web/data');
const DATA_FILE = path.join(DATA_DIR, 'newsletter-subscribers.json');

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf-8');
  }
}

async function readSubscribers(): Promise<NewsletterEntry[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeSubscribers(subscribers: NewsletterEntry[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!name || name.length < 2) {
      return NextResponse.json({ message: 'Le prénom est requis (min 2 caractères).' }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ message: 'Adresse email invalide.' }, { status: 400 });
    }

    const subscribers = await readSubscribers();
    const alreadyExists = subscribers.some((entry) => entry.email === email);

    if (alreadyExists) {
      return NextResponse.json({ message: 'Cet email est déjà inscrit à la newsletter.' }, { status: 409 });
    }

    subscribers.push({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    await writeSubscribers(subscribers);

    return NextResponse.json({ message: 'Inscription newsletter réussie.' }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Erreur serveur lors de l’inscription newsletter.' }, { status: 500 });
  }
}
