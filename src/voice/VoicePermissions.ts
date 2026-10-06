import { MicrophonePermissionState } from './VoiceTypes';

export async function checkMicrophonePermission(): Promise<MicrophonePermissionState> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return 'unavailable';
  }

  try {
    if (navigator.permissions && navigator.permissions.query) {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      if (result.state === 'granted') return 'granted';
      if (result.state === 'denied') return 'denied';
      return 'prompt';
    }
  } catch {
    // Some browsers reject 'microphone' in permissions.query; proceed to test via getUserMedia if requested
  }

  return 'prompt';
}

export async function requestMicrophoneAccess(deviceId?: string): Promise<{ granted: boolean; stream?: MediaStream; error?: string }> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { granted: false, error: 'MediaDevices API unavailable in this browser environment.' };
  }

  try {
    const constraints: MediaStreamConstraints = {
      audio: deviceId && deviceId !== 'default' ? { deviceId: { exact: deviceId } } : true,
      video: false,
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return { granted: true, stream };
  } catch (err: any) {
    const errorMsg = err?.message || err?.name || 'Microphone access denied';
    return { granted: false, error: errorMsg };
  }
}

export interface AudioDeviceOption {
  deviceId: string;
  label: string;
}

export async function getAudioInputDevices(): Promise<AudioDeviceOption[]> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return [{ deviceId: 'default', label: 'Default Microphone' }];
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices
      .filter((d) => d.kind === 'audioinput')
      .map((d, index) => ({
        deviceId: d.deviceId || `mic-${index}`,
        label: d.label || `Microphone ${index + 1}`,
      }));

    if (audioInputs.length === 0) {
      return [{ deviceId: 'default', label: 'Default Microphone' }];
    }
    return audioInputs;
  } catch {
    return [{ deviceId: 'default', label: 'Default Microphone' }];
  }
}
