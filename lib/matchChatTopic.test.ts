import { matchChatTopic } from "./matchChatTopic";
import { FALLBACK_ANSWER } from "@/data/chatbot";

describe("matchChatTopic", () => {
  it("matches a single-word keyword as a whole word", () => {
    expect(matchChatTopic("hi there")).not.toBe(FALLBACK_ANSWER);
  });

  it("does not fire a single-word keyword on a substring match", () => {
    // "yo" is a greeting keyword; "you"/"your" must not trigger it.
    expect(matchChatTopic("what do you think of your stack")).not.toContain(
      "simple rule-based FAQ bot"
    );
  });

  it("matches a multi-word phrase as a substring", () => {
    expect(matchChatTopic("what's your tech stack")).not.toBe(FALLBACK_ANSWER);
  });

  it("falls back to the honest default when nothing matches", () => {
    expect(matchChatTopic("asdkjqwoe zxcvpoiu")).toBe(FALLBACK_ANSWER);
  });
});
