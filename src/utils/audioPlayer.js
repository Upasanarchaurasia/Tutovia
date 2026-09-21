// Ultra-Soothing & Aesthetic Ambient Study Music Synthesizer
// Uses Web Audio API to create warm, lush, relaxing soundscapes

class AestheticAmbientEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.mode = 'ethereal'; // 'ethereal', 'lofi', 'rain'
    this.volume = 0.35;
    this.masterGain = null;
    this.activeNodes = [];
    this.timerId = null;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVolume(val) {
    this.volume = val;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(val, this.audioCtx.currentTime);
    }
  }

  play(mode = 'ethereal') {
    this.initContext();
    this.stop();
    this.mode = mode;
    this.isPlaying = true;

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    this.masterGain.connect(this.audioCtx.destination);

    if (mode === 'ethereal') {
      this.startEtherealPads();
    } else if (mode === 'lofi') {
      this.startWarmLofiChords();
    } else if (mode === 'rain') {
      this.startGentleRainChimes();
    } else if (mode === 'flute') {
      this.startKrishnaFlute();
    } else if (mode === 'cortisol') {
      this.startCortisolReset();
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) clearInterval(this.timerId);
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  // 1. Ethereal 432Hz Calm Waves (Lush, Soothing Ambient Pad)
  startEtherealPads() {
    // Fmaj9 - Cmaj9 ambient chord progression (432Hz tuning)
    const chords = [
      [172.8, 216.0, 259.2, 324.0, 432.0], // Fmaj9
      [129.6, 194.4, 259.2, 291.6, 388.8], // Cmaj9
      [144.0, 216.0, 270.0, 324.0, 432.0], // Dm9
      [162.0, 202.5, 243.0, 303.75, 405.0]  // Em7
    ];

    let chordIndex = 0;

    const playPad = () => {
      if (!this.isPlaying) return;
      const frequencies = chords[chordIndex % chords.length];
      chordIndex++;

      const now = this.audioCtx.currentTime;

      frequencies.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const filter = this.audioCtx.createBiquadFilter();
        const oscGain = this.audioCtx.createGain();

        osc.type = 'sine'; // Only sine waves for ultimate smoothness
        osc.frequency.setValueAtTime(freq, now);

        // Lower frequency lowpass filter for ultra warm aesthetic
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300 + (idx * 40), now);

        // Extremely slow, breathing attack & release
        oscGain.gain.setValueAtTime(0.0001, now);
        oscGain.gain.linearRampToValueAtTime(0.02, now + 4.5);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 13.5);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 14.0);
        this.activeNodes.push(osc, filter, oscGain);
      });
    };

    playPad();
    this.timerId = setInterval(playPad, 12000); // Super slow 12-second changes
  }

  // 2. Warm Lo-Fi Aesthetic Chords (Electric Piano / Rhodes style)
  startWarmLofiChords() {
    const lofiChords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ];

    let index = 0;
    const playLofi = () => {
      if (!this.isPlaying) return;
      const freqs = lofiChords[index % lofiChords.length];
      index++;

      const now = this.audioCtx.currentTime;
      freqs.forEach(freq => {
        const osc = this.audioCtx.createOscillator();
        const filter = this.audioCtx.createBiquadFilter();
        const oscGain = this.audioCtx.createGain();

        // Tape wobble (LFO) for vintage Lo-Fi feel
        const lfo = this.audioCtx.createOscillator();
        const lfoGain = this.audioCtx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(3.5, now); // 3.5Hz wobble rate
        lfoGain.gain.setValueAtTime(3.0, now); // Pitch variation amount
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + 4.5);

        osc.type = 'triangle'; // Richer harmonics for a keyboard sound
        osc.frequency.setValueAtTime(freq, now);

        // Filter envelope: bright pluck that decays into a warm tone
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 1.5);

        // Amp envelope: fast attack, piano-like decay
        oscGain.gain.setValueAtTime(0.0001, now);
        oscGain.gain.linearRampToValueAtTime(0.05, now + 0.05); // Fast hit
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8); // Natural fade out

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 4.5);
        this.activeNodes.push(osc, filter, oscGain, lfo, lfoGain);
      });
    };

    playLofi();
    // Faster chord progression for a rhythmic lo-fi study beat feel
    this.timerId = setInterval(playLofi, 4000);
  }

  // 3. Realistic Soft Rainy Day (Indoor perspective + Wind Gusts)
  startGentleRainChimes() {
    const bufferSize = 2 * this.audioCtx.sampleRate; // 2 seconds of noise
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Generate true Brown Noise (more bass, softer highs than pink/white noise)
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02; // Brown noise integration
      lastOut = output[i];
      output[i] *= 3.5; // Compensate for volume drop
    }

    // Rain Base (Distant rumble)
    const rainSource = this.audioCtx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    // Filter to muffle it so it sounds like being inside on a rainy day
    const rainFilter = this.audioCtx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 400; // Very soft, muffled rain

    // Wind Gust LFO (Slow volume modulation to make it dynamic and realistic)
    const windGain = this.audioCtx.createGain();
    windGain.gain.value = 0.6; // Base volume

    const windLfo = this.audioCtx.createOscillator();
    windLfo.type = 'sine';
    windLfo.frequency.value = 0.08; // Very slow gust (approx every 12 seconds)
    
    const windLfoDepth = this.audioCtx.createGain();
    windLfoDepth.gain.value = 0.35; // Depth of the wind gust

    windLfo.connect(windLfoDepth);
    windLfoDepth.connect(windGain.gain);

    rainSource.connect(rainFilter);
    rainFilter.connect(windGain);
    windGain.connect(this.masterGain);

    rainSource.start();
    windLfo.start();
    this.activeNodes.push(rainSource, rainFilter, windGain, windLfo, windLfoDepth);
  }

  // 4. Krishna Flute (Bansuri style with Tanpura drone)
  startKrishnaFlute() {
    // Raag-inspired scale in 432Hz tuning
    const fluteNotes = [324.0, 364.5, 432.0, 486.0, 540.0, 648.0, 432.0];
    let noteIndex = 0;

    // Background Tanpura Drone
    const startTanpura = () => {
      const tanpuraNotes = [216.0, 324.0];
      tanpuraNotes.forEach(freq => {
        const drone = this.audioCtx.createOscillator();
        const droneGain = this.audioCtx.createGain();
        drone.type = 'triangle';
        drone.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        droneGain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);
        drone.connect(droneGain);
        droneGain.connect(this.masterGain);
        drone.start();
        this.activeNodes.push(drone, droneGain);
      });
    };
    startTanpura();

    const playFlute = () => {
      if (!this.isPlaying || this.mode !== 'flute') return;
      const freq = fluteNotes[noteIndex % fluteNotes.length];
      noteIndex++;
      
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();
      
      // Flute character: smooth sine
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      // Vibrato LFO (crucial for expressive bamboo flute)
      const vibrato = this.audioCtx.createOscillator();
      const vibratoGain = this.audioCtx.createGain();
      vibrato.type = 'sine';
      vibrato.frequency.setValueAtTime(5, now); // 5Hz vibrato
      vibratoGain.gain.setValueAtTime(4, now); // pitch depth
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      vibrato.start(now);
      vibrato.stop(now + 6);

      // Breath envelope
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.linearRampToValueAtTime(0.08, now + 1.0); // Soft breath attack
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5); // Slow release

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 6);
      this.activeNodes.push(osc, filter, oscGain, vibrato, vibratoGain);
    };

    playFlute();
    this.timerId = setInterval(playFlute, 6000); // Meditative phrasing
  }

  // 5. Cortisol Reset (Binaural Beats & Deep Delta Waves)
  startCortisolReset() {
    // 432Hz base / 4 = 108Hz bass drone, with 4Hz Delta difference (Binaural)
    const baseFreq = 108.0; 
    const deltaDiff = 4.0; // 4Hz delta wave (deep sleep/healing)

    const now = this.audioCtx.currentTime;

    // Stereo panning for Binaural effect
    const leftPanner = this.audioCtx.createStereoPanner ? this.audioCtx.createStereoPanner() : this.audioCtx.createPanner();
    const rightPanner = this.audioCtx.createStereoPanner ? this.audioCtx.createStereoPanner() : this.audioCtx.createPanner();
    
    if (leftPanner.pan) {
      leftPanner.pan.value = -1; // Hard left
      rightPanner.pan.value = 1; // Hard right
    } else {
      leftPanner.setPosition(-1, 0, 0);
      rightPanner.setPosition(1, 0, 0);
    }

    // Left Ear (Base Frequency)
    const leftOsc = this.audioCtx.createOscillator();
    const leftGain = this.audioCtx.createGain();
    leftOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(baseFreq, now);
    leftGain.gain.value = 0.2;
    leftOsc.connect(leftPanner);
    leftPanner.connect(leftGain);
    leftGain.connect(this.masterGain);
    leftOsc.start();

    // Right Ear (Base + Delta Frequency)
    const rightOsc = this.audioCtx.createOscillator();
    const rightGain = this.audioCtx.createGain();
    rightOsc.type = 'sine';
    rightOsc.frequency.setValueAtTime(baseFreq + deltaDiff, now);
    rightGain.gain.value = 0.2;
    rightOsc.connect(rightPanner);
    rightPanner.connect(rightGain);
    rightGain.connect(this.masterGain);
    rightOsc.start();

    // Very slow breathing drone overlay
    const playDrone = () => {
      if (!this.isPlaying || this.mode !== 'cortisol') return;
      const droneNow = this.audioCtx.currentTime;
      const drone = this.audioCtx.createOscillator();
      const droneFilter = this.audioCtx.createBiquadFilter();
      const droneAmp = this.audioCtx.createGain();
      
      drone.type = 'triangle';
      drone.frequency.setValueAtTime(216.0, droneNow); 
      
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(250, droneNow); // Ultra muffled

      droneAmp.gain.setValueAtTime(0.0001, droneNow);
      droneAmp.gain.linearRampToValueAtTime(0.04, droneNow + 6.0); // 6s inhale
      droneAmp.gain.exponentialRampToValueAtTime(0.0001, droneNow + 16.0); // 10s exhale

      drone.connect(droneFilter);
      droneFilter.connect(droneAmp);
      droneAmp.connect(this.masterGain);
      
      drone.start(droneNow);
      drone.stop(droneNow + 17.0);
      this.activeNodes.push(drone, droneFilter, droneAmp);
    };

    playDrone();
    this.timerId = setInterval(playDrone, 16000); // 16 second breath cycles

    this.activeNodes.push(leftOsc, leftPanner, leftGain, rightOsc, rightPanner, rightGain);
  }
}

export const aestheticSoundEngine = new AestheticAmbientEngine();
