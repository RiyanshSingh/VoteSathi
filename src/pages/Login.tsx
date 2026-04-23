import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '../components/Button';
import { useLanguage } from '../context/LanguageContext';

export const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getAuthErrorMessage = (err: any) => {
    const code = err?.code as string | undefined;
    if (!code) return t('auth.generic');
    return t(code) !== code ? t(code) : t('auth.generic');
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError(t('login.resetEmailError'));
      return;
    }
    setError('');
    setSuccess('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(t('login.resetEmailSent'));
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(userCredential.user, { displayName: name.trim() });
        }
      }
      navigate('/');
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <div className="min-h-dvh bg-neo-bg flex flex-col p-6 relative overflow-y-auto">
      <button 
        onClick={() => navigate('/welcome')}
        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border-3 border-black shadow-neo-sm text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all mb-6 shrink-0 z-10"
      >
        <ArrowLeft size={24} strokeWidth={3} />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto z-10">
        <div className="bg-neo-purple border-4 border-black rounded-3xl p-6 shadow-neo mb-6">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
            {isLogin ? t('login.welcomeBack') : t('login.createAccount')}
          </h2>
          <p className="font-bold text-black/80">
            {isLogin ? t('login.loginSubtitle') : t('login.signupSubtitle')}
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

        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 mb-6">
          {!isLogin && (
            <div>
              <label className="block font-black uppercase text-sm mb-2 ml-1">
                {t('login.name') !== 'login.name' ? t('login.name') : 'Full Name'}
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-white border-3 border-black text-black font-bold focus:outline-none focus:shadow-neo transition-all shadow-neo-sm"
                placeholder={t('login.namePlaceholder') !== 'login.namePlaceholder' ? t('login.namePlaceholder') : 'Enter your full name'}
                required={!isLogin}
              />
            </div>
          )}
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
          <div>
            <label className="block font-black uppercase text-sm mb-2 ml-1">{t('login.password')}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl bg-white border-3 border-black text-black font-bold focus:outline-none focus:shadow-neo transition-all shadow-neo-sm"
              placeholder="••••••••"
              required
            />
          </div>
          {isLogin && (
            <div className="flex justify-end -mt-2">
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-black uppercase underline decoration-2 underline-offset-2 decoration-neo-purple hover:text-neo-purple transition-colors"
              >
                {t('login.forgotPassword')}
              </button>
            </div>
          )}
          <Button type="submit" className="w-full bg-neo-green mt-2 py-4 text-lg">
            {isLogin ? t('login.loginBtn') : t('login.signupBtn')}
          </Button>
        </form>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-1 bg-black rounded-full" />
          <span className="font-black uppercase text-sm">{t('login.or')}</span>
          <div className="flex-1 h-1 bg-black rounded-full" />
        </div>

        <Button 
          type="button"
          onClick={handleGoogleSignIn} 
          className="w-full bg-white flex items-center justify-center gap-3 py-4 text-lg"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          {t('login.google')}
        </Button>

        <p className="text-center font-bold mt-8">
          {isLogin ? t('login.noAccount') : t('login.haveAccount')}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="underline decoration-3 underline-offset-4 decoration-neo-green hover:text-neo-green transition-colors font-black uppercase"
          >
            {isLogin ? t('login.signupBtn') : t('login.loginBtn')}
          </button>
        </p>
      </div>
    </div>
  );
};
