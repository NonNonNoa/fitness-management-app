import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock framer-motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: "div",
      button: "button",
      span: "span",
      nav: "nav",
      aside: "aside",
      main: "main",
      header: "header",
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock environment variables
process.env.TURSO_DATABASE_URL = "file:test.db";
process.env.BETTER_AUTH_SECRET = "test-secret";
process.env.BETTER_AUTH_URL = "http://localhost:3000";

