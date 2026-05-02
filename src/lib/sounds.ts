class SoundManager {
  private ctx: AudioContext | null = null;
  private synth: SpeechSynthesis = window.speechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    // Try to find a female Arabic voice
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      this.voice = voices.find(v => v.lang.includes('ar') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('mary') || v.name.toLowerCase().includes('zira'))) || 
                   voices.find(v => v.lang.includes('ar')) || null;
    };
    
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  speak(text: string) {
    // Cancel any ongoing speech
    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.pitch = 1.1; // Slightly higher pitch for a friendly teacher tone
    utterance.rate = 0.9;  // Slightly slower for clarity
    this.synth.speak(utterance);
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);

    // Random encouragement phrases
    const phrases = ["أحسنت يا بطل!", "إجابة ذكية جداً", "رائع، أنت عبقري في الكسور", "ممتاز، استمر هكذا!"];
    this.speak(phrases[Math.floor(Math.random() * phrases.length)]);
  }

  playError() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playClick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
}

export const sounds = new SoundManager();
