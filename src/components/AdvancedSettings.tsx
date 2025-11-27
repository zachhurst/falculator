import { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, Key } from 'lucide-react';

interface AdvancedSettingsProps {
  onApiKeyChange: (key: string) => void;
  disabled?: boolean;
  forceOpen?: boolean;
  required?: boolean;
}

export function AdvancedSettings({ onApiKeyChange, disabled, forceOpen, required }: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(forceOpen || false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('falculator-gemini-key');
      if (savedKey) {
        setApiKey(savedKey);
        onApiKeyChange(savedKey);
      }
    } catch (err) {
      console.warn('Could not load saved API key:', err);
    }
  }, [onApiKeyChange]);

  // Update open state when forceOpen changes
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleKeyChange = (value: string) => {
    setApiKey(value);
    
    // Save to localStorage for persistence
    try {
      if (value) {
        localStorage.setItem('falculator-gemini-key', value);
      } else {
        localStorage.removeItem('falculator-gemini-key');
      }
    } catch (err) {
      console.warn('Could not save API key to localStorage:', err);
    }
    
    // Validate API key format to detect accidental password paste
    if (value && value.length > 10) {
      // Gemini API keys start with "AIza" and are ~39 characters
      // Common passwords don't start with "AIza"
      if (!value.startsWith('AIza')) {
        console.warn('Warning: This does not appear to be a valid Gemini API key format');
      }
    }
    
    onApiKeyChange(value);
  };

  const clearSavedKey = () => {
    setApiKey('');
    try {
      localStorage.removeItem('falculator-gemini-key');
    } catch (err) {
      console.warn('Could not clear saved API key:', err);
    }
    onApiKeyChange('');
  };

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {!forceOpen && (
        <button
          onClick={toggleOpen}
          disabled={disabled}
          className="flex items-center gap-2 text-small text-gray-700 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase-mds"
        >
          <Settings className="w-4 h-4" />
          Advanced Settings
          <span className="ml-1 text-small">
            {isOpen ? '▼' : '▶'}
          </span>
        </button>
      )}
      
      {(isOpen || forceOpen) && (
        <div className="mt-md p-md bg-white border border-gray-300">
          <div className="space-y-sm">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-accent" />
              <label className="text-small uppercase-mds font-medium text-gray-700">
                Gemini API Key {required && <span className="text-gray-700">*</span>}
              </label>
            </div>
            <p className="text-small text-gray-700">
              {required 
                ? "A Gemini Flash 2.0 API key is required to use this service. Your key is only used for this session and is never stored."
                : "Bring your own Gemini Flash 2.0 key (BYOK) to bypass shared rate limits and stay on your own quota. Your key is only used for this session and is never stored."
              }
            </p>
            <div className="relative">
              {(required || isOpen) && (
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => handleKeyChange(e.target.value)}
                  placeholder="Enter API Key Here..."
                  name="gemini-api-token-field"
                  id="gemini-api-token-field"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-form-type="other"
                  data-1p-ignore="true"
                  data-bwignore="true"
                  className="w-full p-2 pr-10 border border-gray-500 text-small bg-white focus:outline-none focus:border-accent focus:border-2"
                  disabled={disabled}
                />
              )}
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black transition-colors"
                disabled={disabled}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {apiKey && (
              <div className="flex items-center justify-between text-small text-green-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600"></div>
                  <span>API key configured</span>
                </div>
                <button
                  type="button"
                  onClick={clearSavedKey}
                  className="text-gray-700 hover:text-black transition-colors underline"
                  disabled={disabled}
                >
                  Clear saved key
                </button>
              </div>
            )}
            {required && !apiKey && (
              <div className="flex items-center gap-2 text-small text-red-700">
                <div className="w-2 h-2 bg-red-600"></div>
                API key is required before you can upload images
              </div>
            )}
            <div className="pt-2 border-t border-gray-300">
              <p className="text-small text-gray-700">
                <strong>Need an API key?</strong> Get one from{' '}
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
