// src/components/ContactForm.tsx
import { useState, type FormEvent } from 'react';

// ─── Types ────────────────────────────────────────────────
interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

// ─── Config ───────────────────────────────────────────────
// Set via environment variable at build time (Astro exposes PUBLIC_ prefixed vars).
// In your .env:  PUBLIC_API_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/prod/contact
const API_URL = import.meta.env.PUBLIC_API_URL as string;

const SERVICES = [
  'Generator Installation',
  'Electrical Panel Upgrade',
  'EV Charger Installation',
  'Lighting & Controls',
  'New Wiring / Rewiring',
  'Troubleshooting & Repairs',
  'Commercial Electrical',
  'Other',
];

// ─── Component ────────────────────────────────────────────
export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName:  '',
    phone:     '',
    email:     '',
    service:   '',
    message:   '',
  });
  const [status, setStatus]     = useState<SubmitStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    // Payload matches what your Lambda / API Gateway expects
    const payload = {
      firstName: form.firstName,
      lastName:  form.lastName,
      phone:     form.phone,
      email:     form.email,
      service:   form.service,
      message:   form.message,
      // source field lets Lambda route to correct email handler if you have multiple forms
      source:    'mdj-electric-contact',
    };

    try {
      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        // API Gateway / Lambda returned a non-2xx — surface the message if any
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message ?? `Request failed (${res.status})`);
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  // ── Success state ────────────────────────────────────────
  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚡</div>
        <h3
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: '1.5rem',
            color: '#f1c600',
            marginBottom: '10px',
            textTransform: 'uppercase',
          }}
        >
          Request Sent!
        </h3>
        <p style={{ color: '#aaa' }}>
          We'll be in touch within 24 hours. For urgent needs, call us directly at (203) 723-3902.
        </p>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    padding: '14px 16px',
    color: '#fff',
    fontFamily: "'Barlow', sans-serif",
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color .25s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: '8px',
  };

  const isSubmitting = status === 'submitting';

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      {/* Name row */}
      <div className="form-name-row">
        <div>
          <label style={labelStyle} htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className="form-input"
            placeholder="John"
            required
            value={form.firstName}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#f1c600')}
            onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className="form-input"
            placeholder="Smith"
            required
            value={form.lastName}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#f1c600')}
            onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label style={labelStyle} htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="form-input"
          placeholder="(203) 555-0000"
          required
          value={form.phone}
          onChange={handleChange}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#f1c600')}
          onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle} htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          className="form-input"
          placeholder="you@email.com"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#f1c600')}
          onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </div>

      {/* Service */}
      <div>
        <label style={labelStyle} htmlFor="service">Service Needed</label>
        <select
          id="service"
          name="service"
          className="form-input"
          value={form.service}
          onChange={handleChange}
          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
          onFocus={(e) => (e.target.style.borderColor = '#f1c600')}
          onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        >
          <option value="" style={{ background: '#1a1a1a' }}>Select a service...</option>
          {SERVICES.map((svc) => (
            <option key={svc} value={svc} style={{ background: '#1a1a1a' }}>
              {svc}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label style={labelStyle} htmlFor="message">Tell Us About Your Project</label>
        <textarea
          id="message"
          name="message"
          className="form-input"
          placeholder="Describe your project or any questions you have..."
          rows={4}
          value={form.message}
          onChange={handleChange}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
          onFocus={(e) => (e.target.style.borderColor = '#f1c600')}
          onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </div>

      {/* Error message */}
      {status === 'error' && (
        <p style={{ color: '#ff6b6b', fontSize: '0.88rem', textAlign: 'center' }}>
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="btn-gold"
        disabled={isSubmitting}
        style={{
          width: '100%',
          justifyContent: 'center',
          fontSize: '1rem',
          padding: '16px',
          opacity: isSubmitting ? 0.7 : 1,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 12 20" fill="currentColor">
          <path d="M8 0 L2 10 H7 L1 20 L12 7 H7 Z" />
        </svg>
        {isSubmitting ? 'Sending…' : 'Send My Request'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#555' }}>
        We respect your privacy. No spam, ever.
      </p>
    </form>
  );
}
