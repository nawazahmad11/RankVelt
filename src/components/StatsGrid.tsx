import { LazyMotion, domAnimation, m } from "framer-motion";
import { AnimatedCounter } from "@/components/Tools/AnimatedCounter";

type Stat = {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
};

const stats: Stat[] = [
  {
    value: 120,
    suffix: "+",
    label: "Websites Ranked on Google",
  },
  {
    value: 10,
    prefix: "$",
    suffix: "M+",
    label: "Organic Revenue Impact Generated",
  },
  {
    value: 500,
    suffix: "k+",
    label: "Monthly Organic Clicks Driven",
  },
  {
    value: 85,
    suffix: "%",
    label: "Average SEO Traffic Growth",
  },
];

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
};

// Below-fold stats grid, code-split so framer-motion for this section
// does not ship in the critical homepage bundle. Animation unchanged.
const StatsGrid = () => {
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className="mb-16 grid grid-cols-2 gap-11 border-y border-white/5 bg-white/[0.01] py-10 shadow-inner backdrop-blur-sm lg:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {stats.map((stat, index) => (
          <m.div
            key={stat.label}
            variants={fadeInUp}
            custom={index}
            className="group cursor-default text-center"
          >
            <div className="mb-2 text-4xl font-black text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.3)] transition-transform duration-300 group-hover:scale-110 sm:text-5xl">
              {stat.prefix && <span>{stat.prefix}</span>}
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/60 transition-colors group-hover:text-white/60 sm:text-sm">
              {stat.label}
            </div>
          </m.div>
        ))}
      </m.div>
    </LazyMotion>
  );
};

export default StatsGrid;
