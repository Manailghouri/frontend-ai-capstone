"use client";

import React, { useState, useEffect } from 'react';
import { Toggle } from './ui/Toggle';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function SettingsForm() {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [temperature, setTemperature] = useState(0.7);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [notifications, setNotifications] = useState(true);

  // UI State
  const [showApiKey, setShowApiKey] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Client-side hydration guard
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('app-settings');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.name !== undefined) setName(data.name);
        if (data.email !== undefined) setEmail(data.email);
        if (data.apiKey !== undefined) setApiKey(data.apiKey);
        if (data.model !== undefined) setModel(data.model);
        if (data.temperature !== undefined) setTemperature(Number(data.temperature));
        if (data.theme !== undefined) {
          setTheme(data.theme);
          document.documentElement.setAttribute('data-theme', data.theme);
        }
        if (data.notifications !== undefined) setNotifications(data.notifications);
      } catch (err) {
        console.error('Failed to parse settings from localStorage', err);
      }
    } else {
      // Default to dark theme on document if no settings exist
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Theme Sync Handler
  const handleThemeChange = (isChecked: boolean) => {
    const nextTheme = isChecked ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Toast helper
  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Email Validation Helper
  const validateEmail = (val: string) => {
    if (!val) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const emailErr = validateEmail(value);
    setErrors((prev) => ({ ...prev, email: emailErr }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setErrors((prev) => ({ 
      ...prev, 
      name: value.trim() ? '' : 'Name is required' 
    }));
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation checks
    const nameErr = name.trim() ? '' : 'Name is required';
    const emailErr = validateEmail(email);

    if (nameErr || emailErr) {
      setErrors({ name: nameErr, email: emailErr });
      addToast('Please fix the errors in the form before saving.', 'error');
      return;
    }

    setIsSaving(true);

    // Simulate server save with artificial delay for smooth experience
    setTimeout(() => {
      const settingsPayload = {
        name,
        email,
        apiKey,
        model,
        temperature,
        theme,
        notifications,
      };

      try {
        localStorage.setItem('app-settings', JSON.stringify(settingsPayload));
        setIsSaving(false);
        addToast('Settings successfully saved!', 'success');
      } catch (err) {
        setIsSaving(false);
        addToast('Failed to save settings. Local storage may be full.', 'error');
      }
    }, 1200);
  };

  if (!isMounted) {
    // Show a loading structure or skeleton to avoid flash of content
    return (
      <div className="settings-card">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="settings-card">
        <div className="header-section">
          <h1 className="title">System Settings</h1>
          <p className="subtitle">Configure your workspace defaults and AI engine settings.</p>
        </div>

        <form onSubmit={handleSubmit} className="form-group-section" noValidate>
          {/* Section: Profile */}
          <div>
            <h2 className="form-section-title">User Profile</h2>
            <div className="form-row two-cols">
              <div className="form-field">
                <label htmlFor="user-name" className="form-label">Full Name</label>
                <input
                  id="user-name"
                  type="text"
                  className={`form-input ${errors.name ? 'has-error' : ''}`}
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your name"
                  required
                />
                {errors.name && <span className="field-error-message">{errors.name}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="user-email" className="form-label">Email Address</label>
                <input
                  id="user-email"
                  type="email"
                  className={`form-input ${errors.email ? 'has-error' : ''}`}
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="name@example.com"
                  required
                />
                {errors.email && <span className="field-error-message">{errors.email}</span>}
              </div>
            </div>
          </div>

          {/* Section: AI Core Settings */}
          <div>
            <h2 className="form-section-title">AI Engine Settings</h2>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="api-key" className="form-label">
                  Gemini API Key
                  <span className="optional">Optional</span>
                </label>
                <div className="form-input-container">
                  <input
                    id="api-key"
                    type={showApiKey ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingRight: '45px' }}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                  />
                  <button
                    type="button"
                    className="eye-button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                  >
                    {showApiKey ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-row two-cols" style={{ marginTop: '1.5rem' }}>
              <div className="form-field">
                <label htmlFor="model-selector" className="form-label">Preferred Model</label>
                <select
                  id="model-selector"
                  className="form-select"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
                  <option value="gpt-4o">GPT-4o (Alternate)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Alternate)</option>
                </select>
              </div>

              <div className="form-field slider-container">
                <div className="slider-header">
                  <label htmlFor="temperature-slider" className="form-label">Temperature</label>
                  <span className="slider-value">{temperature.toFixed(1)}</span>
                </div>
                <input
                  id="temperature-slider"
                  type="range"
                  className="slider-input"
                  min="0.0"
                  max="2.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Section: Customization */}
          <div>
            <h2 className="form-section-title">App Customization</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Toggle
                id="theme-toggle"
                title="Light Mode"
                description="Use the light visual style instead of dark mode."
                checked={theme === 'light'}
                onChange={handleThemeChange}
              />
              <Toggle
                id="notification-toggle"
                title="System Notifications"
                description="Receive toast notifications for successful operations."
                checked={notifications}
                onChange={setNotifications}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="save-button"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="spinner" aria-hidden="true"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Custom Toast Alerts */}
      {toasts.length > 0 && (
        <div className="toast-container" role="live-notifications">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`toast ${toast.type}`}
              role="alert"
            >
              {toast.type === 'success' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
