import { db } from '../firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { topics, steps, newsUpdates, suggestionChips } from '../data/mockData';

export const seedDatabase = async () => {
  try {
    const batch = writeBatch(db);

    // 1. Seed Topics
    topics.forEach((topic) => {
      const topicRef = doc(db, 'topics', topic.id);
      batch.set(topicRef, topic);
    });

    // 2. Seed Steps
    steps.forEach((step) => {
      const stepRef = doc(db, 'steps', step.id);
      batch.set(stepRef, step);
    });

    // 3. Seed News
    newsUpdates.forEach((news) => {
      const newsRef = doc(db, 'newsUpdates', news.id);
      batch.set(newsRef, news);
    });

    // 4. Seed Config (Suggestion Chips)
    const configRef = doc(db, 'config', 'assistant');
    batch.set(configRef, { suggestionChips });

    await batch.commit();
    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};
