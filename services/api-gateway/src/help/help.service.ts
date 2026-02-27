import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface HelpArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

@Injectable()
export class HelpService {
  constructor(private prisma: PrismaService) {}

  async getHelpCategories() {
    // Return static categories for now
    return [
      {
        id: 'getting-started',
        name: 'Commencer avec Tikeo',
        description: 'Tout ce que vous devez savoir pour débuter',
        icon: '🚀',
        articleCount: 12,
      },
      {
        id: 'tickets',
        name: 'Billets & Réservations',
        description: 'Acheter, vendre et gérer vos billets',
        icon: '🎫',
        articleCount: 24,
      },
      {
        id: 'organizers',
        name: 'Organisateurs',
        description: 'Créer et gérer vos événements',
        icon: '🎪',
        articleCount: 32,
      },
      {
        id: 'payments',
        name: 'Paiements & Remboursements',
        description: 'Moyens de paiement et politique de remboursement',
        icon: '💳',
        articleCount: 15,
      },
      {
        id: 'account',
        name: 'Compte & Sécurité',
        description: 'Gérer votre compte et protéger vos données',
        icon: '🔐',
        articleCount: 18,
      },
      {
        id: 'technical',
        name: 'Problèmes Techniques',
        description: 'Résoudre les erreurs et dysfonctionnements',
        icon: '🔧',
        articleCount: 21,
      },
    ];
  }

  async getFAQs(category?: string): Promise<FAQItem[]> {
    // Return static FAQs for now
    const faqs: FAQItem[] = [
      {
        id: '1',
        question: 'Comment acheter des billets sur Tikeo ?',
        answer: `Pour acheter des billets sur Tikeo, suivez ces étapes simples :

1. Recherchez l'événement qui vous intéresse en utilisant notre moteur de recherche
2. Sélectionnez la date et le nombre de billets souhaités
3. Choisissez vos places sur le plan de salle (si applicable)
4. Créez un compte ou connectez-vous
5. Sélectionnez votre mode de paiement
6. Validez votre commande et recevez vos billets par email

Vos billets vous seront envoyés instantanément par email et seront également disponibles dans votre compte Tikeo.`,
        category: 'tickets',
        helpful: 245,
        notHelpful: 12,
      },
      {
        id: '2',
        question: 'Puis-je me faire rembourser mes billets ?',
        answer: `Notre politique de remboursement dépend de l'événement et de l'organisateur :

**Événements éligibles au remboursement :**
- Remboursement possible jusqu'à 7 jours après l'achat
- Événements annulés par l'organisateur
- Événements reportés avec impossibilité de participer

**Événements non éligibles :**
- Billets achetés moins de 48h avant l'événement
- Événements avec politique "pas de remboursement"
- Billets personnalisés ou transférés

Pour demander un remboursement, contactez notre équipe support avec votre numéro de commande.`,
        category: 'payments',
        helpful: 189,
        notHelpful: 23,
      },
      {
        id: '3',
        question: 'Comment devenir organisateur sur Tikeo ?',
        answer: `Devenir organisateur sur Tikeo est simple et gratuit :

**Conditions préalables :**
- Avoir un compte Tikeo actif
- Être majeur (18 ans et plus)
- Disposer d'un moyen de paiement valide

**Étapes d'inscription :**
1. Connectez-vous à votre compte
2. Accédez à "Devenir organisateur" dans votre tableau de bord
3. Remplissez le formulaire avec vos informations professionnelles
4. Soumettez une pièce d'identité
5. Attendez la validation (48h maximum)

Une fois approuvé, vous pourrez créer et gérer vos événements directement depuis votre dashboard.`,
        category: 'organizers',
        helpful: 156,
        notHelpful: 8,
      },
      {
        id: '4',
        question: 'Mes billets sont-ils échangeables ?',
        answer: `Oui, les billets Tikeo sont échangeables sous certaines conditions :

**Échanges possibles :**
- Changement de date pour le même événement
- Transfert à une autre personne (gratuit)
- Mise à niveau vers une catégorie supérieure (avec supplément)

**Restrictions :**
- L'échange doit être effectué au moins 24h avant l'événement
- Certains événements ont des billets non échangeables
- Les échanges sont soumis à disponibilité

Pour effectuer un échange, rendez-vous dans "Mes commandes" et sélectionnez "Échanger".`,
        category: 'tickets',
        helpful: 134,
        notHelpful: 15,
      },
      {
        id: '5',
        question: 'Comment sécuriser mon compte Tikeo ?',
        answer: `Nous vous recommandons ces mesures de sécurité pour protéger votre compte :

**Sécurité obligatoire :**
- Utilisez un mot de passe unique (12+ caractères)
- Activez l'authentification à deux facteurs (2FA)

**Sécurité recommandée :**
- Ne partagez jamais vos identifiants
- Déconnexion après utilisation sur appareil partagé
- Vérifiez régulièrement les connexions actives
- Utilisez un email valide pour la récupération

**Signes d'alerte :**
- Connexions suspectes
- Modifications non autorisées
- Emails de confirmation non sollicités

En cas de doute, contactez immédiatement notre équipe support.`,
        category: 'account',
        helpful: 98,
        notHelpful: 5,
      },
      {
        id: '6',
        question: 'Quels moyens de paiement sont acceptés ?',
        answer: `Tikeo accepte plusieurs moyens de paiement :

**Cartes bancaires :**
- Visa
- Mastercard
- American Express
- Carte Bleue

**Portefeuilles numériques :**
- Apple Pay
- Google Pay
- PayPal

**Paiement fractionné :**
- Klarna (3x sans frais)
- Alma (jusqu'à 12x)

** Autres options :**
- Virement bancaire (commandes professionnelles)
- Chèque (événements partenaires)

Tous les paiements sont sécurisés par cryptage SSL.`,
        category: 'payments',
        helpful: 167,
        notHelpful: 11,
      },
      {
        id: '7',
        question: 'Comment ajouter mes événements sur Tikeo ?',
        answer: `Pour créer votre premier événement sur Tikeo :

**Prérequis :**
- Compte organisateur validé
- Informations sur l'événement (date, lieu, prix)
- Images promotionnelles

**Processus de création :**

1. **Informations générales**
   - Titre et description
   - Catégorie et sous-catégorie
   - Tags et mots-clés

2. **Date et lieu**
   - Date et heure de l'événement
   - Adresse complète
   - Capacité maximale

3. **Billets**
   - Types de billets (VIP, Standard, etc.)
   - Prix et quantités
   - Dates de vente (early bird, regular)

4. **Médias**
   - Image de couverture
   - Galerie photos
   - Vidéo (optionnel)

5. **Publication**
   - Aperçu avant publication
   - Validation finale
   - Publication immédiate ou programmée`,
        category: 'organizers',
        helpful: 203,
        notHelpful: 18,
      },
      {
        id: '8',
        question: 'Que faire si mon billet ne fonctionne pas ?',
        answer: `Si votre billet ne fonctionne pas, suivez ces étapes :

**Vérifications préliminaires :**
1. Vérifiez que le QR code n'est pas endommagé
2. Assurez-vous d'avoir la dernière version de l'app
3. Vérifiez votre connexion internet

**Problèmes courants :**

**QR code non reconnu :**
- Nettoyez l'écran de votre téléphone
- Augmentez la luminosité
- Évitez les reflets

**Billet absent de l'app :**
- Vérifiez votre email de confirmation
- Connectez-vous à votre compte Tikeo
- Téléchargez le PDF de secours

**Erreur "Billet déjà utilisé" :**
- Contactez immédiatement le support
- Un supervisor résoudra le problème

**Contact urgent :**
- Chat en direct : 24h/24, 7j/7
- Email : support@tikeo.com
- Téléphone : +33 1 23 45 67 89`,
        category: 'technical',
        helpful: 145,
        notHelpful: 22,
      },
    ];

    if (category) {
      return faqs.filter((faq) => faq.category === category);
    }

    return faqs;
  }

  async getArticles(category?: string, limit = 10): Promise<HelpArticle[]> {
    // Return static articles for now
    const articles: HelpArticle[] = [
      {
        id: '1',
        title: 'Guide Complet pour Acheter vos Billets',
        slug: 'guide-achat-billets',
        content: `Ce guide vous explique étape par étape comment acheter vos billets sur Tikeo...`,
        category: 'tickets',
        tags: ['acheter', 'billets', 'débutant'],
        views: 15234,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-20'),
      },
      {
        id: '2',
        title: 'Créer un Événement qui Attire du Monde',
        slug: 'creer-evenement-reussite',
        content: `Découvrez les secrets pour créer un événement inoubliable...`,
        category: 'organizers',
        tags: ['événement', 'marketing', 'organiser'],
        views: 8934,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-02-15'),
      },
      {
        id: '3',
        title: 'Sécuriser votre Compte Tikeo',
        slug: 'securiser-compte',
        content: `Protégez votre compte avec ces conseils de sécurité...`,
        category: 'account',
        tags: ['sécurité', 'mot de passe', '2FA'],
        views: 12456,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-28'),
      },
    ];

    if (category) {
      return articles.filter((article) => article.category === category).slice(0, limit);
    }

    return articles.slice(0, limit);
  }

  async getArticleBySlug(slug: string): Promise<HelpArticle | null> {
    const articles = await this.getArticles();
    return articles.find((a) => a.slug === slug) || null;
  }

  async searchArticles(query: string): Promise<HelpArticle[]> {
    const articles = await this.getArticles();
    const lowerQuery = query.toLowerCase();

    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.content.toLowerCase().includes(lowerQuery) ||
        article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
  }

  async submitSupportTicket(data: {
    userId: string;
    subject: string;
    message: string;
    category: string;
    orderId?: string;
  }) {
    // Create support ticket in database
    const ticket = await this.prisma.supportTicket.create({
      data: {
        userId: data.userId,
        subject: data.subject,
        message: data.message,
        category: data.category,
        orderId: data.orderId,
        status: 'OPEN',
        priority: 'MEDIUM',
      },
    });

    return {
      ticketId: ticket.id,
      message: 'Votre demande a été transmise. Nous vous répondrons sous 24h.',
    };
  }

  async getPopularArticles(limit = 5): Promise<HelpArticle[]> {
    const articles = await this.getArticles();
    return articles.sort((a, b) => b.views - a.views).slice(0, limit);
  }
}

