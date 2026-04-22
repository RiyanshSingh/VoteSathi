import { db } from '../firebase';
import { doc, writeBatch, collection, getDocs } from 'firebase/firestore';
import { topics, steps, newsUpdates, suggestionChips } from '../data/mockData';

/**
 * Helper to clear a collection before seeding
 */
const clearCollection = async (collectionName: string) => {
  const snap = await getDocs(collection(db, collectionName));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => {
    batch.delete(d.ref);
  });
  await batch.commit();
};

export const seedDatabase = async () => {
  try {
    console.log('Starting database cleanup and seed...');

    // 1. Clear existing content to ensure integrity (removes legacy/duplicate docs)
    await clearCollection('topics');
    await clearCollection('steps');
    await clearCollection('newsUpdates');

    const batch = writeBatch(db);

    // 2. Seed Topics
    topics.forEach((topic) => {
      const topicRef = doc(db, 'topics', topic.id);
      batch.set(topicRef, topic);
    });

    // 3. Seed Steps
    steps.forEach((step) => {
      const stepRef = doc(db, 'steps', step.id);
      batch.set(stepRef, step);
    });

    // 4. Seed News
    newsUpdates.forEach((news) => {
      const newsRef = doc(db, 'newsUpdates', news.id);
      batch.set(newsRef, news);
    });

    // 5. Seed Config (Suggestion Chips)
    const configRef = doc(db, 'config', 'assistant');
    batch.set(configRef, { suggestionChips });

    await batch.commit();
    console.log('Database seeded successfully with canonical data!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};
