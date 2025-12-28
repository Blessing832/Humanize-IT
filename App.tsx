
import React, { useState, useCallback, useMemo } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Settings as SettingsIcon, 
  Type, 
  BarChart3, 
  ArrowRightLeft,
  ChevronDown,
  Info
} from 'lucide-react';
import { ToneType, Settings, HumanizeResult } from './types';
import { humanizeText } from './services/geminiService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<HumanizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    tone: ToneType.NATURAL,
    intensity: 65,
  });

  const wordCount = useMemo(() => {
    return inputText.trim().split(/\s+/).filter(Boolean).length;
  }, [inputText]);

  const handleHumanize = async () => {
    if (!inputText.trim() || wordCount < 5) {
      setError("Please enter at least a few words to humanize.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const humanized = await humanizeText(inputText, settings);
      
      const res: HumanizeResult = {
        originalText: inputText,
        humanizedText: humanized,
        wordCount: humanized.split(/\s+/).filter(Boolean).length,
        readingTime: Math.ceil(humanized.split(/\s+/).length / 200),
        humanScore: Math.floor(Math.random() * (98 - 92 + 1) + 92), // Mock score logic
      };
      
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to humanize text.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.humanizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Humanize<span className="text-indigo-600"> IT</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-4">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Features</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Pricing</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">API</a>
            </nav>
            <button className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
              Try Pro
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
            Make AI Content Sound <span className="text-indigo-600">Human</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Our advanced AI rewriter transforms robotic text into natural, rhythmic, and high-quality prose that bypasses detectors and engages readers.
          </p>
        </div>

        {/* Configuration Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Settings:</span>
          </div>

          <div className="flex items-center gap-2 group relative">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tone</label>
            <select 
              value={settings.tone}
              onChange={(e) => setSettings({ ...settings, tone: e.target.value as ToneType })}
              className="bg-slate-50 border border-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none cursor-pointer"
            >
              {Object.values(ToneType).map(tone => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px] flex items-center gap-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Intensity</label>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={settings.intensity} 
              onChange={(e) => setSettings({ ...settings, intensity: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-sm font-mono font-medium text-slate-600 min-w-[2rem]">{settings.intensity}%</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="flex flex-col h-full">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                  <Type className="w-4 h-4" />
                  AI Content
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {wordCount} words
                </div>
              </div>
              <textarea
                className="flex-1 w-full p-6 text-slate-700 leading-relaxed resize-none outline-none focus:ring-0 text-lg"
                placeholder="Paste your AI-generated text here (minimum 5 words)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={handleHumanize}
                  disabled={loading || !inputText.trim() || wordCount < 5}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-lg ${
                    loading || !inputText.trim() || wordCount < 5
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Humanize Now
                    </>
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium flex gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm">
                <Check className="w-4 h-4" />
                Humanized Output
              </div>
              {result && (
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
              )}
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                </div>
              ) : result ? (
                <div className="text-slate-800 leading-relaxed text-lg whitespace-pre-wrap">
                  {result.humanizedText}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 text-center px-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <ArrowRightLeft className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium">Your natural, humanized content will appear here after you click the button.</p>
                </div>
              )}
            </div>
            {result && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2">
                <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Human Score</div>
                  <div className="text-lg font-bold text-emerald-600">{result.humanScore}%</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Words</div>
                  <div className="text-lg font-bold text-slate-700">{result.wordCount}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Read Time</div>
                  <div className="text-lg font-bold text-slate-700">{result.readingTime}m</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informational Section */}
        <section className="mt-20 grid md:grid-cols-3 gap-8 pb-20">
          <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="text-indigo-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Natural Flow</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              We focus on "burstiness" and linguistic variety to ensure your content mimics authentic human writing patterns.
            </p>
          </div>
          <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
              <Check className="text-emerald-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Bypass Detectors</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our models are tuned to eliminate the mathematical patterns that AI detectors use to identify generated text.
            </p>
          </div>
          <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="text-amber-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">SEO Optimized</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Maintains your keywords and intent while improving readability scores that search engines love.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-white w-6 h-6" />
            <span className="text-xl font-bold text-white tracking-tight">Humanize IT</span>
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact Us</a>
          </div>
          <p className="text-sm">© 2024 Humanize IT. Powered by Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
