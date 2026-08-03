"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "@/features/contact/actions/send-message";
import { TurnstileWidget } from "@/features/contact/components/turnstile-widget";
import { contactSchema } from "@/features/contact/lib/contact-schema";
import type { z } from "zod";

type ContactFormValues = z.input<typeof contactSchema>;
import { useItemHoverSound } from "@/lib/hooks/use-item-hover-sound";

type Status = { kind: "success" | "error"; message: string } | null;

const ERROR_MESSAGES: Record<string, string> = {
  turnstile: "Verification failed — please try again.",
  "rate-limited": "Too many messages — please try again in a minute.",
  delivery: "Something went wrong sending your message — please email me directly.",
  validation: "Please fix the errors below.",
};

/**
 * Form liên hệ client island — RHF + Zod, honeypot, Turnstile, trạng thái gửi.
 *
 * Chỉ dùng hover sound trên nút gửi; không có jingle khi thành công.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>(null);
  const [isPending, startTransition] = useTransition();
  /** Tăng key để remount Turnstile — token chỉ dùng một lần. */
  const [turnstileKey, setTurnstileKey] = useState(0);
  const tokenRef = useRef("");
  const playHoverSound = useItemHoverSound();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      company: "",
      turnstileToken: "",
    },
  });

  const refreshTurnstile = useCallback(() => {
    tokenRef.current = "";
    form.setValue("turnstileToken", "", { shouldValidate: false });
    setTurnstileKey((k) => k + 1);
  }, [form]);

  const handleTurnstileToken = useCallback(
    (token: string) => {
      tokenRef.current = token;
      form.setValue("turnstileToken", token, { shouldValidate: false });
      if (token && form.formState.errors.turnstileToken) {
        form.clearErrors("turnstileToken");
      }
    },
    [form],
  );

  const onSubmit = form.handleSubmit((values) => {
    setStatus(null);
    startTransition(async () => {
      try {
        const result = await sendMessage({ ...values, turnstileToken: tokenRef.current });
        if (result.ok) {
          form.reset();
          refreshTurnstile();
          setStatus({ kind: "success", message: "Message sent — thanks for reaching out." });
          return;
        }
        if (result.code === "validation" && result.fieldErrors) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof ContactFormValues, { message });
          }
        }
        if (result.code === "turnstile" || result.code === "rate-limited") {
          refreshTurnstile();
        }
        setStatus({
          kind: "error",
          message: ERROR_MESSAGES[result.code] ?? ERROR_MESSAGES.delivery!,
        });
      } catch {
        setStatus({ kind: "error", message: ERROR_MESSAGES.delivery! });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="contact-name">Name</FieldLabel>
          <Input id="contact-name" autoComplete="name" {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Input id="contact-email" type="email" autoComplete="email" {...form.register("email")} />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
          <Input id="contact-subject" {...form.register("subject")} />
          <FieldDescription>Optional</FieldDescription>
          <FieldError errors={[form.formState.errors.subject]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea
            id="contact-message"
            rows={5}
            className="resize-y"
            {...form.register("message")}
          />
          <FieldError errors={[form.formState.errors.message]} />
        </Field>
        {/* Honeypot — off-screen, không dùng display:none (bot hay phát hiện). */}
        <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("company")}
          />
        </div>
        <Field>
          <TurnstileWidget key={turnstileKey} onToken={handleTurnstileToken} />
          <FieldError errors={[form.formState.errors.turnstileToken]} />
        </Field>
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            onMouseEnter={playHoverSound}
            className="w-full sm:w-auto"
          >
            {isPending ? "Sending…" : "Send message"}
          </Button>
          {status && (
            <p
              role="status"
              aria-live="polite"
              className={
                status.kind === "error"
                  ? "text-sm text-destructive"
                  : "text-sm text-muted-foreground"
              }
            >
              {status.message}
            </p>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
