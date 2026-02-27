"use client";

import { useState } from 'react';
import { MailIcon, PhoneIcon, ClockIcon, LoadingSpinner } from '@tikeo/ui';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('support');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Le nom est requis";
    if (!email.trim()) e.email = "L'email est requis";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Email invalide";
    if (!message.trim() || message.trim().length < 10) e.message = 'Le message doit faire au moins 10 caractères';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Simulate API call — replace with real endpoint when available
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      // keep a small delay before clearing fields for better UX
      setTimeout(() => {
        setName('');
        setEmail('');
        setSubject('');
        setCategory('support');
        setMessage('');
      }, 600);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] mb-4">
                <MailIcon className="text-white" size={36} />
              </div>
              <h1 className="text-3xl font-bold">Contactez-nous</h1>
              <p className="text-gray-600 mt-2">Une question ? Commerciale ou support — envoyez-nous un message et nous répondrons rapidement.</p>
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8" aria-label="Formulaire de contact">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Nom</span>
                    <input
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'error-name' : undefined}
                      required
                      value={name}
                      onChange={(ev) => setName(ev.target.value)}
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
                    />
                    {errors.name && <span id="error-name" className="text-sm text-red-600 mt-1">{errors.name}</span>}
                  </label>

                  <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <input
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'error-email' : undefined}
                      required
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                      placeholder="votre@exemple.com"
                      type="email"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
                    />
                    {errors.email && <span id="error-email" className="text-sm text-red-600 mt-1">{errors.email}</span>}
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <label className="flex flex-col md:col-span-2">
                    <span className="text-sm font-medium text-gray-700">Sujet (facultatif)</span>
                    <input
                      value={subject}
                      onChange={(ev) => setSubject(ev.target.value)}
                      placeholder="Par ex. Problème de paiement"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Catégorie</span>
                    <select
                      value={category}
                      onChange={(ev) => setCategory(ev.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
                    >
                      <option value="support">Support</option>
                      <option value="sales">Commercial</option>
                      <option value="press">Presse</option>
                      <option value="bug">Signaler un bug</option>
                    </select>
                  </label>
                </div>

                <label className="flex flex-col mb-4">
                  <span className="text-sm font-medium text-gray-700">Message</span>
                  <textarea
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'error-message' : undefined}
                    required
                    value={message}
                    onChange={(ev) => setMessage(ev.target.value)}
                    placeholder="Expliquez votre demande en détail"
                    rows={6}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7CFF] mb-2"
                  />
                  {errors.message && <span id="error-message" className="text-sm text-red-600">{errors.message}</span>}
                </label>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Nous répondons généralement en moins de 48h.</div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-60"
                    >
                      {loading ? <LoadingSpinner size="sm" color="white" /> : 'Envoyer'}
                    </button>
                  </div>
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

          <aside className="space-y-6">
            <div className="p-6 rounded-2xl border bg-gradient-to-br from-white to-[#F7F9FF]">
              <h3 className="text-lg font-semibold mb-3">Autres moyens de contact</h3>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#EFF3FF] rounded-lg">
                  <PhoneIcon size={20} className="text-[#4C6FFF]" />
                </div>
                <div>
                  <div className="font-medium">Téléphone</div>
                  <div className="text-sm text-gray-600">+33 1 23 45 67 89</div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3">
                <div className="p-2 bg-[#EFF3FF] rounded-lg">
                  <ClockIcon size={20} className="text-[#7B61FF]" />
                </div>
                <div>
                  <div className="font-medium">Horaires</div>
                  <div className="text-sm text-gray-600">Lun–Ven, 9:00–18:00 CET</div>
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-semibold mb-2">Besoin d'une réponse plus rapide ?</h4>
                <p className="text-sm text-gray-600">Consultez notre <a href="/help" className="text-[#5B7CFF] hover:underline">centre d'aide</a> ou la <a href="/faq" className="text-[#5B7CFF] hover:underline">FAQ</a>.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border bg-white">
              <h4 className="text-sm font-semibold mb-2">Adresse</h4>
              <p className="text-sm text-gray-600">12 rue Exemple, 75001 Paris, France</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
