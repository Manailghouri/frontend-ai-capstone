"use client";

import React, { useState, useEffect } from 'react';
import { Toggle } from './ui/Toggle';

type Theme = 'light' | 'dark' | 'system';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function SettingsForm() {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState<Theme>('system');
  const [notifications, setNotifications] = useState(true);

  // UI State
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Apply theme to document
  const applyTheme = (targetTheme: Theme) => {
    const root = document.documentElement;
    if (targetTheme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', targetTheme);
    }
  };

  // Client-side hydration guard and loading from localStorage
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('app-settings');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.fullName !== undefined) setFullName(data.fullName);
        if (data.email !== undefined) setEmail(data.email);
        if (data.theme !== undefined) {
          setTheme(data.theme);
          applyTheme(data.theme);
        }
        if (data.notifications !== undefined) setNotifications(data.notifications);
      } catch (err) {
        console.error('Failed to parse settings from localStorage', err);
      }
    }
  }, []);

  // Theme change handler
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Toast notifications helpers
  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Input Validation Logic
  const validateEmail = (val: string) => {
    if (!val.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validateName = (val: string) => {
    if (!val.trim()) {
      return 'Name is required';
    }
    return '';
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    // Real-time error clearing/updating
    setErrors((prev) => ({
      ...prev,
      fullName: validateName(value)
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Real-time error clearing/updating
    setErrors((prev) => ({
      ...prev,
      email: validateEmail(value)
    }));
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateName(fullName);
    const emailErr = validateEmail(email);

    if (nameErr || emailErr) {
      setErrors({ fullName: nameErr, email: emailErr });
      addToast('Please resolve validation errors before saving.', 'error');
      return;
    }

    setIsSaving(true);

    // Simulate saving process
    setTimeout(() => {
      const payload = {
        fullName,
        email,
        theme,
        notifications
      };

      try {
        localStorage.setItem('app-settings', JSON.stringify(payload));
        setIsSaving(false);
        addToast('Settings saved successfully!', 'success');
      } catch (err) {
        setIsSaving(false);
        addToast('Failed to save settings. Local storage may be full.', 'error');
      }
    }, 1000);
  };

  if (!isMounted) {
    return (
      <div className="settings-card loading-container" aria-busy="true" aria-label="Loading settings">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="settings-card">
        <header className="header-section">
          <h1 className="title">Account Settings</h1>
          <p className="subtitle">Manage your profile, application theme preference, and notifications.</p>
        </header>

        <form onSubmit={handleSubmit} className="form-group-section" noValidate>
          {/* Full Name Field */}
          <div className="form-field">
            <label htmlFor="full-name" className="form-label">
              Full Name
              <span className="required-dot" aria-hidden="true">*</span>
            </label>
            <input
              id="full-name"
              type="text"
              className={`form-input ${errors.fullName ? 'has-error' : ''}`}
              value={fullName}
              onChange={handleNameChange}
              placeholder="e.g. John Doe"
              required
              aria-required="true"
              aria-invalid={errors.fullName ? 'true' : 'false'}
              aria-describedby={errors.fullName ? 'name-error' : undefined}
            />
            {errors.fullName && (
              <span id="name-error" className="field-error-message" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email Address Field */}
          <div className="form-field">
            <label htmlFor="email-address" className="form-label">
              Email Address
              <span className="required-dot" aria-hidden="true">*</span>
            </label>
            <input
              id="email-address"
              type="email"
              className={`form-input ${errors.email ? 'has-error' : ''}`}
              value={email}
              onChange={handleEmailChange}
              placeholder="e.g. john@example.com"
              required
              aria-required="true"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span id="email-error" className="field-error-message" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errors.email}
              </span>
            )}
          </div>

          {/* Theme Selector Field */}
          <div className="form-field">
            <span id="theme-selector-label" className="form-label">Interface Theme</span>
            <div
              className="segmented-control"
              role="radiogroup"
              aria-labelledby="theme-selector-label"
            >
              <button
                type="button"
                role="radio"
                aria-checked={theme === 'light'}
                className={`segment-button ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                Light
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={theme === 'dark'}
                className={`segment-button ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                Dark
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={theme === 'system'}
                className={`segment-button ${theme === 'system' ? 'active' : ''}`}
                onClick={() => handleThemeChange('system')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                System
              </button>
            </div>
          </div>

          {/* Notifications Toggle Field */}
          <Toggle
            id="notifications-toggle"
            title="Enable Notifications"
            description="Receive real-time push alerts about system updates."
            checked={notifications}
            onChange={setNotifications}
          />

          {/* Submit Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="save-button"
              disabled={isSaving}
              aria-live="polite"
            >
              {isSaving ? (
                <>
                  <div className="spinner" aria-hidden="true"></div>
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Accessible Toast Container */}
      {toasts.length > 0 && (
        <div className="toast-container" role="status" aria-live="polite">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`toast ${toast.type}`}
            >
              {toast.type === 'success' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
              <span>{toast.message}</span>
              <button
                type="button"
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
