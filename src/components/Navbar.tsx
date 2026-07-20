import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import logo from "@/assets/logo.svg";

interface NavbarProps {
  variant?: "landing" | "app";
}

export default function Navbar({ variant = "landing" }: NavbarProps) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#FAFCF9]/80 backdrop-blur-sm border-b border-[#E8ECEB]"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group"
        >
          <img
            src={logo}
            alt="Ad-Lib"
            width={28}
            height={28}
            className="transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-semibold text-base tracking-tight text-[#151515]">
            Ad-Lib
          </span>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {variant === "app" ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DDEBD9] text-xs font-medium text-[#66736A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />
              AI Online
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="text-[#66736A] hover:text-[#151515] text-sm font-medium"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/generate")}
                className="bg-[#151515] text-white hover:bg-[#151515]/90 rounded-xl h-10 px-5 text-sm font-medium shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
