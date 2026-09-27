import { render, screen, fireEvent } from "@testing-library/react";
import { CursorProvider } from "@/lib/CursorContext";
import { CursorToggle } from "./CursorToggle";

describe("CursorToggle", () => {
  it("renders the 3D cursor toggle button", () => {
    render(
      <CursorProvider>
        <CursorToggle />
      </CursorProvider>
    );

    const button = screen.getByRole("button", { name: /3D cursor/i });
    expect(button).toBeInTheDocument();
  });

  it("toggles the cursor active state on click", () => {
    render(
      <CursorProvider>
        <CursorToggle />
      </CursorProvider>
    );

    const button = screen.getByRole("button", { name: /3D cursor/i });
    const initialLabel = button.getAttribute("aria-label");

    fireEvent.click(button);
    expect(button.getAttribute("aria-label")).not.toBe(initialLabel);

    fireEvent.click(button);
    expect(button.getAttribute("aria-label")).toBe(initialLabel);
  });
});
