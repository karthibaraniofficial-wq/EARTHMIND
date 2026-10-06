/**
 * EARTHMIND - Google Gemini Live Error Hierarchy
 * Standardized error definitions for connection, audio, tools, and authentication.
 */

export type GeminiErrorCode =
  | 'AUTH_FAILED'
  | 'API_KEY_MISSING'
  | 'CONNECTION_TIMEOUT'
  | 'WEBSOCKET_CLOSED'
  | 'WEBSOCKET_ERROR'
  | 'AUDIO_CAPTURE_FAILED'
  | 'AUDIO_PLAYBACK_FAILED'
  | 'TOOL_NOT_FOUND'
  | 'TOOL_PARAM_INVALID'
  | 'TOOL_EXECUTION_FAILED'
  | 'QUOTA_EXCEEDED'
  | 'RATE_LIMITED'
  | 'SESSION_EXPIRED'
  | 'UNKNOWN_ERROR';

export class GeminiLiveError extends Error {
  public code: GeminiErrorCode;
  public details?: any;
  public timestamp: string;

  constructor(message: string, code: GeminiErrorCode = 'UNKNOWN_ERROR', details?: any) {
    super(message);
    this.name = 'GeminiLiveError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, GeminiLiveError.prototype);
  }
}

export class GeminiAuthError extends GeminiLiveError {
  constructor(message: string = 'Gemini authentication failed or API key missing on secure server', details?: any) {
    super(message, 'AUTH_FAILED', details);
    this.name = 'GeminiAuthError';
  }
}

export class GeminiAudioError extends GeminiLiveError {
  constructor(message: string, code: 'AUDIO_CAPTURE_FAILED' | 'AUDIO_PLAYBACK_FAILED' = 'AUDIO_CAPTURE_FAILED', details?: any) {
    super(message, code, details);
    this.name = 'GeminiAudioError';
  }
}

export class GeminiToolError extends GeminiLiveError {
  public toolName: string;

  constructor(message: string, toolName: string, code: 'TOOL_NOT_FOUND' | 'TOOL_PARAM_INVALID' | 'TOOL_EXECUTION_FAILED' = 'TOOL_EXECUTION_FAILED', details?: any) {
    super(`Tool [${toolName}] error: ${message}`, code, details);
    this.name = 'GeminiToolError';
    this.toolName = toolName;
  }
}
