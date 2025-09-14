import { useState, useEffect } from 'react';

interface UnlockPageProps {
  isFinished?: boolean;
}

const UnlockPage = ({ isFinished = false }: UnlockPageProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  

  useEffect(() => {
    // const targetDate = new Date('2024-09-26T00:00:00-05:00').getTime();
    const targetDate = new Date('2025-09-26T12:00:00-05:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        // Countdown finished
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Update immediately
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden unlock-gradient ${isFinished ? 'unlock-slide-up' : ''}`}>
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="sparkle-animation"></div>
        <div className="gradient-waves"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-8">
        {/* Unlocks in text */}
        <h1 className="font-dancing text-6xl md:text-8xl text-white mb-8 romantic-glow">
          Unlocks in...
        </h1>

        {/* Countdown Timer */}
        <div className="flex flex-nowrap justify-center gap-4 mb-12">
          <div className="text-center flex-shrink-0 overflow-visible">
            <div className="countdown-number font-playfair text-5xl sm:text-7xl md:text-9xl font-bold text-white shimmer-glow mb-1 sm:mb-2">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-white/80 font-playfair text-sm sm:text-xl md:text-2xl uppercase tracking-widest">
              Days
            </div>
          </div>

          <div className="text-center flex-shrink-0 overflow-visible">
            <div className="countdown-number font-playfair text-5xl sm:text-7xl md:text-9xl font-bold text-white shimmer-glow mb-1 sm:mb-2">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-white/80 font-playfair text-sm sm:text-xl md:text-2xl uppercase tracking-widest">
              Hours
            </div>
          </div>

          <div className="text-center flex-shrink-0 overflow-visible">
            <div className="countdown-number font-playfair text-5xl sm:text-7xl md:text-9xl font-bold text-white shimmer-glow mb-1 sm:mb-2">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-white/80 font-danplayfairing text-sm sm:text-xl md:text-2xl uppercase tracking-widest">
              Minutes
            </div>
          </div>

          <div className="text-center flex-shrink-0 overflow-visible">
            <div className="countdown-number font-playfair text-5xl sm:text-7xl md:text-9xl font-bold text-white shimmer-glow mb-1 sm:mb-2">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-white/80 font-playfair text-sm sm:text-xl md:text-2xl uppercase tracking-widest">
              Seconds
            </div>
          </div>
        </div>

        {/* Heartfelt Subtext */}
        <p className="font-dancing text-2xl md:text-3xl text-white/90 max-w-2xl mx-auto leading-relaxed romantic-glow">
          My cheesiest gift yet is waiting for you...
        </p>
      </div>
    </div>
  );
};

export default UnlockPage;