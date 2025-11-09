import { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Zap } from 'lucide-react';

const Timer = ({ endTime, size = 'sm' }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        const totalSecondsLeft = Math.floor(difference / 1000);
        setTotalSeconds(totalSecondsLeft);

        // Set urgency levels
        setIsUrgent(totalSecondsLeft <= 300); // 5 minutes
        setIsWarning(totalSecondsLeft <= 3600 && totalSecondsLeft > 300); // 1 hour

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${seconds}s`);
        }
        setIsExpired(false);
      } else {
        setTimeLeft('Expired');
        setIsExpired(true);
        setIsUrgent(false);
        setIsWarning(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const getTimerStyle = () => {
    if (isExpired) return 'timer-urgent bg-red-50 border-red-200 text-red-700';
    if (isUrgent) return 'timer-urgent bg-red-50 border-red-200 text-red-700';
    if (isWarning) return 'timer-warning bg-orange-50 border-orange-200 text-orange-700';
    return 'timer-normal bg-gray-50 border-gray-200 text-gray-700';
  };

  const getIcon = () => {
    if (isExpired) return <AlertTriangle className={`${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
    if (isUrgent) return <Zap className={`${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} animate-pulse`} />;
    return <Clock className={`${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
  };

  const sizeClasses = size === 'lg' 
    ? 'px-4 py-3 text-base font-bold' 
    : 'px-3 py-2 text-sm font-semibold';

  return (
    <div className={`inline-flex items-center space-x-2 rounded-xl border-2 transition-all duration-300 ${getTimerStyle()} ${sizeClasses}`}>
      {getIcon()}
      <span className={isUrgent ? 'animate-pulse' : ''}>
        {isExpired ? 'Auction Ended' : timeLeft}
      </span>
      {isUrgent && !isExpired && (
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
          <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
    </div>
  );
};

export default Timer;