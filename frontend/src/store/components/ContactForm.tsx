import { useState } from "react";

// URL-encode form data the way Netlify Forms expects.
const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
    .join("&");

const inputStyle = {
  fontFamily: '"Geist Mono", monospace',
  backgroundColor: "#f0f0f0",
  color: "rgb(80, 80, 80)",
  borderColor: "rgba(0, 0, 0, 0.1)",
  boxShadow:
    "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
  fontSize: "14px",
  fontWeight: 300,
} as const;

export const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [botField, setBotField] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "contact",
          "bot-field": botField,
          name,
          email,
          message,
        }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "ok") {
    return (
      <p
        className="mt-6 text-black"
        style={{
          fontFamily: '"Geist Mono", monospace',
          fontSize: "14px",
          fontWeight: 300,
        }}
      >
        Thanks — message received.
      </p>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="mt-6 flex flex-col gap-3 text-left"
      style={{ fontFamily: '"Geist Mono", monospace' }}
    >
      {/* Netlify needs form-name in the body. Mirrored as hidden input
          so it works for users who land here without JS too. */}
      <input type="hidden" name="form-name" value="contact" />
      {/* Honeypot — real users leave this blank; bots fill every input. */}
      <p hidden>
        <label>
          Don't fill this out:{" "}
          <input
            name="bot-field"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
          />
        </label>
      </p>

      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Name"
        className="w-full px-4 py-3 rounded-md border"
        style={inputStyle}
      />
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Email"
        className="w-full px-4 py-3 rounded-md border"
        style={inputStyle}
      />
      <textarea
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        placeholder="Demo / artist submission, message, links…"
        rows={5}
        className="w-full px-4 py-3 rounded-md border"
        style={inputStyle}
      />

      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start px-6 py-3 rounded-md transition-all hover:scale-105"
        style={{
          ...inputStyle,
          fontSize: "16px",
          cursor: status === "submitting" ? "not-allowed" : "pointer",
          opacity: status === "submitting" ? 0.6 : 1,
        }}
      >
        {status === "submitting" ? "Sending…" : "Send"}
      </button>

      {status === "error" && (
        <p
          style={{
            fontSize: "13px",
            fontWeight: 300,
            color: "rgb(200, 60, 60)",
          }}
        >
          Something went wrong. Try again, or email balmsoothes@gmail.com.
        </p>
      )}
    </form>
  );
};
