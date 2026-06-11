import { useCallback, useEffect, useRef, useState } from "react";

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export interface PriceRange {
    min: number;
    max: number;
    start: number;
    end: number;
    startPercent: number;
    endPercent: number;
    enabled: boolean;
    trackRef: React.RefObject<HTMLDivElement | null>;
    trackHandlers: {
        onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
        onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
        onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
    };
    nudge: (thumb: "start" | "end", delta: number) => void;
    setStartValue: (value: number) => void;
    setEndValue: (value: number) => void;
    reset: () => void;
}

// Двойной ползунок диапазона цен, двусторонне связанный с полями ввода.
// Гарантирует: значения целые, в пределах [min, max] и start <= end.
export const usePriceRange = (min: number, max: number): PriceRange => {
    const [start, setStart] = useState<number>(min);
    const [end, setEnd] = useState<number>(max);

    const trackRef = useRef<HTMLDivElement>(null);
    const dragging = useRef<"start" | "end" | null>(null);
    // Актуальные значения для корректного клампа внутри обработчиков
    const startRef = useRef<number>(start);
    const endRef = useRef<number>(end);

    useEffect(() => {
        startRef.current = start;
    }, [start]);
    useEffect(() => {
        endRef.current = end;
    }, [end]);

    // При смене границ (загрузка товаров) сбрасываем диапазон на полный
    useEffect(() => {
        setStart(min);
        setEnd(max);
    }, [min, max]);

    const enabled = max > min;

    const setStartValue = useCallback(
        (value: number) => {
            const safe = Number.isFinite(value) ? Math.round(value) : min;
            setStart(clamp(safe, min, endRef.current));
        },
        [min]
    );

    const setEndValue = useCallback(
        (value: number) => {
            const safe = Number.isFinite(value) ? Math.round(value) : max;
            setEnd(clamp(safe, startRef.current, max));
        },
        [max]
    );

    const valueFromClientX = useCallback(
        (clientX: number): number => {
            const track = trackRef.current;
            if (!track) return min;
            const rect = track.getBoundingClientRect();
            if (rect.width === 0) return min;
            const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
            return Math.round(min + ratio * (max - min));
        },
        [min, max]
    );

    const onPointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (!enabled) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            const value = valueFromClientX(e.clientX);
            // Двигаем ближайший к точке нажатия ползунок
            const distToStart = Math.abs(value - startRef.current);
            const distToEnd = Math.abs(value - endRef.current);
            const thumb: "start" | "end" = distToStart <= distToEnd ? "start" : "end";
            dragging.current = thumb;
            if (thumb === "start") setStartValue(value);
            else setEndValue(value);
        },
        [enabled, valueFromClientX, setStartValue, setEndValue]
    );

    const onPointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (!dragging.current) return;
            const value = valueFromClientX(e.clientX);
            if (dragging.current === "start") setStartValue(value);
            else setEndValue(value);
        },
        [valueFromClientX, setStartValue, setEndValue]
    );

    const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        dragging.current = null;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // pointer уже отпущен — игнорируем
        }
    }, []);

    const nudge = useCallback(
        (thumb: "start" | "end", delta: number) => {
            if (thumb === "start") setStartValue(startRef.current + delta);
            else setEndValue(endRef.current + delta);
        },
        [setStartValue, setEndValue]
    );

    const reset = useCallback(() => {
        setStart(min);
        setEnd(max);
    }, [min, max]);

    const range = Math.max(max - min, 1);
    const startPercent = clamp(((start - min) / range) * 100, 0, 100);
    const endPercent = clamp(((end - min) / range) * 100, 0, 100);

    return {
        min,
        max,
        start,
        end,
        startPercent,
        endPercent,
        enabled,
        trackRef,
        trackHandlers: { onPointerDown, onPointerMove, onPointerUp },
        nudge,
        setStartValue,
        setEndValue,
        reset
    };
};
