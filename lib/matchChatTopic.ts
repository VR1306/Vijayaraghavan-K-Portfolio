import { chatTopics, FALLBACK_ANSWER } from "@/data/chatbot";

/**
 * Scores every topic by keyword matches in the visitor's message, and
 * returns the best match. Single-word keywords must match a whole word
 * (so "yo" won't fire on "you"/"your"); multi-word phrases are matched as
 * substrings, since spaces already give them a natural boundary.
 *
 * Deliberately simple — no ML, no external calls — this is meant to be
 * predictable and free to run, not to hold a real conversation.
 */
export function matchChatTopic(input: string): string {
  const normalized = input.toLowerCase();
  const words = new Set(normalized.match(/[a-z0-9]+/g) ?? []);

  let bestScore = 0;
  let bestAnswer: string | null = null;

  for (const topic of chatTopics) {
    const score = topic.keywords.reduce((count, keyword) => {
      const isPhrase = keyword.includes(" ");
      const matched = isPhrase ? normalized.includes(keyword) : words.has(keyword);
      return matched ? count + 1 : count;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = topic.answer();
    }
  }

  return bestAnswer ?? FALLBACK_ANSWER;
}
