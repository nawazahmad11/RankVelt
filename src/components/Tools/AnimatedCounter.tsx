import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, animate } from "framer-motion";

export const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true }); // Start counting when scrolled into view
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    if (inView) {
      // Reset to 0 first so the count-up always starts from zero,
      // then animate to the final value.
      motionValue.set(0);
      animate(motionValue, value, { duration: 2 }); // Animation completes in 2 seconds
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
      }
    });
  }, [springValue, suffix]);

  // Progressive enhancement: render the final value as static HTML so
  // crawlers and no-JS users see the real number. Once the section
  // scrolls into view, the animation overwrites it with the count-up.
  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
};
