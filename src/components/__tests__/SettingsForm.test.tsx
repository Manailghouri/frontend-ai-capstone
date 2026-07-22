import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import SettingsForm from '../SettingsForm';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('SettingsForm Component', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the settings form with all inputs and defaults', () => {
    render(<SettingsForm />);
    
    // Check form fields are present
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Interface Theme/i)).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: /Enable Notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Settings/i })).toBeInTheDocument();
  });

  it('displays validation errors when fields are empty on submit', async () => {
    render(<SettingsForm />);
    
    const saveButton = screen.getByRole('button', { name: /Save Settings/i });
    await userEvent.click(saveButton);

    // Verify errors are shown
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('displays a validation error for an invalid email address', async () => {
    render(<SettingsForm />);
    
    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);

    // Fill in name
    await userEvent.type(nameInput, 'John Doe');
    
    // Fill in invalid email
    await userEvent.type(emailInput, 'invalid-email');

    // Trigger submit
    const saveButton = screen.getByRole('button', { name: /Save Settings/i });
    await userEvent.click(saveButton);

    // Verify email validation message
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('submits successfully and shows success notification on valid inputs', () => {
    vi.useFakeTimers();
    render(<SettingsForm />);
    
    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);

    // Use fireEvent to set values directly to avoid userEvent's async typing delays under fake timers
    fireEvent.change(nameInput, { target: { value: 'Alice Smith' } });
    fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });

    // Select dark theme
    const darkButton = screen.getByRole('radio', { name: /Dark/i });
    fireEvent.click(darkButton);

    // Submit form
    const saveButton = screen.getByRole('button', { name: /Save Settings/i });
    fireEvent.click(saveButton);

    // Should show loading state
    expect(screen.getByText(/Saving Settings.../i)).toBeInTheDocument();

    // Advance timers by 1000ms inside act() to flush react state updates
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Check success toast is now present
    expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument();

    // Verify localStorage has correct payload
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'app-settings',
      JSON.stringify({
        fullName: 'Alice Smith',
        email: 'alice@example.com',
        theme: 'dark',
        notifications: true,
      })
    );

    // Check theme attribute on html tag
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('respects system theme preference and removes data-theme attribute', async () => {
    render(<SettingsForm />);

    const systemButton = screen.getByRole('radio', { name: /System/i });
    await userEvent.click(systemButton);

    // Verify data-theme is removed
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('supports full keyboard tab navigation', async () => {
    render(<SettingsForm />);
    
    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const lightButton = screen.getByRole('radio', { name: /Light/i });

    // Focus on first element
    nameInput.focus();
    expect(document.activeElement).toBe(nameInput);

    // Press tab to move to email input
    await userEvent.tab();
    expect(document.activeElement).toBe(emailInput);

    // Press tab to move to theme radio light button
    await userEvent.tab();
    expect(document.activeElement).toBe(lightButton);

    // Press tab to move to next theme button (dark)
    await userEvent.tab();
    const darkButton = screen.getByRole('radio', { name: /Dark/i });
    expect(document.activeElement).toBe(darkButton);
  });
});
