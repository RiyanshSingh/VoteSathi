import {
  newsUpdates,
  steps as canonicalSteps,
  suggestionChips as canonicalSuggestionChips,
  topics as canonicalTopics,
  type Step,
  type Topic,
} from '../data/mockData';

type NewsItem = (typeof newsUpdates)[number];

const normalizeText = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();

const topicById = new Map(canonicalTopics.map((topic) => [topic.id, topic]));
const stepById = new Map(canonicalSteps.map((step) => [step.id, step]));
const stepByTopicAndNumber = new Map(
  canonicalSteps.map((step) => [`${step.topicId}:${step.stepNumber}`, step]),
);
const stepByTitle = new Map(canonicalSteps.map((step) => [normalizeText(step.title), step]));
const newsById = new Map(newsUpdates.map((news) => [news.id, news]));
const suggestionChipByValue = new Map(
  canonicalSuggestionChips.map((chip) => [normalizeText(chip), chip]),
);

export const getCanonicalTopic = (topic: Topic): Topic => {
  return topicById.get(topic.id) ?? topic;
};

export const getCanonicalStep = (step: Step): Step => {
  const canonical =
    stepById.get(step.id) ?? stepByTopicAndNumber.get(`${step.topicId}:${step.stepNumber}`);

  return canonical
    ? {
        ...step,
        title: canonical.title,
        description: canonical.description,
      }
    : step;
};

export const dedupeCanonicalSteps = (steps: Step[]) => {
  const uniqueSteps = new Map<string, Step>();

  for (const step of steps) {
    const key = `${step.topicId}:${step.stepNumber}`;
    const canonicalStep = getCanonicalStep(step);
    const existing = uniqueSteps.get(key);

    if (!existing || stepById.has(step.id)) {
      uniqueSteps.set(key, canonicalStep);
    }
  }

  return [...uniqueSteps.values()].sort((a, b) => a.stepNumber - b.stepNumber);
};

export const getCanonicalProgressStepTitle = (
  topicId: string,
  lastStepIndex?: number,
  fallbackTitle?: string,
) => {
  if (typeof lastStepIndex === 'number') {
    const canonical = stepByTopicAndNumber.get(`${topicId}:${lastStepIndex + 1}`);
    if (canonical) return canonical.titleKey || canonical.title;
  }

  if (!fallbackTitle) return fallbackTitle ?? '';

  return stepByTitle.get(normalizeText(fallbackTitle))?.title ?? fallbackTitle;
};

export const getCanonicalNews = <T extends NewsItem>(news: T): T => {
  const canonical = newsById.get(news.id);

  return canonical
    ? ({
        ...news,
        title: canonical.title,
        description: canonical.description,
        date: canonical.date,
        isUrgent: canonical.isUrgent,
      } as T)
    : news;
};

export const getCanonicalSuggestionChip = (chip: string) => {
  return suggestionChipByValue.get(normalizeText(chip)) ?? chip;
};
