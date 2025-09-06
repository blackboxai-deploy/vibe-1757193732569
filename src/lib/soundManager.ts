import { NotificationEvent } from '@/types/messenger';
import { MSN_SOUNDS } from './constants';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<NotificationEvent, AudioBuffer | null> = new Map();
  private isEnabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    // Initialize audio context when needed
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      // Create AudioContext on user interaction to comply with browser policies
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    } catch (error) {
      console.warn('Could not initialize audio context:', error);
    }
  }

  public async loadSounds() {
    if (!this.audioContext) {
      await this.initializeAudioContext();
    }

    for (const sound of MSN_SOUNDS) {
      try {
        // For demo purposes, we'll create synthetic sounds
        // In a real implementation, you would load actual MSN sound files
        const buffer = this.createSyntheticSound(sound.event);
        this.sounds.set(sound.event, buffer);
      } catch (error) {
        console.warn(`Could not load sound for ${sound.event}:`, error);
        this.sounds.set(sound.event, null);
      }
    }
  }

  private createSyntheticSound(event: NotificationEvent): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    let duration: number;
    let frequency: number;

    // Define sound characteristics based on event type
    switch (event) {
      case NotificationEvent.MESSAGE_RECEIVED:
        duration = 0.3;
        frequency = 800;
        break;
      case NotificationEvent.CONTACT_ONLINE:
        duration = 0.5;
        frequency = 600;
        break;
      case NotificationEvent.CONTACT_OFFLINE:
        duration = 0.4;
        frequency = 400;
        break;
      case NotificationEvent.NUDGE:
        duration = 0.6;
        frequency = 1000;
        break;
      case NotificationEvent.LOGIN:
        duration = 1.0;
        frequency = 700;
        break;
      case NotificationEvent.LOGOUT:
        duration = 0.8;
        frequency = 500;
        break;
      default:
        duration = 0.3;
        frequency = 800;
    }

    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const channelData = buffer.getChannelData(0);

    // Generate a pleasant notification sound
    for (let i = 0; i < channelData.length; i++) {
      const time = i / sampleRate;
      const envelope = Math.exp(-time * 3); // Exponential decay
      
      let wave = 0;
      if (event === NotificationEvent.NUDGE) {
        // Nudge sound - more complex with vibrato
        wave = Math.sin(2 * Math.PI * frequency * time) * (1 + 0.3 * Math.sin(2 * Math.PI * 6 * time));
      } else {
        // Simple sine wave with harmonic
        wave = Math.sin(2 * Math.PI * frequency * time) + 0.3 * Math.sin(2 * Math.PI * frequency * 2 * time);
      }
      
      channelData[i] = wave * envelope * 0.3; // Keep volume reasonable
    }

    return buffer;
  }

  public async playSound(event: NotificationEvent): Promise<void> {
    if (!this.isEnabled || !this.audioContext) {
      return;
    }

    const buffer = this.sounds.get(event);
    if (!buffer) {
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      gainNode.gain.value = this.volume;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start(0);
    } catch (error) {
      console.warn(`Could not play sound for ${event}:`, error);
    }
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  public isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  // Initialize sounds on user interaction to comply with browser autoplay policies
  public async initializeSoundsOnUserAction(): Promise<void> {
    if (!this.audioContext || this.audioContext.state === 'suspended') {
      await this.initializeAudioContext();
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      await this.loadSounds();
    }
  }
}

export const soundManager = new SoundManager();