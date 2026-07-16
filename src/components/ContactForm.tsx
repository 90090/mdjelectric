// src/components/ContactForm.tsx
import { useState, type FormEvent } from 'react';

// ─── Types ────────────────────────────────────────────────
interface FormState {
  firstName:       string;
  lastName:        string;
  phone:           string;
  email:           string;
  message:         string;
  preferText:      boolean;
  preferCall:      boolean;
  preferEmail:     boolean;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const API_URL = import.meta.env.PUBLIC_API_URL as string;

// ─── Component ────────────────────────────────────────────
export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    firstName:   '',
    lastName:    '',
    phone:       '',
    email:       '',
    message:     '',
    preferText:  false,
    preferCall:  false,
    preferEmail: false,
  });
  const [status,   setStatus]   = useState<SubmitStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    if (target.type === 'checkbox') {
      setForm((prev) => ({ ...prev, [target.name]: target.checked }));
    } else {
      setForm((prev) => ({ ...prev, [target.name]: target.value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    // Build contact preference string for the email
    const prefs: string[] = [];
    if (form.preferText)  prefs.push('Text Message');
    if (form.preferCall)  prefs.push('Phone Call');
    if (form.preferEmail) prefs.push('Email');

    const payload = {
      source:      'mdj-electric-contact',
      firstName:   form.firstName,
      lastName:    form.lastName,
      phone:       form.phone,
      email:       form.email,
      message:     form.message,
      contactPref: prefs.length > 0 ? prefs.join(', ') : 'No preference specified',
    };

    try {
      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message ?? `Request failed (${res.status})`);
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  // ── Success ──────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚡</div>
        <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#f1c600', marginBottom: '10px', textTransform: 'uppercase' }}>
          Request Sent!
        </h3>
        <p style={{ color: '#aaa', lineHeight: 1.7 }}>
          We'll be in touch within 24 hours. For urgent needs, call us directly at (203) 723-3902.
        </p>
      </div>
    );
  }

  // ── Styles ───────────────────────────────────────────────
  const input: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
    padding: '14px 16px', color: '#fff',
    fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem',
    outline: 'none', transition: 'border-color .25s',
  };
  const label: React.CSSProperties = {
    display: 'block', fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em',
    textTransform: 'uppercase', color: '#888', marginBottom: '8px',
  };
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = '#f1c600');
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = 'rgba(255,255,255,0.1)');

  const isSubmitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Name row */}
      <div className="form-name-row">
        <div>
          <label style={label} htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" type="text" placeholder="John"
            required value={form.firstName} onChange={handleChange}
            style={input} onFocus={focus} onBlur={blur} />
        </div>
        <div>
          <label style={label} htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" type="text" placeholder="Smith"
            required value={form.lastName} onChange={handleChange}
            style={input} onFocus={focus} onBlur={blur} />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label style={label} htmlFor="phone">Phone Number</label>
        <input id="phone" name="phone" type="tel" placeholder="(203) 555-0000"
          required value={form.phone} onChange={handleChange}
          style={input} onFocus={focus} onBlur={blur} />
      </div>

      {/* Email */}
      <div>
        <label style={label} htmlFor="email">Email Address</label>
        <input id="email" name="email" type="email" placeholder="you@email.com"
          value={form.email} onChange={handleChange}
          style={input} onFocus={focus} onBlur={blur} />
      </div>

      {/* Message */}
      <div>
        <label style={label} htmlFor="message">Project Details / Message</label>
        <textarea id="message" name="message"
          placeholder="Describe your project or any questions you have..."
          rows={4} value={form.message} onChange={handleChange}
          style={{ ...input, resize: 'vertical', minHeight: '120px' }}
          onFocus={focus} onBlur={blur} />
      </div>

      {/* Contact preference checkboxes */}
      <div>
        <div style={{ ...label, marginBottom: '12px' }}>Preferred Contact Method</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {[
            { name: 'preferText',  label: 'Text Message' },
            { name: 'preferCall',  label: 'Phone Call'   },
            { name: 'preferEmail', label: 'Email'        },
          ].map(({ name, label: lbl }) => (
            <label key={name} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              cursor: 'pointer', padding: '10px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${(form as Record<string, unknown>)[name] ? '#f1c600' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '6px', transition: 'border-color .2s',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '0.88rem', fontWeight: 600, color: '#ccc',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              <input
                type="checkbox"
                name={name}
                checked={(form as Record<string, unknown>)[name] as boolean}
                onChange={handleChange}
                style={{ accentColor: '#f1c600', width: '16px', height: '16px', cursor: 'pointer' }}
              />
              {lbl}
            </label>
          ))}
        </div>
      </div>

      {/* Error */}
      {status === 'error' && (
        <p style={{ color: '#ff6b6b', fontSize: '0.88rem', textAlign: 'center' }}>{errorMsg}</p>
      )}

      {/* Submit */}
      <button type="submit" className="btn-gold" disabled={isSubmitting}
        style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px',
          opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
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
