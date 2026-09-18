import { render, screen } from "@testing-library/react";
import { Highlight } from "./Highlight";

describe("Highlight", () => {
  it("renders plain text with no markers unchanged", () => {
    render(<Highlight text="plain sentence" />);
    expect(screen.getByText("plain sentence")).toBeInTheDocument();
  });

  it("wraps **bold** segments in a <strong> element", () => {
    render(<Highlight text="cut bugs by **70-80%** overall" />);
    const strong = screen.getByText("70-80%");
    expect(strong.tagName).toBe("STRONG");
  });

  it("supports multiple bold segments in one string", () => {
    render(<Highlight text="**first** and **second**" />);
    expect(screen.getByText("first").tagName).toBe("STRONG");
    expect(screen.getByText("second").tagName).toBe("STRONG");
  });
});
