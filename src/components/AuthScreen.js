import React, { useState } from 'react';
import { signIn, signUp } from '../services/auth';

export default function AuthScreen({ onAuthSuccess }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      if (mode === 'signup') {
        setConfirmationEmail(email);
        setShowConfirmation(true);
      } else {
        onAuthSuccess(result.user);
      }
    }
  };

  const t = {
    bg: '#0c0804',
    surface: '#1a1008',
    card: '#251608',
    accent: '#f59e0b',
    accent2: '#dc7609',
    text: '#fef3c7',
    muted: '#8a6a3a',
    border: '#3d2a10',
    gradient: 'radial-gradient(ellipse at 50% 110%, #3d1a00 0%, #0c0804 65%)',
  };

  if (showConfirmation) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        background: t.gradient,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 30px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: 320 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
          <h1 style={{
            fontFamily: "'Lora', serif",
            fontSize: 28,
            color: t.text,
            marginBottom: 16
          }}>
            Check Your Email
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: t.muted,
            lineHeight: 1.6,
            marginBottom: 24
          }}>
            We sent a confirmation link to <strong style={{ color: t.text }}>{confirmationEmail}</strong>
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: t.muted,
            lineHeight: 1.6,
            marginBottom: 32,
            background: t.card,
            borderRadius: 12,
            padding: 16,
            border: `1px solid ${t.border}`
          }}>
            Click the link to confirm your account before signing in. It may take a minute to arrive.
          </p>
          <button
            onClick={() => {
              setShowConfirmation(false);
              setMode('signin');
              setEmail('');
              setPassword('');
            }}
            style={{
              width: '100%',
              padding: '12px',
              background: t.accent,
              color: t.bg,
              border: 'none',
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: t.gradient,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 30px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔥</div>
        <h1 style={{
          fontFamily: "'Lora', serif",
          fontSize: 32,
          color: t.text,
          marginBottom: 8
        }}>
          Ember
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: t.muted
        }}>
          Your private journal companion
        </p>
      </div>

      <div style={{
        width: '100%',
        maxWidth: 320,
        background: t.surface,
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${t.border}`
      }}>
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          background: t.card,
          borderRadius: 8,
          padding: 4
        }}>
          <button
            onClick={() => setMode('signin')}
            style={{
              flex: 1,
              padding: '8px 16px',
              background: mode === 'signin' ? t.accent : 'transparent',
              color: mode === 'signin' ? t.bg : t.muted,
              border: 'none',
              borderRadius: 6,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            style={{
              flex: 1,
              padding: '8px 16px',
              background: mode === 'signup' ? t.accent : 'transparent',
              color: mode === 'signup' ? t.bg : t.muted,
              border: 'none',
              borderRadius: 6,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: t.muted,
              display: 'block',
              marginBottom: 6
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                background: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                color: t.text,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: t.muted,
              display: 'block',
              marginBottom: 6
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                color: t.text,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          {mode === 'signup' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: t.muted,
                display: 'block',
                marginBottom: 6
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: t.card,
                  border: `1px solid ${t.border}`,
                  borderRadius: 8,
                  color: t.text,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  outline: 'none'
                }}
              />
            </div>
          )}

          {error && (
            <div style={{
              padding: '8px 12px',
              background: '#7f1d1d',
              border: '1px solid #991b1b',
              borderRadius: 6,
              marginBottom: 16
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: '#fecaca',
                margin: 0
              }}>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: t.accent,
              color: t.bg,
              border: 'none',
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {mode === 'signup' && (
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            color: t.muted,
            textAlign: 'center',
            marginTop: 16,
            lineHeight: 1.5
          }}>
            By signing up, you agree to keep your journal private and secure.
          </p>
        )}
      </div>
    </div>
  );
}
