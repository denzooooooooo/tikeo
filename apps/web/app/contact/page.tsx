

"use client";

import { useState } from 'react';
import { MailIcon } from '@tikeo/ui';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate send (no backend call here); show success
    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] mb-4">
            <MailIcon className="text-white" size={36} />
          </div>
          <h1 className="text-3xl font-bold">Contactez-nous</h1>
          <p className="text-gray-600 mt-2">Une question ? Une demande commerciale ou support — envoyez-nous un message.</p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
              />
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                type="email"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
              />
            </div>

            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message"
              rows={6}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7CFF] mb-4"
            />

            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Envoyer
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-100 text-green-800 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold">Message envoyé</h2>
            <p className="mt-2">Merci ! Nous vous répondrons dans les plus brefs délais.</p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 px-4 py-2 bg-white rounded-lg border hover:shadow"
            >
              Envoyer un autre message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
