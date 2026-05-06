"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionResult = {
  transcript: string;
  isFinal: boolean;
};

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export type SpeechLang = "es-CL" | "es-ES" | "en-US";

export interface UseSpeechRecognitionOptions {
  lang?: SpeechLang;
  onTranscript: (chunk: SpeechRecognitionResult) => void;
  onError?: (message: string) => void;
}

export interface UseSpeechRecognitionResult {
  isSupported: boolean;
  isListening: boolean;
  start: () => void;
  stop: () => void;
}

export function useSpeechRecognition({
  lang = "es-CL",
  onTranscript,
  onError,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionResult {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onErrorRef.current = onError;
  }, [onTranscript, onError]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    setIsSupported(Boolean(Ctor));
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) {
      onErrorRef.current?.("Tu navegador no soporta dictado por voz. Prueba con Chrome o Edge.");
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const instance = new Ctor();
    instance.lang = lang;
    instance.continuous = true;
    instance.interimResults = true;

    instance.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const alternative = result[0];
        if (!alternative) continue;
        onTranscriptRef.current({
          transcript: alternative.transcript,
          isFinal: result.isFinal,
        });
      }
    };

    instance.onerror = (event) => {
      const message =
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? "Necesitamos permiso para usar el microfono. Habilitalo en tu navegador."
          : event.error === "no-speech"
            ? "No escuche nada. Acercate al microfono y vuelve a intentar."
            : `No pudimos transcribir el audio (${event.error}).`;
      onErrorRef.current?.(message);
      setIsListening(false);
    };

    instance.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = instance;
    try {
      instance.start();
      setIsListening(true);
    } catch (error) {
      onErrorRef.current?.((error as Error).message);
      setIsListening(false);
      recognitionRef.current = null;
    }
  }, [lang]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  return { isSupported, isListening, start, stop };
}
