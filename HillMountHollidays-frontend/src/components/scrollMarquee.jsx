import { useState, useEffect } from 'react';
import { Mountain } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE;

const FALLBACK = ["HillMount Holidays"];

export default function ScrollMarquee() {
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    fetch(`${API}/api/marquee`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.length) {
          setItems(data.data.map((d) => d.text));
        }
      })
      .catch(() => {});
  }, []);

  // Duplicate enough times for seamless scroll regardless of item count
  const displayed = Array.from({ length: Math.max(20, items.length * 4) }, (_, i) => items[i % items.length]);

  return (
    <div
      className="w-full overflow-hidden"
      style={{ backgroundColor: '#1E88E5', paddingTop: '11px', paddingBottom: '11px' }}
    >
      <style>{`
        @keyframes hm-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .hm-marquee {
          display: flex;
          width: max-content;
          animation: hm-scroll 40s linear infinite;
        }
        .hm-marquee:hover { animation-play-state: paused; }
      `}</style>

      <div className="hm-marquee">
        {[...displayed, ...displayed].map((text, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              paddingLeft: '36px',
              paddingRight: '36px',
              whiteSpace: 'nowrap',
            }}
          >
          
            
          
            <span
              style={{
                fontSize: '12px',
                fontWeight: '800',
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
