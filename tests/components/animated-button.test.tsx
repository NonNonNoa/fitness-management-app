import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedButton } from "@/components/ui/animated-button";

describe("AnimatedButton", () => {
  it("should render button with text", () => {
    render(<AnimatedButton>Click me</AnimatedButton>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should render with different variants", () => {
    const { rerender } = render(
      <AnimatedButton variant="primary">Primary</AnimatedButton>
    );
    expect(screen.getByText("Primary")).toBeInTheDocument();

    rerender(<AnimatedButton variant="secondary">Secondary</AnimatedButton>);
    expect(screen.getByText("Secondary")).toBeInTheDocument();

    rerender(<AnimatedButton variant="danger">Danger</AnimatedButton>);
    expect(screen.getByText("Danger")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    render(<AnimatedButton loading>Loading</AnimatedButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<AnimatedButton disabled>Disabled</AnimatedButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should render full width when fullWidth is true", () => {
    render(<AnimatedButton fullWidth>Full Width</AnimatedButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("w-full");
  });
});


