import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLatestQuote } from "../services/firebaseContent";
import LoadingSpinner from "./LoadingSpinner";

const DEFAULT_QUOTE = {
  text: "Build with integrity, deliver with precision, and finish every project with accountability.",
};

function DailyQuoteSection() {
  const [quote, setQuote] = useState(DEFAULT_QUOTE);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadQuote() {
      try {
        setError("");
        const latest = await getLatestQuote();
        if (!mounted) return;

        if (latest) {
          setQuote(latest);
          setIsFallback(false);
        } else {
          setQuote(DEFAULT_QUOTE);
          setIsFallback(true);
        }
      } catch (error) {
        if (!mounted) return;
        console.error("[DailyQuoteSection]", error);
        setQuote(DEFAULT_QUOTE);
        setIsFallback(true);
        setError("Unable to load the latest quote right now.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadQuote();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="daily-quote" className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-emerald-950 text-white shadow-2xl"
        >
          <img
            src="/images/quote-bg.jpg"
            alt="Daily quote background"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900/95 to-white/10" />

          <div className="relative grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-14 lg:py-14">
            
            {/* Left Side */}
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">
                Daily Quote
              </p>
              <h2 className="mt-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
                Today&apos;s active site update
              </h2>
            </div>

            {/* Right Side */}
            <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-8">
              {loading ? (
                <LoadingSpinner label="Fetching today&apos;s quote..." />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={`${quote.text}-${quote.createdAtLabel || "unknown"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45 }}
                    className="space-y-4"
                  >
                    {/* ✅ Fixed Quote Text */}
                    <p className="mx-auto max-w-xl text-base leading-relaxed text-white sm:text-lg md:text-xl">
                      &ldquo;{quote.text}&rdquo;
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-col gap-1 text-xs text-emerald-200 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                      <footer className="font-semibold">
                        {isFallback ? "Default Quote" : "Live CMS Quote"}
                      </footer>

                      {quote.createdAtLabel ? (
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/70 sm:text-xs">
                          {quote.createdAtLabel}
                        </p>
                      ) : null}
                    </div>

                    {/* Error */}
                    {error ? (
                      <p className="text-xs text-red-200 sm:text-sm">{error}</p>
                    ) : null}

                    {/* Fallback Notice */}
                    {isFallback ? (
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/55 sm:text-xs">
                        Showing default quote until Firestore data is available
                      </p>
                    ) : null}
                  </motion.blockquote>
                </AnimatePresence>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default DailyQuoteSection;

