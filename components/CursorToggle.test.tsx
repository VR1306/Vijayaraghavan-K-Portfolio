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

  it("opens design switcher dropdown and allows selecting different 3D styles", () => {
    render(
      <CursorProvider>
        <CursorToggle />
      </CursorProvider>
    );

    const dropdownTrigger = screen.getByRole("button", { name: /Select cursor design/i });
    expect(dropdownTrigger).toBeInTheDocument();

    // Open dropdown
    fireEvent.click(dropdownTrigger);
    expect(screen.getByText("Tesseract")).toBeInTheDocument();
    expect(screen.getByText("Compass")).toBeInTheDocument();
    expect(screen.getByText("Prism")).toBeInTheDocument();

    // Select Tesseract
    const tesseractOption = screen.getByText("Tesseract");
    fireEvent.click(tesseractOption);

    // Dropdown should close and trigger should show updated style
    expect(screen.queryByText("Quantum 4D Hypercube with pulsating vertex nodes and dynamic rotation")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Select cursor design: Tesseract/i })).toBeInTheDocument();
  });
});
