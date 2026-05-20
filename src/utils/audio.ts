// Web Audio API Synthesizer for satisfied, physics-based audio feedbacks
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a delicate physical mechanical wheel tick sound
 */
export function playTick(volume = 0.2, pitch = 400) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Mechanical wheel tick effect: crisp pitch drop
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05);

    // Short decay
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (error) {
    console.warn('Audio tick failed to play:', error);
  }
}

/**
 * Play a gorgeous, satisfying golden fanfare chord on landing on an option
 */
export function playFanfare(volume = 0.2) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Play a shiny Major Triad
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Warm, organ-like/chime-like waveform
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08); // slight arpeggio
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume / notes.length, now + idx * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.82);
      
      osc.start(now);
      osc.stop(now + 1.0);
    });
  } catch (error) {
    console.warn('Audio fanfare failed to play:', error);
  }
}
