import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  FileText,
  Image,
  Video,
  Download,
  Sparkles,
  ChevronRight,
  Clock,
  Target,
  Zap,
  MessageSquare,
  Eye,
  RefreshCw,
  X,
  Maximize2,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type WorkflowStep = "describe" | "script" | "image" | "video" | "download";

interface ScriptData {
  hook: string;
  body: string;
  cta: string;
  tone: string[];
  confidence: {
    hookQuality: number;
    emotionalAppeal: number;
    ctaStrength: number;
    audienceMatch: number;
  };
  reasoning: {
    audience: string;
    tone: string;
    platform: string;
    cta: string;
  };
}

interface TimelineEvent {
  time: string;
  label: string;
  type: "generated" | "approved" | "processing" | "complete";
}

const workflowSteps: {
  key: WorkflowStep;
  label: string;
  icon: typeof FileText;
}[] = [
  { key: "describe", label: "Describe", icon: FileText },
  { key: "script", label: "Script", icon: FileText },
  { key: "image", label: "Image", icon: Image },
  { key: "video", label: "Video", icon: Video },
  { key: "download", label: "Export", icon: Download },
];

const stepIndex: Record<WorkflowStep, number> = {
  describe: 0,
  script: 1,
  image: 2,
  video: 3,
  download: 4,
};

/* ------------------------------------------------------------------ */
/*  Mock Data – demo placeholder                                       */
/* ------------------------------------------------------------------ */
const MOCK_SCRIPT: ScriptData = {
  hook: "Your morning ritual, reimagined. Taste the difference of organic, sustainably sourced coffee—delivered fresh to your door.",
  body: "Every cup tells a story. From the misty highlands of Colombia to your morning routine, our organic coffee is ethically sourced, expertly roasted, and packed with flavor. No pesticides. No shortcuts. Just pure, exceptional coffee that energizes your day and supports farmers who care.",
  cta: "Try our starter pack for $12 — free shipping on your first order.",
  tone: ["Warm", "Energetic", "Trustworthy"],
  confidence: {
    hookQuality: 92,
    emotionalAppeal: 87,
    ctaStrength: 94,
    audienceMatch: 88,
  },
  reasoning: {
    audience: "College Students",
    tone: "Energetic & Warm",
    platform: "Instagram Reels",
    cta: "Limited Time Offer",
  },
};

const MOCK_TIMELINE: TimelineEvent[] = [
  { time: "19:31:10", label: "Script Generated", type: "complete" },
  { time: "19:31:11", label: "Marketing Hook", type: "complete" },
  { time: "19:31:12", label: "Emotional Tone", type: "complete" },
  { time: "19:31:13", label: "CTA Written", type: "complete" },
  { time: "19:31:14", label: "Script Approved", type: "approved" },
  { time: "19:31:18", label: "Image Generated", type: "complete" },
  { time: "19:31:20", label: "Image Approved", type: "approved" },
  { time: "19:31:25", label: "Generating Video...", type: "processing" },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/* Step progress timeline in sidebar */
function WorkflowSidebar({
  currentStep,
  completedSteps,
}: {
  currentStep: WorkflowStep;
  completedSteps: Set<WorkflowStep>;
}) {
  const currentIdx = stepIndex[currentStep];

  return (
    <div className="space-y-1">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8C9891] mb-5 px-1">
        Workflow
      </div>
      {workflowSteps.map((step, i) => {
        const Icon = step.icon;
        const isActive = step.key === currentStep;
        const isCompleted = completedSteps.has(step.key);
        const isLocked = i > currentIdx;

        return (
          <div
            key={step.key}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
              isActive && "bg-[#DDEBD9] text-[#151515] font-medium",
              isCompleted && !isActive && "text-[#52B788]",
              isLocked && "text-[#8C9891] opacity-50",
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200",
                isActive && "bg-[#B7D8B6]",
                isCompleted && !isActive && "bg-[#DDEBD9]",
                isLocked && "bg-[#E8ECEB]",
              )}
            >
              {isCompleted ? (
                <Check className="w-3.5 h-3.5 text-[#52B788]" />
              ) : (
                <Icon className={cn(
                  "w-3.5 h-3.5",
                  isActive && "text-[#151515]",
                  isLocked && "text-[#8C9891]",
                )} />
              )}
            </div>
            <span>{step.label}</span>
            {isActive && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* Timeline event item */
function TimelineItem({
  event,
  isLatest,
}: {
  event: TimelineEvent;
  isLatest: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className={cn(
          "mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0",
          event.type === "complete" && "bg-[#52B788]",
          event.type === "approved" && "bg-[#B7D8B6]",
          event.type === "processing" && "bg-[#B7D8B6] animate-pulse",
        )}
      />
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-xs",
            event.type === "processing"
              ? "text-[#151515] font-medium"
              : "text-[#66736A]",
          )}
        >
          {event.label}
        </div>
        {event.time && (
          <div className="text-[10px] text-[#8C9891] mt-0.5">{event.time}</div>
        )}
      </div>
    </div>
  );
}

/* Streaming text component */
function StreamingText({
  text,
  speed = 25,
  onComplete,
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-0.5 h-4 bg-[#B7D8B6] ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}

/* Expandable AI reasoning panel */
function AIReasoning({ data }: { data: ScriptData["reasoning"] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs text-[#8C9891] hover:text-[#66736A] transition-colors"
      >
        <Lightbulb className="w-3 h-3" />
        View AI Reasoning
        <ChevronRight
          className={cn(
            "w-3 h-3 transition-transform duration-200",
            open && "rotate-90",
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 rounded-xl bg-white border border-[#E8ECEB] space-y-3">
              {[
                { label: "Target Audience", value: data.audience },
                { label: "Tone", value: data.tone },
                { label: "Platform", value: data.platform },
                { label: "CTA", value: data.cta },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-xs text-[#8C9891]">{item.label}</span>
                  <span className="text-xs font-medium text-[#151515]">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Confidence bars */
function ConfidenceBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#8C9891]">{label}</span>
        <span className="text-[#66736A] font-medium">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#E8ECEB] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full bg-[#B7D8B6]"
        />
      </div>
    </div>
  );
}

/* Skeleton placeholder */
function PlaceholderBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4 bg-[#E8ECEB]", i === lines - 1 && "w-3/4")} />
      ))}
    </div>
  );
}

/* Image viewer modal */
function ImageModal({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-4xl max-h-[90vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-[#E8ECEB] flex items-center justify-center shadow-sm hover:bg-[#FAFCF9] transition-colors"
        >
          <X className="w-4 h-4 text-[#66736A]" />
        </button>
        <img
          src={src}
          alt="Keyframe preview"
          className="rounded-2xl border border-[#E8ECEB] shadow-xl max-w-full max-h-[85vh] object-contain"
        />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step: Describe                                                     */
/* ------------------------------------------------------------------ */
function DescribeStep({
  onNext,
}: {
  onNext: (data: { product: string; audience: string }) => void;
}) {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const progressSteps = [
    "Understanding your product...",
    "Building customer persona...",
    "Analyzing market positioning...",
    "Ready to generate your script.",
  ];

  const handleGenerate = async () => {
    if (!product.trim() || !audience.trim()) return;
    setLoading(true);

    for (let i = 0; i < progressSteps.length; i++) {
      setProgressText(progressSteps[i]);
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    }

    setLoading(false);
    onNext({ product, audience });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold text-[#151515] tracking-tight">
          Describe your product
        </h2>
        <p className="text-sm text-[#8C9891] mt-1.5">
          Tell us about what you're selling and who you want to reach.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-[#66736A]">
            Product Description
          </label>
          <Textarea
            placeholder="e.g., Organic cold-brew coffee made from ethically sourced beans..."
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="min-h-[100px] resize-none rounded-xl border-[#E8ECEB] bg-white text-sm focus:border-[#B7D8B6] focus:ring-[#B7D8B6]/20 transition-all"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-[#66736A]">
            Target Audience
          </label>
          <Input
            placeholder="e.g., College Students, Young Professionals"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="rounded-xl border-[#E8ECEB] bg-white text-sm focus:border-[#B7D8B6] focus:ring-[#B7D8B6]/20 transition-all"
            disabled={loading}
          />
        </div>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 text-sm text-[#66736A]"
        >
          <Loader2 className="w-4 h-4 animate-spin text-[#B7D8B6]" />
          {progressText}
        </motion.div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={!product.trim() || !audience.trim() || loading}
        className="bg-[#151515] text-white hover:bg-[#151515]/90 rounded-2xl h-12 px-7 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Script
          </>
        )}
      </Button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step: Script Review                                                */
/* ------------------------------------------------------------------ */
function ScriptStep({
  onNext,
  onBack,
  script,
  setScript,
}: {
  onNext: () => void;
  onBack: () => void;
  script: ScriptData | null;
  setScript: (s: ScriptData) => void;
}) {
  const [streaming, setStreaming] = useState(true);
  const [approved, setApproved] = useState(false);
  const [showBrief, setShowBrief] = useState(true);

  useEffect(() => {
    if (!script) {
      // Simulate AI generation with streaming
      const timer = setTimeout(() => {
        setScript(MOCK_SCRIPT);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [script, setScript]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Marketing Brief */}
      <AnimatePresence>
        {showBrief && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-2xl bg-[#FAFCF9] border border-[#E8ECEB] space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8C9891]">
                Marketing Brief
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Audience", value: "Young Professionals" },
                  { label: "Primary Emotion", value: "Trust" },
                  { label: "Tone", value: "Modern & Minimal" },
                  { label: "Platform", value: "Instagram Reels" },
                  { label: "Duration", value: "15 seconds" },
                  { label: "Objective", value: "Brand Awareness" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-[10px] text-[#8C9891] uppercase tracking-wide">
                      {item.label}
                    </div>
                    <div className="text-xs font-medium text-[#151515] mt-0.5">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Script output */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#151515]">Generated Script</h3>
          {script && (
            <Badge
              variant="outline"
              className="text-[11px] px-2 py-0.5 rounded-full border-[#B7D8B6] text-[#66736A] bg-[#DDEBD9]/50"
            >
              {streaming ? "Generating..." : "Complete"}
            </Badge>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8ECEB] space-y-4">
          {!script ? (
            <div className="space-y-4">
              <PlaceholderBlock lines={2} />
              <PlaceholderBlock lines={4} />
              <PlaceholderBlock lines={1} />
            </div>
          ) : (
            <>
              <div>
                <div className="text-xs text-[#8C9891] font-medium uppercase tracking-wider mb-1.5">
                  Marketing Hook
                </div>
                <p className="text-sm text-[#151515] leading-relaxed">
                  <StreamingText
                    text={script.hook}
                    speed={20}
                    onComplete={() => setStreaming(false)}
                  />
                </p>
              </div>
              <Separator className="bg-[#E8ECEB]" />
              <div>
                <div className="text-xs text-[#8C9891] font-medium uppercase tracking-wider mb-1.5">
                  Body
                </div>
                <p className="text-sm text-[#66736A] leading-relaxed">
                  {script.body}
                </p>
              </div>
              <Separator className="bg-[#E8ECEB]" />
              <div>
                <div className="text-xs text-[#8C9891] font-medium uppercase tracking-wider mb-1.5">
                  Call to Action
                </div>
                <p className="text-sm font-medium text-[#151515]">{script.cta}</p>
              </div>

              {script.tone.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {script.tone.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-full bg-[#DDEBD9] text-[#66736A]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* AI Reasoning */}
              <AIReasoning data={script.reasoning} />
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="rounded-xl h-11 px-5 border-[#E8ECEB] text-[#66736A] hover:text-[#151515]"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            setApproved(true);
            onNext();
          }}
          disabled={!script || streaming}
          className={cn(
            "rounded-2xl h-11 px-6 text-sm font-medium transition-all duration-200",
            approved
              ? "bg-[#52B788] text-white"
              : "bg-[#151515] text-white hover:bg-[#151515]/90",
          )}
        >
          {approved ? (
            <>
              <Check className="w-4 h-4 mr-1.5" />
              Approved
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-1.5" />
              Approve Script
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step: Image Review                                                 */
/* ------------------------------------------------------------------ */
function ImageStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [generating, setGenerating] = useState(true);
  const [approved, setApproved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setGenerating(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold text-[#151515] tracking-tight">
          Marketing Keyframe
        </h2>
        <p className="text-sm text-[#8C9891] mt-1.5">
          AI-generated visual based on your approved script.
        </p>
      </div>

      {/* Image preview */}
      <div className="relative">
        {generating ? (
          <div className="aspect-video rounded-2xl bg-[#FAFCF9] border border-[#E8ECEB] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#B7D8B6]" />
            <span className="text-sm text-[#8C9891]">Generating keyframe...</span>
            <div className="w-48">
              <Progress value={65} className="h-1 bg-[#E8ECEB]" indicatorClassName="bg-[#B7D8B6]" />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative group cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <div className="aspect-video rounded-2xl bg-[#DDEBD9] border border-[#E8ECEB] overflow-hidden relative">
              {/* Placeholder image - in production this would be the actual generated image */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#DDEBD9] to-[#B7D8B6]/30">
                <Image className="w-16 h-16 text-[#B7D8B6] mb-4" />
                <span className="text-sm font-medium text-[#66736A]">
                  Generated Keyframe Preview
                </span>
                <span className="text-xs text-[#8C9891] mt-1">
                  Click to expand
                </span>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-[#66736A]" />
                  <span className="text-xs font-medium text-[#66736A]">Preview</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Before/After toggle */}
      {!generating && (
        <div>
          <button
            onClick={() => setShowBeforeAfter(!showBeforeAfter)}
            className="flex items-center gap-2 text-xs text-[#8C9891] hover:text-[#66736A] transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Show Before/After Comparison
          </button>
          <AnimatePresence>
            {showBeforeAfter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#FAFCF9] border border-[#E8ECEB]">
                    <div className="text-[10px] uppercase tracking-wider text-[#8C9891] mb-2 font-medium">
                      Input
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-[#66736A]">Organic Coffee</div>
                      <div className="text-xs text-[#66736A]">College Students</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAFCF9] border border-[#B7D8B6]">
                    <div className="text-[10px] uppercase tracking-wider text-[#8C9891] mb-2 font-medium">
                      Output
                    </div>
                    <div className="text-xs font-medium text-[#151515]">
                      ✓ Script · Image · Video
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="rounded-xl h-11 px-5 border-[#E8ECEB] text-[#66736A] hover:text-[#151515]"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            setApproved(true);
            onNext();
          }}
          disabled={generating}
          className={cn(
            "rounded-2xl h-11 px-6 text-sm font-medium transition-all duration-200",
            approved
              ? "bg-[#52B788] text-white"
              : "bg-[#151515] text-white hover:bg-[#151515]/90",
          )}
        >
          {approved ? (
            <>
              <Check className="w-4 h-4 mr-1.5" />
              Approved
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-1.5" />
              Approve Keyframe
            </>
          )}
        </Button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <ImageModal
            src=""
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step: Video Generation                                             */
/* ------------------------------------------------------------------ */
function VideoStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Composing frames...");

  useEffect(() => {
    const stages = [
      { at: 10, label: "Composing frames..." },
      { at: 25, label: "Adding transitions..." },
      { at: 45, label: "Syncing audio track..." },
      { at: 60, label: "Applying visual effects..." },
      { at: 80, label: "Rendering final output..." },
      { at: 95, label: "Almost done..." },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 2, 100);
        const currentStage = stages
          .slice()
          .reverse()
          .find((s) => next >= s.at);
        if (currentStage) setStage(currentStage.label);
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(onNext, 800);
      return () => clearTimeout(timer);
    }
  }, [progress, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold text-[#151515] tracking-tight">
          Generating Your Video
        </h2>
        <p className="text-sm text-[#8C9891] mt-1.5">
          AI is assembling your advertisement. This takes a few seconds.
        </p>
      </div>

      {/* Video placeholder */}
      <div className="aspect-video rounded-2xl bg-[#FAFCF9] border border-[#E8ECEB] flex flex-col items-center justify-center gap-4">
        {progress < 100 ? (
          <>
            <div className="relative">
              <Video className="w-12 h-12 text-[#B7D8B6]" />
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#52B788]"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
            <div className="w-64 space-y-2">
              <Progress value={progress} className="h-1.5 bg-[#E8ECEB]" indicatorClassName="bg-[#B7D8B6]" />
              <div className="flex justify-between text-xs text-[#8C9891]">
                <span>{stage}</span>
                <span className="font-medium text-[#66736A]">{progress}%</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#8C9891]">
              <Clock className="w-3 h-3" />
              Estimated time: 6 seconds
            </div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#DDEBD9] flex items-center justify-center mx-auto mb-3">
              <Video className="w-6 h-6 text-[#52B788]" />
            </div>
            <p className="text-sm font-medium text-[#151515]">Video Generated</p>
          </motion.div>
        )}
      </div>

      {progress < 100 && (
        <Button
          variant="outline"
          onClick={onBack}
          className="rounded-xl h-11 px-5 border-[#E8ECEB] text-[#66736A] hover:text-[#151515]"
        >
          Cancel
        </Button>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step: Download                                                     */
/* ------------------------------------------------------------------ */
function DownloadStep() {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6"
    >
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1], type: "spring" }}
        className="w-20 h-20 rounded-full bg-[#DDEBD9] flex items-center justify-center"
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Check className="w-8 h-8 text-[#52B788]" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight text-[#151515]">
          Advertisement Ready
        </h2>
        <p className="text-[#66736A] mt-2 max-w-sm mx-auto">
          Your AI-generated campaign is complete. Download your video or create another.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        <Button
          onClick={() => setDownloading(true)}
          className="bg-[#151515] text-white hover:bg-[#151515]/90 rounded-2xl h-14 px-8 text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download MP4
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/generate")}
          className="rounded-2xl h-14 px-8 text-base font-medium border-[#E8ECEB] text-[#66736A] hover:text-[#151515] hover:border-[#B7D8B6]"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Create Another
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex items-center gap-4 text-xs text-[#8C9891]"
      >
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          Script
        </span>
        <span className="w-1 h-1 rounded-full bg-[#DDEBD9]" />
        <span className="flex items-center gap-1">
          <Image className="w-3 h-3" />
          Keyframe
        </span>
        <span className="w-1 h-1 rounded-full bg-[#DDEBD9]" />
        <span className="flex items-center gap-1">
          <Video className="w-3 h-3" />
          Video
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Generate Page                                                 */
/* ------------------------------------------------------------------ */
export default function Generate() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("describe");
  const [completedSteps, setCompletedSteps] = useState<Set<WorkflowStep>>(
    new Set(),
  );
  const [script, setScript] = useState<ScriptData | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const currentIdx = stepIndex[currentStep];
  const navigate = useNavigate();

  const addTimelineEvent = useCallback(
    (label: string, type: TimelineEvent["type"]) => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setTimeline((prev) => [...prev, { time, label, type }]);
    },
    [],
  );

  const handleNext = useCallback(
    (nextStep: WorkflowStep) => {
      setCompletedSteps((prev) => {
        const next = new Set(prev);
        next.add(currentStep);
        return next;
      });
      addTimelineEvent(
        `${currentStep.charAt(0).toUpperCase() + currentStep.slice(1)} ${currentStep === "describe" ? "Submitted" : currentStep === "video" ? "Generated" : "Approved"}`,
        currentStep === "video" ? "complete" : "approved",
      );
      setCurrentStep(nextStep);
    },
    [currentStep, addTimelineEvent],
  );

  const handleBack = useCallback(() => {
    const prevSteps: WorkflowStep[] = [
      "describe",
      "script",
      "image",
      "video",
      "download",
    ];
    const prevIdx = prevSteps.indexOf(currentStep) - 1;
    if (prevIdx >= 0) {
      setCurrentStep(prevSteps[prevIdx]);
    }
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case "describe":
        return (
          <DescribeStep
            onNext={(data) => {
              addTimelineEvent("Product described", "complete");
              handleNext("script");
            }}
          />
        );
      case "script":
        return (
          <ScriptStep
            onNext={() => {
              addTimelineEvent("Script Approved", "approved");
              handleNext("image");
            }}
            onBack={handleBack}
            script={script}
            setScript={setScript}
          />
        );
      case "image":
        return (
          <ImageStep
            onNext={() => {
              addTimelineEvent("Image Approved", "approved");
              handleNext("video");
            }}
            onBack={handleBack}
          />
        );
      case "video":
        return (
          <VideoStep
            onNext={() => {
              addTimelineEvent("Video Generated", "complete");
              handleNext("download");
            }}
            onBack={handleBack}
          />
        );
      case "download":
        return <DownloadStep />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col bg-[#FAFCF9]"
    >
      <Navbar variant="app" />

      {/* Main layout */}
      <div className="flex-1 pt-20 px-6 pb-8">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-[220px_1fr_280px] gap-6 h-full min-h-[calc(100vh-120px)]">
            {/* Left: Workflow Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-2xl border border-[#E8ECEB] p-5 shadow-sm h-fit sticky top-24"
            >
              <WorkflowSidebar
                currentStep={currentStep}
                completedSteps={completedSteps}
              />
            </motion.div>

            {/* Center: Main Workspace */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-white rounded-2xl border border-[#E8ECEB] p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-xs text-[#8C9891]">
                  {workflowSteps.slice(0, currentIdx + 1).map((s, i) => (
                    <span key={s.key} className="flex items-center gap-2">
                      <span
                        className={cn(
                          i === currentIdx
                            ? "text-[#151515] font-medium"
                            : "text-[#52B788]",
                        )}
                      >
                        {s.label}
                      </span>
                      {i < currentIdx && <ChevronRight className="w-3 h-3" />}
                    </span>
                  ))}
                </div>
                {currentStep !== "download" && (
                  <div className="text-xs text-[#8C9891]">
                    Step {currentIdx + 1} of 5
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                <div key={currentStep}>{renderStep()}</div>
              </AnimatePresence>
            </motion.div>

            {/* Right: AI Activity Panel */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-2xl border border-[#E8ECEB] p-5 shadow-sm h-fit sticky top-24 space-y-5"
            >
              {/* AI Status */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8C9891] mb-3">
                  AI Activity
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#DDEBD9] text-xs font-medium text-[#66736A] mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />
                  AI Online
                </div>
              </div>

              {/* Status list */}
              <div className="space-y-3">
                {[
                  { label: "Qwen Chat", active: true },
                  { label: "Qwen Image", active: currentIdx >= 2 },
                  { label: "Wan Video", active: currentIdx >= 3 },
                ].map((model) => (
                  <div
                    key={model.label}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={cn(
                        "text-xs",
                        model.active ? "text-[#66736A]" : "text-[#8C9891]",
                      )}
                    >
                      {model.label}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        model.active
                          ? "text-[#52B788]"
                          : "text-[#8C9891]",
                      )}
                    >
                      {model.active ? "Active" : "Standby"}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="bg-[#E8ECEB]" />

              {/* Timeline */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8C9891] mb-3">
                  Timeline
                </div>
                <div className="space-y-2.5">
                  {timeline.length === 0 ? (
                    <div className="text-xs text-[#8C9891] text-center py-4">
                      Ready to create something amazing.
                    </div>
                  ) : (
                    timeline.map((event, i) => (
                      <TimelineItem
                        key={i}
                        event={event}
                        isLatest={i === timeline.length - 1}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Confidence scores (show during script step) */}
              {currentStep === "script" && script && (
                <>
                  <Separator className="bg-[#E8ECEB]" />
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8C9891] mb-3">
                      AI Confidence
                    </div>
                    <div className="space-y-3">
                      <ConfidenceBar
                        label="Hook Quality"
                        value={script.confidence.hookQuality}
                      />
                      <ConfidenceBar
                        label="Emotional Appeal"
                        value={script.confidence.emotionalAppeal}
                      />
                      <ConfidenceBar
                        label="CTA Strength"
                        value={script.confidence.ctaStrength}
                      />
                      <ConfidenceBar
                        label="Audience Match"
                        value={script.confidence.audienceMatch}
                      />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
