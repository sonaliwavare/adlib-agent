import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Check,
  FileText,
  Image,
  Video,
  Sparkles,
  Download,
  Zap,
  Target,
  Layers,
  ChevronRight,
  Clock,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useRef } from "react";

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: easeOut },
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.12, delayChildren: 0.1 },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: easeOut },
};

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */
function HeroSection() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <motion.section ref={ref} style={{ opacity }} className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Subtle background ornament */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#DDEBD9]/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-[#B7D8B6]/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
            style={{ y }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DDEBD9] text-xs font-medium text-[#66736A] mb-8"
            >
              <Sparkles className="w-3 h-3" />
              AI-Powered Advertisement Generator
            </motion.div>

            <h1 className="text-[56px] md:text-[64px] lg:text-[72px] font-bold leading-[1.05] tracking-[-0.03em] text-[#151515] mb-6">
              Turn your product
              <br />
              into a{" "}
              <span className="text-[#66736A]">video ad</span>
              <br />
              in minutes
            </h1>

            <p className="text-lg md:text-xl text-[#66736A] leading-relaxed max-w-lg mb-10">
              Describe your product and audience. Ad-Lib generates a marketing
              script, keyframe, and short video — all powered by AI.
            </p>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/generate")}
                className="bg-[#151515] text-white hover:bg-[#151515]/90 rounded-2xl h-14 px-8 text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Creating
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-2xl h-14 px-8 text-base font-medium border-[#E8ECEB] text-[#66736A] hover:text-[#151515] hover:border-[#B7D8B6]"
              >
                How it works
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center gap-6 mt-10 text-sm text-[#8C9891]"
            >
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#52B788]" />
                No design skills
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#52B788]" />
                AI-generated
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#52B788]" />
                Ready in seconds
              </span>
            </motion.div>
          </motion.div>

          {/* Right: Floating AI Workspace Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }}
            style={{ y }}
            className="relative"
          >
            <div className="relative">
              {/* Main preview card */}
              <div className="bg-white rounded-2xl border border-[#E8ECEB] shadow-lg shadow-[#DDEBD9]/30 overflow-hidden">
                {/* Mock window chrome */}
                <div className="flex items-center gap-1.5 px-4 h-10 bg-[#FAFCF9] border-b border-[#E8ECEB]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DDEBD9]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DDEBD9]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DDEBD9]" />
                  <div className="ml-4 text-[10px] font-medium text-[#8C9891]">Ad-Lib · New Campaign</div>
                </div>

                {/* Mock content */}
                <div className="p-5 space-y-4">
                  {/* Step 1: Describe */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFCF9] border border-[#E8ECEB]">
                    <div className="w-8 h-8 rounded-lg bg-[#B7D8B6] flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#151515]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[#151515]">Product Description</div>
                      <div className="text-[11px] text-[#8C9891] truncate">Organic coffee — College Students</div>
                    </div>
                    <Check className="w-4 h-4 text-[#52B788]" />
                  </div>

                  {/* Arrow connector */}
                  <div className="flex justify-center">
                    <ChevronRight className="w-4 h-4 text-[#8C9891]" />
                  </div>

                  {/* Step 2: Script */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFCF9] border border-[#E8ECEB]">
                    <div className="w-8 h-8 rounded-lg bg-[#B7D8B6] flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#151515]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[#151515]">Script Generated</div>
                      <div className="text-[11px] text-[#8C9891]">Marketing hook, emotional tone, CTA</div>
                    </div>
                    <Check className="w-4 h-4 text-[#52B788]" />
                  </div>

                  {/* Arrow connector */}
                  <div className="flex justify-center">
                    <ChevronRight className="w-4 h-4 text-[#8C9891]" />
                  </div>

                  {/* Step 3: Image */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFCF9] border border-[#E8ECEB]">
                    <div className="w-8 h-8 rounded-lg bg-[#B7D8B6] flex items-center justify-center">
                      <Image className="w-4 h-4 text-[#151515]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[#151515]">Keyframe Generated</div>
                      <div className="text-[11px] text-[#8C9891]">Marketing visual approved</div>
                    </div>
                    <Check className="w-4 h-4 text-[#52B788]" />
                  </div>

                  {/* Arrow connector */}
                  <div className="flex justify-center">
                    <ChevronRight className="w-4 h-4 text-[#8C9891]" />
                  </div>

                  {/* Step 4: Video */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#DDEBD9] border border-[#B7D8B6]">
                    <div className="w-8 h-8 rounded-lg bg-[#151515] flex items-center justify-center">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[#151515]">Generating Video...</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full bg-[#E8ECEB] overflow-hidden">
                          <div className="h-full w-[65%] rounded-full bg-[#B7D8B6] animate-pulse" />
                        </div>
                        <span className="text-[10px] text-[#66736A] font-medium">65%</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow connector */}
                  <div className="flex justify-center">
                    <ChevronRight className="w-4 h-4 text-[#8C9891]" />
                  </div>

                  {/* Step 5: Download */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFCF9] border border-dashed border-[#E8ECEB] opacity-50">
                    <div className="w-8 h-8 rounded-lg bg-[#E8ECEB] flex items-center justify-center">
                      <Download className="w-4 h-4 text-[#8C9891]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[#8C9891]">Download Ready</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="absolute -bottom-3 -right-3 bg-white rounded-xl border border-[#E8ECEB] px-4 py-2.5 shadow-sm flex items-center gap-2.5"
              >
                <Zap className="w-4 h-4 text-[#66736A]" />
                <span className="text-xs font-medium text-[#66736A]">
                  Generated in 12s
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Workflow Section                                                   */
/* ------------------------------------------------------------------ */
const workflowSteps = [
  {
    icon: FileText,
    title: "Describe",
    description: "Tell us about your product and who you're targeting. That's all we need to start.",
  },
  {
    icon: FileText,
    title: "Generate Script",
    description: "AI writes a compelling marketing script with hooks, emotional appeal, and a clear CTA.",
  },
  {
    icon: Image,
    title: "Generate Keyframe",
    description: "A stunning visual keyframe is created to match your script and brand style.",
  },
  {
    icon: Video,
    title: "Generate Video",
    description: "The final short-form video is rendered, optimized for Instagram Reels and TikTok.",
  },
];

function WorkflowSection() {
  return (
    <section id="workflow" className="py-28 md:py-36 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDEBD9] text-xs font-medium text-[#66736A] mb-5">
            <Layers className="w-3 h-3" />
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-[#151515] mb-4">
            From idea to ad in four steps
          </h2>
          <p className="text-lg text-[#66736A] leading-relaxed">
            No complex tools. No design experience needed. Just describe your
            product and let AI do the work.
          </p>
        </motion.div>

        <motion.div {...stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {workflowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                {...staggerItem}
                className="group relative bg-white rounded-2xl border border-[#E8ECEB] p-8 transition-all duration-300 hover:border-[#B7D8B6] hover:shadow-md hover:shadow-[#DDEBD9]/40 hover:-translate-y-0.5"
              >
                {/* Step number */}
                <div className="text-[40px] font-bold text-[#DDEBD9] leading-none mb-4 select-none">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-[#FAFCF9] border border-[#E8ECEB] flex items-center justify-center mb-5 group-hover:bg-[#DDEBD9] transition-colors duration-200">
                  <Icon className="w-5 h-5 text-[#66736A]" />
                </div>

                <h3 className="text-lg font-semibold text-[#151515] mb-2">{step.title}</h3>
                <p className="text-sm text-[#8C9891] leading-relaxed">{step.description}</p>

                {/* Connector line */}
                {i < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-2.5 w-5 text-[#DDEBD9]">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Live Product Preview Section                                       */
/* ------------------------------------------------------------------ */
function ProductPreviewSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

  return (
    <section ref={ref} className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDEBD9] text-xs font-medium text-[#66736A] mb-5">
            <Eye className="w-3 h-3" />
            Product Preview
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-[#151515] mb-4">
            Everything you need in one workspace
          </h2>
          <p className="text-lg text-[#66736A] leading-relaxed">
            A clean, focused interface designed for creative flow.
          </p>
        </motion.div>

        <motion.div style={{ scale, opacity }} className="relative">
          {/* Browser frame */}
          <div className="bg-white rounded-2xl border border-[#E8ECEB] shadow-xl shadow-[#DDEBD9]/20 overflow-hidden">
            {/* Chrome */}
            <div className="flex items-center gap-1.5 px-5 h-12 bg-[#FAFCF9] border-b border-[#E8ECEB]">
              <div className="w-3 h-3 rounded-full bg-[#DDEBD9]" />
              <div className="w-3 h-3 rounded-full bg-[#DDEBD9]" />
              <div className="w-3 h-3 rounded-full bg-[#DDEBD9]" />
              <div className="ml-4 text-xs font-medium text-[#8C9891]">app.ad-lib.ai</div>
            </div>

            {/* Dashboard mockup - 3 column layout */}
            <div className="grid grid-cols-[220px_1fr_260px] min-h-[480px]">
              {/* Left sidebar */}
              <div className="border-r border-[#E8ECEB] p-5 space-y-5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8C9891]">Workflow</div>
                {["Describe", "Script", "Image", "Video", "Export"].map((step, i) => (
                  <div
                    key={step}
                    className={`flex items-center gap-2.5 text-sm ${
                      i === 0
                        ? "text-[#151515] font-medium"
                        : i <= 2
                        ? "text-[#52B788]"
                        : "text-[#8C9891]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        i === 0
                          ? "border-[#B7D8B6] bg-[#B7D8B6]"
                          : i <= 2
                          ? "border-[#52B788] bg-[#DDEBD9]"
                          : "border-[#E8ECEB]"
                      }`}
                    >
                      {i <= 2 ? (
                        <Check className="w-2.5 h-2.5" style={{ color: i <= 2 ? "#52B788" : "#8C9891" }} />
                      ) : null}
                    </div>
                    {step}
                  </div>
                ))}
              </div>

              {/* Main workspace */}
              <div className="p-6 border-r border-[#E8ECEB]">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-semibold text-[#151515]">Marketing Script</h3>
                    <p className="text-xs text-[#8C9891] mt-0.5">Approved · Ready for image generation</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#DDEBD9] text-[11px] font-medium text-[#66736A]">
                    ✓ Approved
                  </span>
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-[#FAFCF9] border border-[#E8ECEB]">
                  <div className="space-y-2">
                    <div className="text-xs text-[#8C9891] font-medium uppercase tracking-wider">Marketing Hook</div>
                    <p className="text-sm text-[#151515] leading-relaxed">
                      "Your morning ritual, reimagined. Taste the difference of organic."
                    </p>
                  </div>
                  <div className="border-t border-[#E8ECEB] pt-3">
                    <div className="text-xs text-[#8C9891] font-medium uppercase tracking-wider mb-2">Emotional Tone</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#B7D8B6]/30 text-[#66736A]">Warm</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#B7D8B6]/30 text-[#66736A]">Energetic</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#B7D8B6]/30 text-[#66736A]">Trustworthy</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right activity panel */}
              <div className="p-5 space-y-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8C9891]">AI Activity</div>
                <div className="space-y-3">
                  {[
                    { label: "Script Generated", time: "19:31:10", done: true },
                    { label: "Marketing Hook", time: "19:31:11", done: true },
                    { label: "Emotional Tone", time: "19:31:12", done: true },
                    { label: "CTA Written", time: "19:31:13", done: true },
                    { label: "Generating Keyframe...", time: "", done: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-2.5">
                      <div className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        item.done ? "bg-[#52B788]" : "bg-[#B7D8B6] animate-pulse"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs ${item.done ? "text-[#66736A]" : "text-[#151515] font-medium"}`}>
                          {item.label}
                        </div>
                        {item.time && (
                          <div className="text-[10px] text-[#8C9891] mt-0.5">{item.time}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E8ECEB] pt-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8C9891] mb-3">Confidence</div>
                  <div className="space-y-2.5">
                    {[
                      { label: "Hook Quality", value: 92 },
                      { label: "Emotional Appeal", value: 87 },
                      { label: "CTA Strength", value: 94 },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#8C9891]">{item.label}</span>
                          <span className="text-[#66736A] font-medium">{item.value}%</span>
                        </div>
                        <div className="h-1 rounded-full bg-[#E8ECEB] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#B7D8B6] transition-all"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Features Section                                                   */
/* ------------------------------------------------------------------ */
const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Go from product description to finished video in under a minute. No rendering queues, no waiting.",
  },
  {
    icon: Target,
    title: "Audience Optimized",
    description: "AI tailors every script, image, and video to your specific target audience for maximum impact.",
  },
  {
    icon: Layers,
    title: "Human in the Loop",
    description: "You approve every stage — script, keyframe, and final video. AI assists, you decide.",
  },
];

function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-white border-t border-[#E8ECEB]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-[#151515] mb-4">
            Built for creators, powered by AI
          </h2>
          <p className="text-lg text-[#66736A] leading-relaxed">
            Everything you need to produce professional advertisements without a creative team.
          </p>
        </motion.div>

        <motion.div {...stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                {...staggerItem}
                className="group p-8 rounded-2xl border border-[#E8ECEB] bg-[#FAFCF9] transition-all duration-300 hover:border-[#B7D8B6] hover:bg-white hover:shadow-md"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-[#E8ECEB] flex items-center justify-center mb-5 group-hover:bg-[#DDEBD9] group-hover:border-[#B7D8B6] transition-all duration-200">
                  <Icon className="w-5 h-5 text-[#66736A] group-hover:text-[#151515] transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-[#151515] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#8C9891] leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA Section                                                        */
/* ------------------------------------------------------------------ */
function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#FAFCF9]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#DDEBD9]/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div {...fadeUp} className="text-center max-w-xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-[#151515] mb-5">
            Ready to create your first ad?
          </h2>
          <p className="text-lg text-[#66736A] leading-relaxed mb-10">
            No credit card. No commitment. Just describe your product and watch AI bring it to life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate("/generate")}
              className="bg-[#151515] text-white hover:bg-[#151515]/90 rounded-2xl h-14 px-9 text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Creating Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="rounded-2xl h-14 px-9 text-base font-medium border-[#E8ECEB] text-[#66736A] hover:text-[#151515] hover:border-[#B7D8B6]"
            >
              Sign In
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-center gap-6 mt-10 text-xs text-[#8C9891]"
          >
            <span>No credit card</span>
            <span className="w-1 h-1 rounded-full bg-[#DDEBD9]" />
            <span>Free to start</span>
            <span className="w-1 h-1 rounded-full bg-[#DDEBD9]" />
            <span>AI powered</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
function FooterSection() {
  return (
    <footer className="border-t border-[#E8ECEB] bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Ad-Lib" width={20} height={20} />
          <span className="text-sm font-medium text-[#151515]">Ad-Lib</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-[#8C9891]">
          <span>AI Advertisement Generator</span>
          <span>·</span>
          <span>Built for the AI Agent Hackathon</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Landing Page (composed)                                            */
/* ------------------------------------------------------------------ */
export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-[#FAFCF9]"
    >
      <Navbar variant="landing" />
      <HeroSection />
      <WorkflowSection />
      <ProductPreviewSection />
      <FeaturesSection />
      <CTASection />
      <FooterSection />
    </motion.div>
  );
}
