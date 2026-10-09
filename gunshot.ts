// Sparo sintetizzato con Web Audio: un rumore breve che decade + un "botto" grave.
export function playGunshot(): void {
  try {
    const AudioCtor = window.AudioContext;
    if (!AudioCtor) return;
    const ctx = new AudioCtor();
    const now = ctx.currentTime;

    const length = Math.floor(ctx.sampleRate * 0.5);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(1, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    noise.connect(noiseGain).connect(ctx.destination);
    noise.start(now);

    const boom = ctx.createOscillator();
    boom.type = "sine";
    boom.frequency.setValueAtTime(160, now);
    boom.frequency.exponentialRampToValueAtTime(35, now + 0.25);
    const boomGain = ctx.createGain();
    boomGain.gain.setValueAtTime(0.9, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    boom.connect(boomGain).connect(ctx.destination);
    boom.start(now);
    boom.stop(now + 0.35);

    setTimeout(() => void ctx.close(), 800);
  } catch {
    // Audio non disponibile: il gioco continua senza suono.
  }
}
