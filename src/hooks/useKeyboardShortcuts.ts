/**
 * Custom hook for keyboard shortcuts in POS
 */

import { useEffect } from 'react';

interface KeyboardShortcuts {
  onNewTransaction?: () => void;
  onPayment?: () => void;
  onClearCart?: () => void;
  onSearch?: () => void;
  onBarcodeFocus?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      console.log('Key pressed:', event.key, 'Target:', event.target); // Debug log
      
      // Handle F-key shortcuts first (work everywhere)
      switch (event.key) {
        case 'F1':
          event.preventDefault();
          shortcuts.onBarcodeFocus?.();
          return;
        case 'F2':
          event.preventDefault();
          shortcuts.onNewTransaction?.();
          return;
        case 'F3':
          event.preventDefault();
          shortcuts.onPayment?.();
          return;
        case 'Escape':
          event.preventDefault();
          shortcuts.onClearCart?.();
          return;
      }

      // Skip Ctrl combinations if user is typing in an input (except Ctrl+F)
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        // Allow Ctrl+F even in inputs
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
          event.preventDefault();
          shortcuts.onSearch?.();
          return;
        }
        return;
      }

      // Handle Ctrl/Cmd + key combinations
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'n':
            event.preventDefault();
            shortcuts.onNewTransaction?.();
            break;
          case 'p':
            event.preventDefault();
            shortcuts.onPayment?.();
            break;
          case 'k':
            event.preventDefault();
            shortcuts.onClearCart?.();
            break;
          case 'f':
            event.preventDefault();
            shortcuts.onSearch?.();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts]);
};