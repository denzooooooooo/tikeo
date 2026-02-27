# 🤝 Guide de Contribution - Tikeo

Merci de votre intérêt pour contribuer à Tikeo ! Ce document vous guidera à travers le processus de contribution.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Standards de Code](#standards-de-code)
- [Workflow Git](#workflow-git)
- [Pull Requests](#pull-requests)
- [Reporting Bugs](#reporting-bugs)
- [Proposer des Fonctionnalités](#proposer-des-fonctionnalités)

## 📜 Code de Conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite :

- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est meilleur pour la communauté
- Faites preuve d'empathie envers les autres membres

## 🚀 Comment Contribuer

### 1. Fork le Projet

```bash
# Cloner votre fork
git clone https://github.com/votre-username/tikeo.git
cd tikeo

# Ajouter le repo upstream
git remote add upstream https://github.com/tikeo/tikeo.git
```

### 2. Créer une Branche

```bash
# Mettre à jour votre main
git checkout main
git pull upstream main

# Créer une nouvelle branche
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

### 3. Faire vos Modifications

- Écrivez du code propre et bien documenté
- Suivez les standards de code du projet
- Ajoutez des tests si nécessaire
- Mettez à jour la documentation

### 4. Commit vos Changements

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Format
<type>(<scope>): <description>

# Exemples
git commit -m "feat(events): add event filtering by category"
git commit -m "fix(auth): resolve JWT token expiration issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(ui): improve button hover states"
git commit -m "refactor(api): optimize database queries"
git commit -m "test(tickets): add unit tests for ticket validation"
```

**Types de commits :**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, style (pas de changement de code)
- `refactor`: Refactoring de code
- `test`: Ajout ou modification de tests
- `chore`: Tâches de maintenance
- `perf`: Amélioration de performance

### 5. Push et Créer une Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Puis créez une Pull Request sur GitHub.

## 💻 Standards de Code

### TypeScript

- Utilisez TypeScript strict mode
- Définissez des types explicites
- Évitez `any` autant que possible
- Utilisez des interfaces pour les objets complexes

```typescript
// ✅ Bon
interface User {
  id: string;
  email: string;
  firstName: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Mauvais
function getUser(id: any): any {
  // ...
}
```

### React / Next.js

- Utilisez des composants fonctionnels
- Préférez les hooks aux class components
- Utilisez TypeScript pour les props
- Nommez les composants en PascalCase

```typescript
// ✅ Bon
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return <button onClick={onClick}>{label}</button>;
};

// ❌ Mauvais
export const button = (props: any) => {
  return <button onClick={props.onClick}>{props.label}</button>;
};
```

### NestJS

- Utilisez les décorateurs appropriés
- Suivez l'architecture modulaire
- Injectez les dépendances via le constructeur
- Utilisez les DTOs pour la validation

```typescript
// ✅ Bon
@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.prisma.event.findMany();
  }
}

// ❌ Mauvais
export class EventsService {
  async findAll() {
    const prisma = new PrismaClient();
    return prisma.event.findMany();
  }
}
```

### Styling

- Utilisez TailwindCSS pour le styling
- Suivez le design system défini
- Utilisez les tokens de couleur et spacing
- Préférez les utility classes aux styles custom

```tsx
// ✅ Bon
<button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
  Click me
</button>

// ❌ Mauvais
<button style={{ backgroundColor: '#5B7CFF', color: 'white', padding: '8px 16px' }}>
  Click me
</button>
```

### Naming Conventions

- **Fichiers** : kebab-case (`event-card.tsx`, `user-service.ts`)
- **Composants** : PascalCase (`EventCard`, `UserProfile`)
- **Fonctions** : camelCase (`getUserById`, `calculateTotal`)
- **Constants** : UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
- **Interfaces/Types** : PascalCase (`User`, `EventData`)

## 🔄 Workflow Git

### Branches

- `main` : Production-ready code
- `develop` : Branche de développement principale
- `feature/*` : Nouvelles fonctionnalités
- `fix/*` : Corrections de bugs
- `hotfix/*` : Corrections urgentes en production
- `release/*` : Préparation de release

### Mise à Jour de votre Branche

```bash
# Récupérer les dernières modifications
git fetch upstream

# Rebaser votre branche
git rebase upstream/main

# Ou merger (si préféré)
git merge upstream/main
```

## 📝 Pull Requests

### Checklist avant de soumettre

- [ ] Le code compile sans erreurs
- [ ] Tous les tests passent
- [ ] Le code est formaté (run `npm run format`)
- [ ] Le linter ne retourne pas d'erreurs (run `npm run lint`)
- [ ] La documentation est à jour
- [ ] Les commits suivent le format Conventional Commits
- [ ] La PR a une description claire

### Template de Pull Request

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Comment tester
1. Étape 1
2. Étape 2
3. Résultat attendu

## Screenshots (si applicable)
[Ajouter des screenshots]

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai effectué une auto-review
- [ ] J'ai commenté les parties complexes
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de warnings
- [ ] J'ai ajouté des tests
- [ ] Tous les tests passent
```

## 🐛 Reporting Bugs

### Avant de reporter un bug

1. Vérifiez que le bug n'a pas déjà été reporté
2. Assurez-vous d'utiliser la dernière version
3. Vérifiez que ce n'est pas un problème de configuration

### Template de Bug Report

```markdown
**Description du bug**
Description claire et concise du bug

**Pour reproduire**
1. Aller à '...'
2. Cliquer sur '...'
3. Scroller jusqu'à '...'
4. Voir l'erreur

**Comportement attendu**
Description du comportement attendu

**Screenshots**
Si applicable, ajoutez des screenshots

**Environnement:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. Chrome, Safari]
 - Version: [e.g. 1.0.0]

**Informations additionnelles**
Tout autre contexte pertinent
```

## 💡 Proposer des Fonctionnalités

### Template de Feature Request

```markdown
**La fonctionnalité est-elle liée à un problème ?**
Description claire du problème

**Solution proposée**
Description de la solution souhaitée

**Alternatives considérées**
Autres solutions envisagées

**Informations additionnelles**
Contexte supplémentaire, mockups, etc.
```

## 🧪 Tests

### Écrire des Tests

```typescript
// Unit test example
describe('EventsService', () => {
  it('should return all events', async () => {
    const events = await service.findAll();
    expect(events).toBeDefined();
    expect(Array.isArray(events)).toBe(true);
  });
});

// Integration test example
describe('Events API', () => {
  it('GET /events should return 200', async () => {
    const response = await request(app.getHttpServer())
      .get('/events')
      .expect(200);
    
    expect(response.body).toHaveProperty('data');
  });
});
```

### Lancer les Tests

```bash
# Tous les tests
npm run test

# Tests d'un package spécifique
npm run test --filter=api-gateway

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📚 Documentation

- Documentez les fonctions complexes
- Utilisez JSDoc pour les fonctions publiques
- Mettez à jour le README si nécessaire
- Ajoutez des exemples d'utilisation

```typescript
/**
 * Récupère un événement par son ID
 * @param id - L'identifiant unique de l'événement
 * @returns L'événement trouvé ou null
 * @throws {NotFoundException} Si l'événement n'existe pas
 * @example
 * const event = await getEventById('123');
 */
async function getEventById(id: string): Promise<Event | null> {
  // ...
}
```

## 🎨 Design System

Consultez le [Design System](./packages/ui/README.md) pour :
- Palette de couleurs
- Typographie
- Composants disponibles
- Guidelines d'utilisation

## 🤔 Questions ?

- 💬 Ouvrez une [Discussion](https://github.com/tikeo/tikeo/discussions)
- 📧 Contactez-nous : dev@tikeo.com
- 📖 Consultez la [Documentation](./docs)

## 🙏 Remerciements

Merci à tous les contributeurs qui aident à améliorer Tikeo !

---

**Happy Coding! 🎫**
