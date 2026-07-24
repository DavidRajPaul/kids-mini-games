#!/usr/bin/env python3
"""
Generate soft, calm WAV sound effects for Ezra Brain Games.
Kids-friendly: short, low amplitude, gentle sine tones.
No harsh transients — quick fade in/out envelope.
"""
import math
import os
import struct
import wave

SAMPLE_RATE = 44100
AMPLITUDE = 0.28  # gentle, well under peak

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "sounds")
os.makedirs(OUT_DIR, exist_ok=True)


def envelope(i: int, total: int, attack_ms: float = 15, release_ms: float = 60) -> float:
    """Linear attack + exponential release envelope to avoid clicks."""
    attack = int(SAMPLE_RATE * attack_ms / 1000)
    release = int(SAMPLE_RATE * release_ms / 1000)
    if i < attack:
        return i / attack
    if i > total - release:
        # exponential-ish decay
        x = (total - i) / release
        return max(0.0, x * x)
    return 1.0


def synth(filename: str, notes, duration_ms: float):
    """Sum weighted sine tones with envelope."""
    total = int(SAMPLE_RATE * duration_ms / 1000)
    frames = bytearray()
    for i in range(total):
        env = envelope(i, total)
        sample = 0.0
        for freq, weight in notes:
            sample += weight * math.sin(2 * math.pi * freq * i / SAMPLE_RATE)
        sample = sample * env * AMPLITUDE
        # clip softly
        sample = max(-1.0, min(1.0, sample))
        frames += struct.pack("<h", int(sample * 32767))

    path = os.path.join(OUT_DIR, filename)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SAMPLE_RATE)
        w.writeframes(bytes(frames))
    print(f"wrote {path} ({total} samples, {duration_ms}ms)")


# Soft, calm palette of sounds. Pentatonic-ish, no dissonance.

# Tap — very short soft click (single low-mid tone)
synth("tap.wav", [(660, 1.0)], 90)

# Button — slightly warmer tap
synth("button.wav", [(523.25, 0.8), (659.25, 0.4)], 120)  # C5 + E5

# Correct — pleasant two-note rise C5 -> G5
def rise():
    total_ms = 320
    total = int(SAMPLE_RATE * total_ms / 1000)
    frames = bytearray()
    mid = total // 2
    for i in range(total):
        env = envelope(i, total, 20, 120)
        freq = 523.25 if i < mid else 783.99  # C5 -> G5
        sample = math.sin(2 * math.pi * freq * i / SAMPLE_RATE)
        sample = sample * env * AMPLITUDE
        frames += struct.pack("<h", int(sample * 32767))
    path = os.path.join(OUT_DIR, "correct.wav")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SAMPLE_RATE)
        w.writeframes(bytes(frames))
    print(f"wrote {path}")


rise()

# Wrong — very soft, no harsh buzz. Two-note gentle fall E5 -> C5, low amplitude
def fall():
    total_ms = 260
    total = int(SAMPLE_RATE * total_ms / 1000)
    frames = bytearray()
    mid = total // 2
    for i in range(total):
        env = envelope(i, total, 20, 100)
        freq = 659.25 if i < mid else 523.25  # E5 -> C5
        sample = math.sin(2 * math.pi * freq * i / SAMPLE_RATE)
        sample = sample * env * (AMPLITUDE * 0.85)
        frames += struct.pack("<h", int(sample * 32767))
    path = os.path.join(OUT_DIR, "wrong.wav")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SAMPLE_RATE)
        w.writeframes(bytes(frames))
    print(f"wrote {path}")


fall()

# Star — sparkly bell-ish, C6+E6 sum, medium
synth("star.wav", [(1046.5, 0.7), (1318.5, 0.5)], 260)

# Complete — arpeggio C5, E5, G5, C6
def complete():
    notes_seq = [523.25, 659.25, 783.99, 1046.5]
    step_ms = 130
    step_samples = int(SAMPLE_RATE * step_ms / 1000)
    frames = bytearray()
    for freq in notes_seq:
        total = step_samples
        for i in range(total):
            env = envelope(i, total, 8, 60)
            sample = math.sin(2 * math.pi * freq * i / SAMPLE_RATE)
            sample = sample * env * AMPLITUDE
            frames += struct.pack("<h", int(sample * 32767))
    path = os.path.join(OUT_DIR, "complete.wav")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SAMPLE_RATE)
        w.writeframes(bytes(frames))
    print(f"wrote {path}")


complete()

print("Done.")
