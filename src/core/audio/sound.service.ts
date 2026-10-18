import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Hubio Executive Sound & Haptic Feedback Engine
 * Ultra-responsive zero-latency audio synthesizer (Web Audio API)
 * synchronized with iOS & Android haptic feedback motors.
 */
class SoundService {
  private audioCtx: any = null;

  private getAudioContext(): any {
    if (typeof window !== 'undefined') {
      const AudioContextClass =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        if (!this.audioCtx) {
          this.audioCtx = new AudioContextClass();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        return this.audioCtx;
      }
    }
    return null;
  }

  /**
   * Crisp micro-click for buttons and toggles
   */
  playClick() {
    this.triggerHaptic('light');
    if (Platform.OS !== 'web') return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Safe fallback
    }
  }

  /**
   * Smooth bubble pop tone for tabs and chips
   */
  playPop() {
    this.triggerHaptic('selection');
    if (Platform.OS !== 'web') return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Safe fallback
    }
  }

  /**
   * Elegant dual-tone harmonic chime for approvals & successful orders
   */
  playSuccess() {
    this.triggerHaptic('success');
    if (Platform.OS !== 'web') return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      [
        { freq: 587.33, start: 0, duration: 0.25 }, // D5
        { freq: 880.0, start: 0.08, duration: 0.4 }, // A5
      ].forEach((tone) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone.freq, now + tone.start);

        gain.gain.setValueAtTime(0.15, now + tone.start);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          now + tone.start + tone.duration
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + tone.start);
        osc.stop(now + tone.start + tone.duration);
      });
    } catch {
      // Safe fallback
    }
  }

  /**
   * Luxurious bell chime for incoming live Webhook push notifications
   */
  playNotification() {
    this.triggerHaptic('medium');
    if (Platform.OS !== 'web') return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      [
        { freq: 783.99, start: 0, duration: 0.2 }, // G5
        { freq: 1046.5, start: 0.09, duration: 0.45 }, // C6
      ].forEach((tone) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone.freq, now + tone.start);

        gain.gain.setValueAtTime(0.18, now + tone.start);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          now + tone.start + tone.duration
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + tone.start);
        osc.stop(now + tone.start + tone.duration);
      });
    } catch {
      // Safe fallback
    }
  }

  private triggerHaptic(type: 'light' | 'medium' | 'selection' | 'success' | 'warning') {
    if (Platform.OS === 'web') return;
    try {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          break;
        case 'selection':
          Haptics.selectionAsync().catch(() => {});
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
          break;
      }
    } catch {
      // Ignore if hardware does not support
    }
  }
}

export const soundService = new SoundService();
