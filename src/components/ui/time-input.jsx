import { useEffect, useRef, useState } from "react";
import { Input } from "./input";

export function TimeInput({ value, onChange, id }) {
    const [hours, setHours] = useState(value.split(":")[0] || "00");
    const [minutes, setMinutes] = useState(value.split(":")[1] || "00");

    const minutesRef = useRef(null);

    useEffect(
        () => {
            const [h, m] = value.split(":");
            setHours(h || "00");
            setMinutes(m || "00");
        }, [value]
    );

    const handleChange = (field, raw) => {
        const digits = raw.replace(/\D/g, "").slice(0, 2);

        if (field === "hours") {
            if (digits.length === 2 && Number(digits) > 23) { return; }

            setHours(digits);

            if (digits.length === 2) { minutesRef.current?.focus(); }
            if (digits.length === 2 && minutes.length === 2) { onChange(`${digits}:${minutes}`); }
        }

        if (field === "minutes") {
            if (digits.length === 2 && Number(digits) > 59) { return; }

            setMinutes(digits);

            if (digits.length === 2 && hours.length === 2) { onChange(`${hours}:${digits}`); }
        }
    };

    return (
        <div className="flex items-center gap-1">
            <Input
                id={id}
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={hours}
                placeholder="HH"
                onChange={(e) => handleChange("hours", e.target.value)}
                onBlur={() => {
                    if (hours.length === 1) {
                        const padded = hours.padStart(2, "0");
                        setHours(padded);
                        if (minutes.length === 2) { onChange(`${padded}:${minutes}`); }
                    }
                }}
                className="w-12 text-center tabular-nums"
            />

            <span>:</span>

            <Input
                ref={minutesRef}
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={minutes}
                placeholder="MM"
                onChange={(e) => handleChange("minutes", e.target.value)}
                onBlur={() => {
                    if (minutes.length === 1) {
                        const padded = minutes.padStart(2, "0");
                        setMinutes(padded);
                        if (hours.length === 2) { onChange(`${hours}:${padded}`); }
                    }
                }}
                className="w-12 text-center tabular-nums"
            />
        </div>
    );
}