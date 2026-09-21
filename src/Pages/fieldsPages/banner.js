import { useRef, useState, useCallback } from "react";

// Fixed set of floating dots — deliberately hand-placed (not random on
// every render) so the layout doesn't jump around on re-render/resize.
// top/left are percentages of the hero container.
const heroDots = [
    { top: 18, left: 8, size: 5, delay: "0s", duration: "6s" },
    { top: 70, left: 14, size: 3, delay: "1.4s", duration: "8s" },
    { top: 35, left: 22, size: 4, delay: "2.8s", duration: "7s" }

];

// How far (in the same % units as top/left) the cursor's influence reaches,
// and the max pixel distance a dot gets pushed when the cursor is right on it.
const WAVE_RADIUS = 26;
const WAVE_MAX_PUSH = 30;

const FieldsBanner = ({ name, courseCount = 0, serviceCount = 0, articleCount = 0 }) => {

    const bgRef = useRef(null);
    const rafRef = useRef(null);
    const [pointer, setPointer] = useState(null); // { xPct, yPct } or null

    const handleMouseMove = useCallback((e) => {
        const el = bgRef.current;
        if (!el) return;

        // Throttle to one update per animation frame.
        if (rafRef.current) return;

        const rect = el.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;

        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            setPointer({
                xPct: ((clientX - rect.left) / rect.width) * 100,
                yPct: ((clientY - rect.top) / rect.height) * 100,
            });
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        setPointer(null);
    }, []);

    const getDotOffset = (dot) => {
        if (!pointer) return { x: 0, y: 0 };

        const dx = dot.left - pointer.xPct;
        const dy = dot.top - pointer.yPct;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.0001;

        const strength = Math.max(0, 1 - distance / WAVE_RADIUS);
        const push = strength * strength * WAVE_MAX_PUSH;

        return {
            x: (dx / distance) * push,
            y: (dy / distance) * push,
        };
    };

    return (
        <div className="fieldHero">

            {/* Ambient, decorative only — hidden from assistive tech. */}
            <div
                className="fieldHero-bg"
                aria-hidden="true"
                ref={bgRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {heroDots.map((dot, index) => {
                    const offset = getDotOffset(dot);
                    return (
                        <span
                            key={index}
                            className="fieldHero-dotWrap"
                            style={{
                                top: `${dot.top}%`,
                                left: `${dot.left}%`,
                                transform: `translate(${offset.x}px, ${offset.y}px)`,
                            }}
                        >
                            <span
                                className="fieldHero-dot"
                                style={{
                                    width: dot.size,
                                    height: dot.size,
                                    animationDelay: dot.delay,
                                    animationDuration: dot.duration,
                                }}
                            />
                        </span>
                    );
                })}
            </div>

            <div className="fieldHero-content">
                <p className="fieldHero-eyebrow">حوزه‌های تخصصی آموزشگاه اوژن</p>
                <h1 className="fieldHero-title">{name}</h1>
                <p className="fieldHero-subtitle">دوره‌های آموزشی، مقالات تخصصی و خدمات آزمایشگاهی این حوزه</p>

                <div className="fieldHero-stats">
                    <div className="fieldHero-stat">
                        <span className="fieldHero-statValue">{courseCount}</span>
                        <span className="fieldHero-statLabel">دوره آموزشی</span>
                    </div>
                    <div className="fieldHero-divider" />
                    <div className="fieldHero-stat">
                        <span className="fieldHero-statValue">{serviceCount}</span>
                        <span className="fieldHero-statLabel">نوع خدمات</span>
                    </div>
                    <div className="fieldHero-divider" />
                    <div className="fieldHero-stat">
                        <span className="fieldHero-statValue">{articleCount}</span>
                        <span className="fieldHero-statLabel">مقاله آموزشی</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FieldsBanner;