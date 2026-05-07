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

function isAndroidBrowser() {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

export function useSpeechRecognition({
  lang = "es-CL",
  onTranscript,
  onError,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionResult {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const startRef = useRef<(() => void) | null>(null);
  const shouldListenRef = useRef(false);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalResultIndexesRef = useRef<Set<number>>(new Set());
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);

  const clearRestartTimeout = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onErrorRef.current = onError;
  }, [onTranscript, onError]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const timeout = setTimeout(() => setIsSupported(Boolean(Ctor)), 0);
    return () => clearTimeout(timeout);
  }, []);

  const stop = useCallback(() => {
    shouldListenRef.current = false;
    clearRestartTimeout();
    recognitionRef.current?.stop();
    setIsListening(false);
  }, [clearRestartTimeout]);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) {
      onErrorRef.current?.("Tu navegador no soporta dictado por voz. Prueba con Chrome o Edge.");
      return;
    }

    shouldListenRef.current = true;
    clearRestartTimeout();
    if (recognitionRef.current) {
      const currentRecognition = recognitionRef.current;
      recognitionRef.current = null;
      currentRecognition.abort();
    }

    const instance = new Ctor();
    instance.lang = lang;
    instance.continuous = true;
    instance.interimResults = true;
    finalResultIndexesRef.current.clear();

    instance.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          if (finalResultIndexesRef.current.has(i)) continue;
          finalResultIndexesRef.current.add(i);
        }
        const alternative = result[0];
        if (!alternative) continue;
        onTranscriptRef.current({
          transcript: alternative.transcript,
          isFinal: result.isFinal,
        });
      }
    };

    instance.onerror = (event) => {
      if (recognitionRef.current !== instance) return;
      const message =
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? "Necesitamos permiso para usar el microfono. Habilitalo en tu navegador."
          : event.error === "no-speech"
            ? "No escuche nada. Acercate al microfono y vuelve a intentar."
            : `No pudimos transcribir el audio (${event.error}).`;
      onErrorRef.current?.(message);
      shouldListenRef.current = false;
      clearRestartTimeout();
      setIsListening(false);
    };

    instance.onend = () => {
      if (recognitionRef.current !== instance) return;
      recognitionRef.current = null;

      if (shouldListenRef.current && isAndroidBrowser()) {
        restartTimeoutRef.current = setTimeout(() => {
          restartTimeoutRef.current = null;
          if (shouldListenRef.current && !recognitionRef.current) startRef.current?.();
        }, 250);
        return;
      }

      shouldListenRef.current = false;
      setIsListening(false);
    };

    recognitionRef.current = instance;
    try {
      instance.start();
      setIsListening(true);
    } catch (error) {
      onErrorRef.current?.((error as Error).message);
      shouldListenRef.current = false;
      setIsListening(false);
      recognitionRef.current = null;
    }
  }, [clearRestartTimeout, lang]);

  useEffect(() => {
    startRef.current = start;
  }, [start]);

  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      clearRestartTimeout();
      const currentRecognition = recognitionRef.current;
      recognitionRef.current = null;
      currentRecognition?.abort();
    };
  }, [clearRestartTimeout]);

  return { isSupported, isListening, start, stop };
}
