import { useEffect, useCallback, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

/**
 * ==========================================================
 * SMARTSUPP LIVE SUPPORT COMPONENT
 * ==========================================================
 *
 * A reusable live chat component for Amanpulo Reservation.
 * Uses Smartsupp as the chat provider.
 *
 * CONFIGURATION:
 * --------------
 * To change the Smartsupp account key:
 * 1. Find the SMARTSUPP_KEY constant below
 * 2. Replace with your new key from Smartsupp dashboard
 *
 * To prefill visitor data:
 * - Pass guestName, guestEmail, bookingReference as props
 * - Data is sent to Smartsupp when chat opens
 *
 * To adjust auto-open delay:
 * - Pass autoOpenDelay prop (in milliseconds)
 * - Default is 2000ms (2 seconds)
 *
 * ==========================================================
 */

// ============================================
// SMARTSUPP CONFIGURATION
// ============================================
// Replace this key with your Smartsupp account key
// Get it from: https://www.smartsupp.com/ → Dashboard → Chat → Code
const SMARTSUPP_KEY = "9f40ed644a4b74b5b3481aa3dfd33590a65b6bea";

/**
 * LiveSupport Component
 *
 * @param {Object} props
 * @param {string} props.guestName - Guest's full name (optional)
 * @param {string} props.guestEmail - Guest's email address (optional)
 * @param {string} props.bookingReference - Booking reference number (optional)
 * @param {boolean} props.autoOpen - Whether to auto-open chat on mount (default: false)
 * @param {number} props.autoOpenDelay - Delay before auto-opening in ms (default: 2000)
 * @param {boolean} props.showButton - Whether to show the floating button (default: true)
 * @param {string} props.buttonPosition - Button position: 'bottom-right' | 'bottom-left' (default: 'bottom-right')
 */
export function LiveSupport({
  guestName = "",
  guestEmail = "",
  bookingReference = "",
  autoOpen = false,
  autoOpenDelay = 2000,
  showButton = true,
  buttonPosition = "bottom-right",
}) {
  const { isLoaded, setLoaded, hasAutoOpened, setAutoOpened } = useChatStore();
  const scriptLoadedRef = useRef(false);

  /**
   * Initialize Smartsupp chat script
   * Injects the script into the document head
   */
  useEffect(() => {
    // Prevent multiple script injections
    if (scriptLoadedRef.current || window.smartsupp) {
      setLoaded(true);
      return;
    }

    // Initialize Smartsupp global object
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = SMARTSUPP_KEY;

    // Create and inject script
    const initSmartsupp = () => {
      window.smartsupp =
        window.smartsupp ||
        function () {
          (window.smartsupp._ = window.smartsupp._ || []).push(arguments);
        };
      window.smartsupp._ = window.smartsupp._ || [];

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.charset = "utf-8";
      script.async = true;
      script.src = "https://www.smartsuppchat.com/loader.js?";

      script.onload = () => {
        scriptLoadedRef.current = true;
        setLoaded(true);
      };

      script.onerror = () => {
        console.error("Failed to load Smartsupp chat script");
      };

      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    };

    initSmartsupp();

    // Cleanup function
    return () => {
      // Note: Smartsupp doesn't provide a clean unload method
      // The script will persist until page reload
    };
  }, [setLoaded]);

  /**
   * Prefill visitor information in Smartsupp
   * Called before opening chat to provide context to support agents
   */
  const prefillVisitorInfo = useCallback(() => {
    if (!window.smartsupp) return;

    // Set visitor name
    if (guestName) {
      window.smartsupp("name", guestName);
    }

    // Set visitor email
    if (guestEmail) {
      window.smartsupp("email", guestEmail);
    }

    // Set booking reference as a custom variable
    // This appears in the Smartsupp dashboard for agents
    if (bookingReference) {
      window.smartsupp("variables", {
        bookingReference: {
          label: "Booking Reference",
          value: bookingReference,
        },
      });
    }

    // You can add more custom variables here:
    // window.smartsupp("variables", {
    //   customField: { label: "Field Name", value: "Field Value" }
    // });
  }, [guestName, guestEmail, bookingReference]);

  /**
   * Open the Smartsupp chat window
   * Ensures script is loaded before attempting to open
   */
  const openChat = useCallback(() => {
    if (!window.smartsupp) {
      console.warn("Smartsupp not loaded yet");
      return;
    }

    // Prefill visitor info before opening
    prefillVisitorInfo();

    // Open chat window
    window.smartsupp("chat:open");
  }, [prefillVisitorInfo]);

  /**
   * Auto-open chat functionality
   * Triggered when autoOpen prop is true and chat hasn't been auto-opened yet
   */
  useEffect(() => {
    // Only auto-open if:
    // 1. autoOpen prop is true
    // 2. Script is loaded
    // 3. Haven't auto-opened before in this session
    if (!autoOpen || !isLoaded || hasAutoOpened) return;

    // ============================================
    // AUTO-OPEN DELAY CONFIGURATION
    // ============================================
    // Change autoOpenDelay prop to adjust timing
    // Default: 2000ms (2 seconds)
    const timer = setTimeout(() => {
      openChat();
      setAutoOpened(true);
    }, autoOpenDelay);

    return () => clearTimeout(timer);
  }, [
    autoOpen,
    isLoaded,
    hasAutoOpened,
    autoOpenDelay,
    openChat,
    setAutoOpened,
  ]);

  /**
   * Update visitor info when props change
   * Useful when user fills in their details on checkout
   */
  useEffect(() => {
    if (isLoaded && (guestName || guestEmail || bookingReference)) {
      prefillVisitorInfo();
    }
  }, [isLoaded, guestName, guestEmail, bookingReference, prefillVisitorInfo]);

  // Don't render button if showButton is false
  if (!showButton) return null;

  // Position classes based on buttonPosition prop
  const positionClasses =
    buttonPosition === "bottom-left" ? "left-6" : "right-6";

  return (
    <>
      {/* Floating Live Support Button */}
      <button
        onClick={openChat}
        className={`
          fixed bottom-6 ${positionClasses} z-50
          flex items-center gap-2
          bg-gradient-to-r from-sand-800 to-sand-900
          text-white
          px-5 py-3
          rounded-full
          shadow-lg shadow-sand-900/25
          transition-all duration-300 ease-out
          hover:shadow-xl hover:shadow-sand-900/30
          hover:scale-105
          hover:from-sand-700 hover:to-sand-800
          active:scale-95
          group
        `}
        aria-label="Open live chat support"
      >
        {/* Animated icon */}
        <MessageCircle className="h-5 w-5 transition-transform group-hover:rotate-12" />

        {/* Button text */}
        <span className="font-medium text-sm tracking-wide">Live Support</span>

        {/* Pulse animation indicator - shows chat is available */}
        <span className="relative flex h-2 w-2 ml-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </button>

      {/* Alternative: Circular button style (uncomment to use)
      <button
        onClick={openChat}
        className={`
          fixed bottom-6 ${positionClasses} z-50
          flex items-center justify-center
          w-14 h-14
          bg-sand-900 text-white
          rounded-full
          shadow-lg
          transition-all duration-300
          hover:bg-sand-800 hover:scale-110
          active:scale-95
        `}
        aria-label="Open live chat support"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      */}
    </>
  );
}

export default LiveSupport;
