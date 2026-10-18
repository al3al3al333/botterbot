import React, { useState } from 'react';
import { Bell, Volume2, Sparkles, Check, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import { TradeAlert } from '../types';
import { playCyberSound, playGeminiTTS } from '../utils/audio';

interface Props {
  alerts: TradeAlert[];
  onClearAlerts: () => void;
}

export const AudioAlertsLog: React.FC<Props> = ({ alerts, onClearAlerts }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleSpeakAlert = async (alert: TradeAlert) => {
    setPlayingId(alert.id);
    playCyberSound('CLICK');

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Apex Alert: ${alert.title}. ${alert.message}`,
          speakerStyle: 'Urgent, high-tech tactical trading bot dispatch',
        }),
      });

      if (!res.ok) throw new Error('TTS failed');
      const data = await res.json();
      if (data.audioBase64) {
        await playGeminiTTS(data.audioBase64);
      }
    } catch (e) {
      console.warn('TTS playback issue:', e);
    } finally {
      setPlayingId(null);
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl flex flex-col h-full shadow-2xl overflow-hidden font-mono text-xs">
      <div className="px-4 py-2.5 border-b border-[#1e2638] bg-[#0d121f] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#14F195]" />
          <span className="font-bold text-white tracking-wide">REAL-TIME BOT TELEMETRY ALERTS</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-500/20 text-purple-300 font-bold">
            {alerts.length}
          </span>
        </div>
        <button
          onClick={onClearAlerts}
          className="text-slate-400 hover:text-white text-[11px] transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="p-2 flex-1 overflow-y-auto divide-y divide-[#171f30]">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs">
            No active bot alerts. Sniping triggers and arbitrage events will appear here in real time.
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="p-2.5 hover:bg-[#121824] transition-colors flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      alert.type === 'PROFIT'
                        ? 'bg-[#14F195]'
                        : alert.type === 'RISK'
                        ? 'bg-red-400'
                        : alert.type === 'SNIPE'
                        ? 'bg-[#9945FF]'
                        : 'bg-[#00F0FF]'
                    }`}
                  />
                  <span className="font-bold text-white text-xs">{alert.title}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] mt-0.5">{alert.message}</p>
              </div>

              <button
                disabled={playingId === alert.id}
                onClick={() => handleSpeakAlert(alert)}
                className="p-1.5 rounded-lg bg-[#182133] hover:bg-[#9945FF]/30 text-purple-300 hover:text-white transition-colors border border-[#26344d] cursor-pointer shrink-0"
                title="Speak Alert via Gemini Flash TTS"
              >
                <Volume2 className={`w-3.5 h-3.5 ${playingId === alert.id ? 'animate-bounce text-[#14F195]' : ''}`} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
