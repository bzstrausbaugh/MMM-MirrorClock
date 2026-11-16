import { useEffect, useRef } from 'react';

const Clock = ({
  showSeconds = false,
  hour12 = true,
}: {
  showSeconds: boolean;
  hour12: boolean;
}) => {
  const dateRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: any;
    let lastDateString = '';

    // Instantiate formatters once to eliminate memory churn
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    const timeFormatter = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      second: showSeconds ? '2-digit' : undefined,
      hour12,
    });

    const tick = () => {
      const now = new Date();

      // 1. Update Time (splits AM/PM for cleaner MagicMirror typography)
      if (timeRef.current) {
        const parts = timeFormatter.formatToParts(now);
        const dayPeriod =
          parts.find((p) => p.type === 'dayPeriod')?.value || '';
        const timeString = parts
          .filter((p) => p.type !== 'dayPeriod')
          .map((p) => p.value)
          .join('')
          .trim();

        timeRef.current.textContent = timeString;
        if (periodRef.current && periodRef.current.textContent !== dayPeriod) {
          periodRef.current.textContent = dayPeriod;
        }
      }

      // 2. Update Date (only touches the DOM when the day actually changes)
      const currentDateString = dateFormatter.format(now);
      if (dateRef.current && currentDateString !== lastDateString) {
        dateRef.current.textContent = currentDateString;
        lastDateString = currentDateString;
      }

      // 3. Sleep until the exact start of the next second or minute
      const msUntilNextTick = showSeconds
        ? 1000 - now.getMilliseconds()
        : (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

      timeoutId = setTimeout(tick, msUntilNextTick);
    };

    tick();

    // Re-sync immediately if the browser tab/window wakes from sleep
    const handleVisibility = () => {
      if (!document.hidden) {
        clearTimeout(timeoutId);
        tick();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [showSeconds, hour12]);

  return (
    <div
      style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        userSelect: 'none',
        lineHeight: 1.1,
      }}
    >
      {/* Date Display */}
      <div
        ref={dateRef}
        style={{
          fontSize: '1.75rem',
          fontWeight: 300,
          color: '#cccccc',
          marginBottom: '0.25rem',
          letterSpacing: '0.02em',
        }}
      />

      {/* Time Display */}
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span
          ref={timeRef}
          style={{
            fontSize: '5.5rem',
            fontWeight: 200,
            fontVariantNumeric: 'tabular-nums', // Prevents horizontal shift as digits change
            letterSpacing: '-0.02em',
          }}
        />
        {hour12 && (
          <span
            ref={periodRef}
            style={{
              fontSize: '1.75rem',
              fontWeight: 300,
              color: '#999999',
              marginLeft: '0.5rem',
              textTransform: 'uppercase',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Clock;
