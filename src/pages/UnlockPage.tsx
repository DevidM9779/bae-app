import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UnlockPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date(`September 26, ${new Date().getFullYear()} 00:00:00 UTC`).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        // Countdown finished, redirect to home
        navigate('/');
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
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden unlock-gradient">
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
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="text-center">
            <div className="countdown-number font-playfair text-7xl md:text-9xl font-bold text-white shimmer-glow mb-2">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-white/80 text-xl md:text-2xl uppercase tracking-widest">
              Days
            </div>
          </div>
          
          <div className="text-center">
            <div className="countdown-number font-playfair text-7xl md:text-9xl font-bold text-white shimmer-glow mb-2">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-white/80 text-xl md:text-2xl uppercase tracking-widest">
              Hours
            </div>
          </div>
          
          <div className="text-center">
            <div className="countdown-number font-playfair text-7xl md:text-9xl font-bold text-white shimmer-glow mb-2">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-white/80 text-xl md:text-2xl uppercase tracking-widest">
              Minutes
            </div>
          </div>
          
          <div className="text-center">
            <div className="countdown-number font-playfair text-7xl md:text-9xl font-bold text-white shimmer-glow mb-2">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-white/80 text-xl md:text-2xl uppercase tracking-widest">
              Seconds
            </div>
          </div>
        </div>

        {/* Heartfelt Subtext */}
        <p className="font-dancing text-2xl md:text-3xl text-white/90 max-w-2xl mx-auto leading-relaxed romantic-glow">
          Something magical is waiting for you...
          <br />
          A journey of love and memories begins soon ✨
        </p>
      </div>
    </div>
  );
};

export default UnlockPage;