import { useState, useEffect } from 'react';
import { Settings, Key, Shield, Eye, EyeOff } from 'lucide-react';
import { SecurityInfoModal } from './SecurityInfoModal';
import type { ApiKeyConfig, AIProvider } from '@/lib/api';

interface AdvancedSettingsProps {
  onApiKeyChange: (config: ApiKeyConfig | undefined) => void;
  disabled?: boolean;
  forceOpen?: boolean;
  required?: boolean;
}

export function AdvancedSettings({ onApiKeyChange, disabled, forceOpen, required }: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(forceOpen || false);
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isKeyFocused, setIsKeyFocused] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('falculator-api-key');
      const savedProvider = localStorage.getItem('falculator-api-provider') as AIProvider || 'gemini';
      
      if (savedKey) {
        setApiKey(savedKey);
        setProvider(savedProvider);
        onApiKeyChange({ provider: savedProvider, key: savedKey });
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
        localStorage.setItem('falculator-api-key', value);
        localStorage.setItem('falculator-api-provider', provider);
      } else {
        localStorage.removeItem('falculator-api-key');
        localStorage.removeItem('falculator-api-provider');
      }
    } catch (err) {
      console.warn('Could not save API key to localStorage:', err);
    }
    
    // Validate API key format to detect accidental password paste
    if (value && value.length > 10) {
      // Gemini API keys start with "AIza" and are ~39 characters
      const isGeminiKey = value.startsWith('AIza') && value.length >= 35;
      // Fal.ai keys typically start with "fal-" or are longer alphanumeric strings
      const isFalaiKey = value.startsWith('fal-') || (value.length >= 20 && /^[a-f0-9-]+$/i.test(value));
      const isLikelyPassword = !isGeminiKey && !isFalaiKey && (value.includes(' ') || value.length < 20);
      
      if (isLikelyPassword) {
        // Clear if it looks like a password was accidentally pasted
        setApiKey('');
        localStorage.removeItem('falculator-api-key');
        localStorage.removeItem('falculator-api-provider');
        onApiKeyChange(undefined);
        return;
      }
    }
    
    const config: ApiKeyConfig | undefined = value ? { provider, key: value } : undefined;
    onApiKeyChange(config);
  };

  const clearSavedKey = () => {
    setApiKey('');
    try {
      localStorage.removeItem('falculator-api-key');
      localStorage.removeItem('falculator-api-provider');
    } catch (err) {
      console.warn('Could not clear saved API key:', err);
    }
    onApiKeyChange(undefined);
  };

  // Mask the API key for display
  const getDisplayValue = () => {
    if (!apiKey) return '';
    if (isKeyFocused) return apiKey; // Show real key when revealed
    // Mask with asterisks, show first 4 chars for identification
    if (apiKey.length <= 4) return '*'.repeat(apiKey.length);
    return apiKey.substring(0, 4) + '*'.repeat(apiKey.length - 4);
  };

  const toggleKeyVisibility = () => {
    setIsKeyFocused(!isKeyFocused);
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-accent" />
                <label className="text-small uppercase-mds font-medium text-gray-700">
                  API Key {required && <span className="text-gray-700">*</span>}
                </label>
              </div>
              <button
                type="button"
                onClick={() => setIsSecurityModalOpen(true)}
                className="flex items-center gap-1 text-small text-accent hover:underline transition-colors"
              >
                <Shield className="w-3 h-3" />
                Is my key secure?
              </button>
            </div>
            
            {/* Provider Selector */}
            <div className="flex items-center gap-4">
              <label className="text-small text-gray-700">Provider:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="provider"
                    value="gemini"
                    checked={provider === 'gemini'}
                    onChange={(e) => {
                      const newProvider = e.target.value as AIProvider;
                      setProvider(newProvider);
                      if (apiKey) {
                        const config: ApiKeyConfig = { provider: newProvider, key: apiKey };
                        localStorage.setItem('falculator-api-provider', newProvider);
                        onApiKeyChange(config);
                      }
                    }}
                    className="text-accent"
                    disabled={disabled}
                  />
                  <span className="text-small text-gray-700">Google Gemini</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="provider"
                    value="falai"
                    checked={provider === 'falai'}
                    onChange={(e) => {
                      const newProvider = e.target.value as AIProvider;
                      setProvider(newProvider);
                      if (apiKey) {
                        const config: ApiKeyConfig = { provider: newProvider, key: apiKey };
                        localStorage.setItem('falculator-api-provider', newProvider);
                        onApiKeyChange(config);
                      }
                    }}
                    className="text-accent"
                    disabled={disabled}
                  />
                  <span className="text-small text-gray-700">Fal.ai</span>
                </label>
              </div>
            </div>
            
            <p className="text-small text-gray-700">
              {required 
                ? `An API key is required to use this service. Your key is only used for this session and is never stored.`
                : `Bring your own API key (BYOK) to bypass shared rate limits and stay on your own quota. Your key is only used for this session and is never stored.`
              }
            </p>
            <div className="relative">
              {(required || isOpen) && (
                <>
                  <input
                    type="text"
                    value={getDisplayValue()}
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
                    className="w-full p-2 pr-10 border border-gray-500 text-small bg-white focus:outline-none focus:border-accent focus:border-2 font-mono"
                    disabled={disabled}
                  />
                  <button
                    type="button"
                    onClick={toggleKeyVisibility}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black transition-colors"
                    disabled={disabled}
                    title={isKeyFocused ? "Hide API key" : "Show API key"}
                  >
                    {isKeyFocused ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </>
              )}
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
      <SecurityInfoModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
}
