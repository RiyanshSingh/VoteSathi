import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '../components/Button';
import { useLanguage } from '../context/LanguageContext';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(t('login.resetEmailSent'));
    } catch (err: any) {
      setError(err.message || t('auth.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-neo-bg flex flex-col p-6 relative">
      <button 
        onClick={() => navigate('/login')}
        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border-3 border-black shadow-neo-sm text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all mb-6 shrink-0"
      >
        <ArrowLeft size={24} strokeWidth={3} />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
        <div className="bg-neo-blue border-4 border-black rounded-3xl p-6 shadow-neo mb-6">
          <div className="w-12 h-12 bg-white border-3 border-black rounded-xl flex items-center justify-center mb-4 shadow-neo-sm">
            <Mail size={24} className="text-black" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
            {t('login.forgotPassword')}
          </h2>
          <p className="font-bold text-black/80">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-neo-pink border-3 border-black rounded-xl p-3 mb-4 font-bold text-sm shadow-neo-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-neo-green border-3 border-black rounded-xl p-3 mb-4 font-bold text-sm shadow-neo-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <div>
            <label className="block font-black uppercase text-sm mb-2 ml-1">{t('login.email')}</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl bg-white border-3 border-black text-black font-bold focus:outline-none focus:shadow-neo transition-all shadow-neo-sm"
              placeholder={t('login.emailPlaceholder')}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-neo-yellow mt-2 py-4 text-lg"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <p className="text-center font-bold mt-8">
          Remember your password?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="underline decoration-3 underline-offset-4 decoration-neo-blue hover:text-neo-blue transition-colors font-black uppercase"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};
