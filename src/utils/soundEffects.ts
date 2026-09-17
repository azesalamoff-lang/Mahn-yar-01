import { MusicalNote } from '../types';
import { getAudioTrackUrl } from './audioStorage';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Team Number & Buzzer Sound (Bright, vibrant, TV Game Show broadcast bell & chime)
export function playBuzzerSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Master presence filter for broadcast clarity and high-frequency sparkle
    const presenceFilter = ctx.createBiquadFilter();
    presenceFilter.type = 'peaking';
    presenceFilter.frequency.setValueAtTime(2800, now);
    presenceFilter.Q.setValueAtTime(1.4, now);
    presenceFilter.gain.setValueAtTime(6.0, now); // +6dB studio sparkle

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.85, now);

    presenceFilter.connect(masterGain);
    masterGain.connect(ctx.destination);

    // 1. Instant transient tactile click (15ms sharp high-end click)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(2400, now);
    clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.025);
    clickGain.gain.setValueAtTime(0.4, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    clickOsc.connect(clickGain);
    clickGain.connect(presenceFilter);
    clickOsc.start(now);
    clickOsc.stop(now + 0.025);

    // 2. STRIKE 1 (t = 0.0s - 0.12s): TV Show Alert Accent (G5 + D6 + G6)
    const strike1Notes = [
      { freq: 783.99, type: 'triangle' as OscillatorType, vol: 0.45 },   // G5
      { freq: 1174.66, type: 'sine' as OscillatorType, vol: 0.5 },      // D6
      { freq: 1567.98, type: 'triangle' as OscillatorType, vol: 0.35 }   // G6
    ];

    strike1Notes.forEach(({ freq, type, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(presenceFilter);

      osc.start(now);
      osc.stop(now + 0.15);
    });

    // 3. STRIKE 2 (t = 0.07s - 0.48s): Resolving High TV Show Chime Bell (C6 + E6 + G6 + C7 + Shimmer E7)
    const st2 = now + 0.07;
    const strike2Notes = [
      { freq: 1046.50, type: 'triangle' as OscillatorType, vol: 0.5 },   // C6
      { freq: 1318.51, type: 'sine' as OscillatorType, vol: 0.55 },     // E6
      { freq: 1567.98, type: 'triangle' as OscillatorType, vol: 0.4 },   // G6
      { freq: 2093.00, type: 'sine' as OscillatorType, vol: 0.45 },     // C7 (Super bright crystal)
      { freq: 2637.02, type: 'sine' as OscillatorType, vol: 0.25 }      // E7 (Sparkling overtone)
    ];

    strike2Notes.forEach(({ freq, type, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, st2);

      gain.gain.setValueAtTime(0.01, st2);
      gain.gain.linearRampToValueAtTime(vol, st2 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, st2 + 0.42);

      osc.connect(gain);
      gain.connect(presenceFilter);

      osc.start(st2);
      osc.stop(st2 + 0.45);
    });
  } catch (e) {
    console.warn('Audio play error', e);
  }
}

// Alias for semantic clarity
export const playTeamNumberSound = playBuzzerSound;

// Correct Answer sound (bright celebratory chime)
export function playCorrectSound() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + index * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  } catch (e) {
    console.warn('Audio play error', e);
  }
}

// Wrong Answer sound
export function playWrongSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.setValueAtTime(110, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.warn('Audio play error', e);
  }
}

// Tick sound for stopwatch
export function playTickSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    console.warn('Audio play error', e);
  }
}

// Time's Up Alarm
export function playTimesUpSound() {
  try {
    const ctx = getAudioContext();
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = ctx.currentTime + i * 0.18;

      osc.type = 'square';
      osc.frequency.setValueAtTime(587.33, st); // D5

      gain.gain.setValueAtTime(0.25, st);
      gain.gain.exponentialRampToValueAtTime(0.01, st + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(st);
      osc.stop(st + 0.12);
    }
  } catch (e) {
    console.warn('Audio play error', e);
  }
}

// Fanfare / Champion Anthem
export function playVictoryFanfare() {
  try {
    const ctx = getAudioContext();
    const chords = [
      { f: 523.25, t: 0 },
      { f: 523.25, t: 0.15 },
      { f: 523.25, t: 0.3 },
      { f: 659.25, t: 0.45 },
      { f: 783.99, t: 0.75 },
      { f: 1046.5, t: 1.05 }
    ];

    chords.forEach(c => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = ctx.currentTime + c.t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(c.f, st);

      gain.gain.setValueAtTime(0.35, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(st);
      osc.stop(st + 0.45);
    });
  } catch (e) {
    console.warn('Audio play error', e);
  }
}

// Melody Synthesizer player
let activeOscillators: OscillatorNode[] = [];
let isPlayingMelody = false;

export function stopCurrentMelody() {
  activeOscillators.forEach(osc => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // already stopped
    }
  });
  activeOscillators = [];
  isPlayingMelody = false;
}

export function playMelodyNotes(
  notes: MusicalNote[], 
  onNoteChange?: (index: number) => void, 
  onComplete?: () => void
): () => void {
  stopCurrentMelody();
  const ctx = getAudioContext();
  isPlayingMelody = true;
  activeOscillators = [];

  let accumulatedTime = 0.05;

  notes.forEach((note, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const noteStart = ctx.currentTime + accumulatedTime;
    const noteDuration = note.duration;

    osc.type = note.type || 'sine';
    osc.frequency.setValueAtTime(note.freq, noteStart);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, noteStart);
    gain.gain.linearRampToValueAtTime(0.28, noteStart + 0.03);
    gain.gain.setValueAtTime(0.28, noteStart + noteDuration * 0.85);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteStart);
    osc.stop(noteStart + noteDuration);
    activeOscillators.push(osc);

    // Schedule visual callback
    if (onNoteChange) {
      setTimeout(() => {
        if (isPlayingMelody) onNoteChange(index);
      }, accumulatedTime * 1000);
    }

    accumulatedTime += noteDuration;
  });

  const totalDuration = accumulatedTime;
  const timeoutId = setTimeout(() => {
    isPlayingMelody = false;
    activeOscillators = [];
    if (onComplete) onComplete();
  }, totalDuration * 1000);

  return () => {
    clearTimeout(timeoutId);
    stopCurrentMelody();
  };
}

// Global HTML5 audio instances and race-condition prevention
let currentHtmlAudio: HTMLAudioElement | null = null;
let currentActiveSongId: string | null = null;
let currentPlaybackToken = 0;
const activeAudioElements = new Set<HTMLAudioElement>();

export function stopAllPlayback() {
  currentPlaybackToken++;
  stopCurrentMelody();

  activeAudioElements.forEach((audio) => {
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      audio.onended = null;
      audio.onerror = null;
    } catch {
      // ignore
    }
  });
  activeAudioElements.clear();

  if (currentHtmlAudio) {
    try {
      currentHtmlAudio.pause();
      currentHtmlAudio.currentTime = 0;
      currentHtmlAudio.src = '';
      currentHtmlAudio.onended = null;
      currentHtmlAudio.onerror = null;
    } catch {
      // ignore
    }
    currentHtmlAudio = null;
  }
  currentActiveSongId = null;
}

export function pauseAllPlayback(): boolean {
  if (currentHtmlAudio && !currentHtmlAudio.paused) {
    try {
      currentHtmlAudio.pause();
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function resumeAllPlayback(): boolean {
  if (currentHtmlAudio && currentHtmlAudio.paused) {
    try {
      currentHtmlAudio.play().catch(console.warn);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function isPlaybackPaused(): boolean {
  return currentHtmlAudio !== null && currentHtmlAudio.paused;
}

export function isPlaybackActive(): boolean {
  return (currentHtmlAudio !== null && !currentHtmlAudio.paused) || isPlayingMelody;
}

export async function playSongAudioOrMelody(
  songId: string,
  melodyNotes?: MusicalNote[],
  onNoteChange?: (index: number) => void,
  onComplete?: () => void,
  clipStartSeconds?: number,
  clipDurationSeconds?: number
): Promise<() => void> {
  // If the same song is already paused, simply resume it seamlessly
  if (currentActiveSongId === songId && currentHtmlAudio && currentHtmlAudio.paused) {
    try {
      await currentHtmlAudio.play();
      return () => {
        stopAllPlayback();
      };
    } catch (e) {
      console.warn('Resume error, restarting', e);
    }
  }

  stopAllPlayback();
  const thisToken = ++currentPlaybackToken;
  currentActiveSongId = songId;

  // Try custom uploaded audio from IndexedDB first
  try {
    const customUrl = await getAudioTrackUrl(songId);
    if (thisToken !== currentPlaybackToken) {
      return () => {};
    }

    if (customUrl) {
      const audio = new Audio(customUrl);
      activeAudioElements.add(audio);
      currentHtmlAudio = audio;

      let clipTimeoutId: ReturnType<typeof setTimeout> | null = null;
      const clearClipTimeout = () => {
        if (clipTimeoutId) {
          clearTimeout(clipTimeoutId);
          clipTimeoutId = null;
        }
      };

      audio.onended = () => {
        clearClipTimeout();
        activeAudioElements.delete(audio);
        if (currentHtmlAudio === audio) {
          currentHtmlAudio = null;
          currentActiveSongId = null;
        }
        if (onComplete) onComplete();
      };

      audio.onerror = (e) => {
        clearClipTimeout();
        activeAudioElements.delete(audio);
        if (thisToken !== currentPlaybackToken) return;
        console.warn('Custom audio playback error, falling back to synth melody', e);
        if (currentHtmlAudio === audio) {
          currentHtmlAudio = null;
          currentActiveSongId = null;
        }
        if (melodyNotes && melodyNotes.length > 0) {
          playMelodyNotes(melodyNotes, onNoteChange, onComplete);
        } else if (onComplete) {
          onComplete();
        }
      };

      // Clip start trim wait
      if (clipStartSeconds && clipStartSeconds > 0) {
        await new Promise<void>((resolve) => {
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            audio.removeEventListener('seeked', onSeeked);
            resolve();
          };
          const onSeeked = () => finish();

          const doSeek = () => {
            audio.addEventListener('seeked', onSeeked, { once: true });
            try {
              audio.currentTime = clipStartSeconds;
            } catch {
              finish();
            }
          };

          if (audio.readyState >= 1 /* HAVE_METADATA */) {
            doSeek();
          } else {
            audio.addEventListener('loadedmetadata', doSeek, { once: true });
          }

          setTimeout(finish, 400);
        });
      }

      if (thisToken !== currentPlaybackToken) {
        try {
          audio.pause();
          audio.currentTime = 0;
          audio.src = '';
        } catch {}
        activeAudioElements.delete(audio);
        return () => {};
      }

      await audio.play();

      if (thisToken !== currentPlaybackToken) {
        try {
          audio.pause();
          audio.currentTime = 0;
          audio.src = '';
        } catch {}
        activeAudioElements.delete(audio);
        return () => {};
      }

      // Optional clip length: auto-stop playback after N seconds (if specifically configured)
      if (clipDurationSeconds && clipDurationSeconds > 0) {
        clipTimeoutId = setTimeout(() => {
          if (currentHtmlAudio === audio && thisToken === currentPlaybackToken) {
            audio.pause();
            activeAudioElements.delete(audio);
            currentHtmlAudio = null;
            currentActiveSongId = null;
            if (onComplete) onComplete();
          }
        }, clipDurationSeconds * 1000);
      }

      return () => {
        clearClipTimeout();
        stopAllPlayback();
      };
    }
  } catch (err) {
    console.warn('Custom audio check error, fallback to synth', err);
  }

  if (thisToken !== currentPlaybackToken) {
    return () => {};
  }

  // Fallback to built-in musical note synthesis
  if (melodyNotes && melodyNotes.length > 0) {
    return playMelodyNotes(melodyNotes, onNoteChange, onComplete);
  } else {
    if (onComplete) onComplete();
    return () => {};
  }
}

