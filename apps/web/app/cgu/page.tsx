'use client';

import Link from 'next/link';
import { ShieldCheckIcon, FileIcon, MailIcon, CalendarIcon } from '@tikeo/ui';

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <FileIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Les règles et conditions d'utilisation de la plateforme Tikeo
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-purple-200">
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} />
              <span>Dernière mise à jour : 15 Janvier 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Table of Contents */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Table des matières</h2>
            <ol className="space-y-2 text-sm">
              <li><a href="#article-1" className="text-[#5B7CFF] hover:underline">1. Introduction</a></li>
              <li><a href="#article-2" className="text-[#5B7CFF] hover:underline">2. Définitions</a></li>
              <li><a href="#article-3" className="text-[#5B7CFF] hover:underline">3. Acceptation des CGU</a></li>
              <li><a href="#article-4" className="text-[#5B7CFF] hover:underline">4. Inscription et compte</a></li>
              <li><a href="#article-5" className="text-[#5B7CFF] hover:underline">5. Services proposés</a></li>
              <li><a href="#article-6" className="text-[#5B7CFF] hover:underline">6. Obligations des utilisateurs</a></li>
              <li><a href="#article-7" className="text-[#5B7CFF] hover:underline">7. Propriété intellectuelle</a></li>
              <li><a href="#article-8" className="text-[#5B7CFF] hover:underline">8. Responsabilité</a></li>
              <li><a href="#article-9" className="text-[#5B7CFF] hover:underline">9. Protection des données personnelles</a></li>
              <li><a href="#article-10" className="text-[#5B7CFF] hover:underline">10. Résiliation</a></li>
              <li><a href="#article-11" className="text-[#5B7CFF] hover:underline">11. Dispositions diverses</a></li>
            </ol>
          </div>

          {/* Article 1 */}
          <section id="article-1" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#5B7CFF] text-white rounded-lg flex items-center justify-center text-sm">1</span>
              Introduction
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>
                Les présentes Conditions Générales d'Utilisation (ci-après "CGU") ont pour objet de définir les modalités d'accès et d'utilisation de la plateforme Tikeo, proposée par la société Tikeo SAS, ci-après "l'Éditeur".
              </p>
              <p>
                Tikeo est une plateforme de gestion et de réservation d'événements qui permet aux Organisateurs de créer, promouvoir et vendre des billets pour leurs événements, et aux Participants de découvrir, réserver et participer à ces événements.
              </p>
              <p>
                L'utilisation de la plateforme Tikeo implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
              </p>
            </div>
          </section>

          {/* Article 2 */}
          <section id="article-2" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#5B7CFF] text-white rounded-lg flex items-center justify-center text-sm">2</span>
              Définitions
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>Pour l'interprétation des présentes CGU, les termes suivants auront la signification ci-dessous :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Plateforme :</strong> désigne le site web Tikeo et ses applications mobiles</li>
                <li><strong>Utilisateur :</strong> toute personne qui accède et utilise la Plateforme</li>
                <li><strong>Participant :</strong> un Utilisateur qui réserve des billets pour des événements</li>
                <li><strong>Organisateur :</strong> un Utilisateur qui crée et gère des événements sur la Plateforme</li>
                <li><strong>Événement :</strong> toute manifestation culturelle, sportive, musicale, professionnelle ou autre proposée par un Organisateur</li>
                <li><strong>Billet :</strong> titre d'accès numérique ou physique permettant l'accès à un Événement</li>
                <li><strong>Compte :</strong> espace personnel de l'Utilisateur sur la Plateforme</li>
              </ul>
            </div>
          </section>

          {/* Article 3 */}
          <section id="article-3" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#5B7CFF] text-white rounded-lg flex items-center justify-center text-sm">3</span>
              Acceptation des CGU
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>
                L'Utilisateur s'engage à lire attentivement les présentes CGU et à les accepter expressément avant toute utilisation de la Plateforme.
              </p>
              <p>
                L'acceptation des CGU est matérialisée par une case à cocher ou un bouton de validation. Cette acceptation constitue un contrat électronique bindsant l'Utilisateur aux présentes conditions.
              </p>
              <p>
                L'Éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur la Plateforme. L'utilisation de la Plateforme après modification vaut acceptation des nouvelles conditions.
              </p>
            </div>
          </section>

          {/* Article 4 */}
          <section id="article-4" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#5B7CFF] text-white rounded-lg flex items-center justify-center text-sm">4</span>
              Inscription et compte
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>
                Pour utiliser certains services de la Plateforme, l'Utilisateur doit créer un Compte. L'inscription est gratuite et nécessite :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Une adresse email valide</li>
                <li>Un mot de passe sécurisé</li>
                <li>Des informations personnelles exactes et à jour</li>
              </ul>
              <p className="mt-4">
                L'Utilisateur est responsable de la confidentialité de son mot de passe et de toutes activités realizadas sur son Compte. Il doit immédiatement signaler toute utilisation non autorisée de son compte.
              </p>
            </div>
          </section>

          {/* Article 5 */}
          <section id="article-5" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#5B7CFF] text-white rounded-lg flex items-center justify-center text-sm">5</span>
              Services proposés
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>Tikeo propose les services suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Pour les Participants :</strong> Recherche d'événements, réservation de billets, gestion des commandes, accès aux billets numériques</li>
                <li><strong>Pour les Organisateurs :</strong> Création d'événements, gestion des billets, promotion, analyse des ventes</li>
                <li><strong>Services communs :</strong> Gestion du profil, historique des transactions, support client</li>
              </ul>
              <p className="mt-4">
                Tikeo se réserve le droit de modifier, suspendre ou supprimer tout ou partie des services à tout moment, sans préavis ni indemnité.
              </p>
            </div>
          </section>

          {/* Article 6 */}
          <section id="article-6" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#5B7CFF] text-white rounded-lg flex items-center justify-center text-sm">6</span>
              Obligations des utilisateurs
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>L'Utilisateur s'engage à :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Utiliser la Plateforme conformément aux présentes CGU et aux lois en vigueur</li>
                <li>Fournir des informations véridiques, exactes et à jour</li>
                <li>Ne pas utiliser la Plateforme à des fins illicites ou frauduleuses</li>
                <li>Ne pas porter atteinte aux droits de tiers</li>
                <li>Ne pas perturber le fonctionnement de la Plateforme</li>
                <li>Ne pas procéder à des opérations de scraping ou d'extraction de données</li>
              </ul>
              <p className="mt-4">
                En cas de non-respect de ces obligations, Tikeo se réserve le droit de suspendre ou supprimer le Compte de l'Utilisateur, sans préjudice de toute action en justice.
              </p>
            </div>
          </section>

          {/* Article 7 */}
          <section id="article-7" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#5B7CFF] text-white rounded-lg flex items-center justify-center text-sm">7</span>
              Propriété intellectuelle
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>
                La Plateforme Tikeo et l'ensemble de son contenu (textes, images, logos, vidéos, sons, logiciels, etc.) sont protégés par les droits de propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments de la Plateforme est interdite sans autorisation écrite préalable de Tikeo.
              </p>
              <p>
                L'Utilisateur reste propriétaire du contenu qu'il publie sur la Plateforme (textes, images, etc.) et accorde à Tikeo une licence non exclusive pour l'utiliser dans le cadre du fonctionnement de la plateforme.
              </p>
            </div>
          </section>

          {/* Article 8 */}
          <section id="article-8" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#5B7CFF] text-white rounded-lg flex items-center justify-center text-sm">8</span>
              Responsabilité
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>
                Tikeo s'efforce de fournir des informations exactes et à jour sur les événements proposés. Toutefois, Tikeo ne peut être tenu responsable des erreurs, omissions ou inexactitudes concernant les informations fournies par les Organisateurs.
              </p>
              <p>
                La responsabilité de Tikeo ne pourra être engagée en cas de force majeure, de faute de l'Utilisateur ou de tiers, ou de problèmes techniques indépendants de sa volonté.
              </p>
              <p>
                Le Participant est invité à vérifier les informations relatives à l'événement (date, lieu, horaire) directement auprès de l'Organisateur ou sur le lieu de l'événement.
              </p>
            </div>
          </section>

          {/* Article 9 */}
          <section id="article-9" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#5B7CFF] text-white rounded-lg flex items-center justify-center text-sm">9</span>
              Protection des données personnelles
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>
                Tikeo collecte et traite les données personnelles des Utilisateurs conformément à la réglementation en vigueur (RGPD) et à sa Politique de Confidentialité.
              </p>
              <p>
                Les données collectées incluent notamment : nom, prénom, adresse email, numéro de téléphone, historique de commandes, données de paiement.
              </p>
              <p>
                L'Utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition sur ses données personnelles. Il peut exercer ces droits en contactant le support client ou via les paramètres de son Compte.
              </p>
              <p>
                Pour plus d'informations, veuillez consulter notre <Link href="/privacy" className="text-[#5B7CFF] hover:underline">Politique de Confidentialité</Link>.
              </p>
            </div>
          </section>

          {/* Article 10 */}
          <section id="article-10" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#5B7CFF] text-white rounded-lg flex items-center justify-center text-sm">10</span>
              Résiliation
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>
                L'Utilisateur peut résilier son Compte à tout moment en contactant le support client ou via les paramètres de son Compte.
              </p>
              <p>
                Tikeo se réserve le droit de suspendre ou supprimer immédiatement le Compte d'un Utilisateur en cas de :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violation des présentes CGU</li>
                <li>Utilisation frauduleuse de la Plateforme</li>
                <li>Comportement contraire aux bonnes mœurs</li>
                <li>Inactivité du Compte pendant une période prolongée</li>
              </ul>
            </div>
          </section>

          {/* Article 11 */}
          <section id="article-11" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#5B7CFF] text-white rounded-lg flex items-center justify-center text-sm">11</span>
              Dispositions diverses
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>
                Les présentes CGU sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>
              <p>
                Si une disposition des présentes CGU est déclarée nulle ou inapplicable, les autres dispositions demeurent en vigueur.
              </p>
              <p>
                Le fait pour Tikeo de ne pas faire valoir un droit ou une disposition des présentes CGU ne constitue pas une renonciation à ce droit ou à cette disposition.
              </p>
            </div>
          </section>

          {/* Contact */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mt-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MailIcon className="text-[#5B7CFF]" size={20} />
              Questions sur ces CGU ?
            </h3>
            <p className="text-gray-600 mb-4">
              Pour toute question concernant les présentes Conditions Générales d'Utilisation, n'hésitez pas à nous contacter.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-medium hover:bg-[#7B61FF] transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

