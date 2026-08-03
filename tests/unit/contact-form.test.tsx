import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "@/features/contact/components/contact-form";

const sendMessageMock = vi.fn();
vi.mock("@/features/contact/actions/send-message", () => ({
  sendMessage: (input: unknown) => sendMessageMock(input),
}));

vi.mock("@/features/contact/components/turnstile-widget", () => ({
  TurnstileWidget: ({ onToken }: { onToken: (t: string) => void }) => {
    onToken("test-token");
    return <div data-testid="turnstile-stub" />;
  },
}));

vi.mock("@/lib/hooks/use-item-hover-sound", () => ({
  useItemHoverSound: () => () => {},
}));

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Hello, I'd like to talk about a project.",
};

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name/i), valid.name);
  await user.type(screen.getByLabelText(/email/i), valid.email);
  await user.type(screen.getByLabelText(/message/i), valid.message);
}

describe("ContactForm", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => cleanup());

  it("shows client-side validation errors and does not call the action", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() => expect(screen.getAllByRole("alert").length).toBeGreaterThan(0));
    expect(sendMessageMock).not.toHaveBeenCalled();
  });

  it("submits valid input and shows the success status", async () => {
    sendMessageMock.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/sent/i));
    expect(sendMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({ ...valid, turnstileToken: "test-token" }),
    );
  });

  it("maps server field errors back into the form", async () => {
    sendMessageMock.mockResolvedValue({
      ok: false,
      code: "validation",
      fieldErrors: { email: "Invalid email" },
    });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(await screen.findByText("Invalid email")).toBeTruthy();
  });

  it("shows a generic error for rate-limited responses", async () => {
    sendMessageMock.mockResolvedValue({ ok: false, code: "rate-limited" });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/too many/i));
  });
});
