import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { SectionWrapper } from '../components/SectionWrapper';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PageSkeleton } from '../components/SkeletonLoader';
import { Bell, Shield, Eye, Globe, Moon, Smartphone, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { useState } from 'react';

export const Settings = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { 
    notifications, 
    preferences, 
    updateNotifications, 
    updatePreferences, 
    saveSettings,
    loading 
  } = useSettings();
  const [isSaving, setIsSaving] = useState(false);

  if (loading) {
    return <PageSkeleton />;
  }

  const handleSave = async () => {
    setIsSaving(true);
    const success = await saveSettings();
    setIsSaving(false);
    
    if (success) {
      alert(t('common.saveSuccess'));
      navigate('/profile');
    } else {
      alert("Failed to save settings. Please try again.");
    }
  };

  const SettingToggle = ({ label, description, icon: Icon, active, onClick, color = "bg-neo-blue" }: any) => (
    <Card 
      variant="outline" 
      className={`flex items-center justify-between p-4 cursor-pointer transition-all ${active ? 'bg-white' : 'bg-gray-50/50'}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${color} border-2 border-black flex items-center justify-center text-black shadow-neo-sm`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h4 className="text-sm font-black text-black uppercase tracking-tight">{label}</h4>
          <p className="text-[10px] font-bold text-gray-500 uppercase">{description}</p>
        </div>
      </div>
      <div className={`w-12 h-7 rounded-full border-3 border-black relative transition-all ${active ? 'bg-neo-green' : 'bg-gray-200'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
      </div>
    </Card>
  );

  return (
    <div className="bg-neo-bg min-h-full pb-10">
      <Header title={t('settings.title')} subtitle={t('settings.subtitle')} showBack onBack={() => navigate('/profile')} />

      {/* Notifications Section */}
      <SectionWrapper title={t('settings.notifications')}>
        <div className="flex flex-col gap-3">
          <SettingToggle 
            label={t('settings.push')} 
            description={t('settings.pushDesc')} 
            icon={Bell} 
            active={notifications.push}
            onClick={() => updateNotifications({ push: !notifications.push })}
            color="bg-neo-pink"
          />
          <SettingToggle 
            label={t('settings.news')} 
            description={t('settings.newsDesc')} 
            icon={Globe} 
            active={notifications.news}
            onClick={() => updateNotifications({ news: !notifications.news })}
            color="bg-neo-yellow"
          />
          <SettingToggle 
            label={t('settings.reminders')} 
            description={t('settings.remindersDesc')} 
            icon={Smartphone} 
            active={notifications.reminders}
            onClick={() => updateNotifications({ reminders: !notifications.reminders })}
            color="bg-neo-purple"
          />
        </div>
      </SectionWrapper>

      {/* Preferences Section */}
      <SectionWrapper title={t('settings.privacy')}>
        <div className="flex flex-col gap-3">
          <SettingToggle 
            label={t('settings.haptic')} 
            description={t('settings.hapticDesc')} 
            icon={Shield} 
            active={preferences.hapticFeedback}
            onClick={() => updatePreferences({ hapticFeedback: !preferences.hapticFeedback })}
            color="bg-neo-blue"
          />
          <SettingToggle 
            label={t('settings.contrast')} 
            description={t('settings.contrastDesc')} 
            icon={Eye} 
            active={preferences.highContrast}
            onClick={() => updatePreferences({ highContrast: !preferences.highContrast })}
            color="bg-neo-green"
          />
          <SettingToggle 
            label={t('settings.dark')} 
            description={t('settings.darkDesc')} 
            icon={Moon} 
            active={preferences.darkMode}
            onClick={() => updatePreferences({ darkMode: !preferences.darkMode })}
            color="bg-gray-200"
          />
        </div>
      </SectionWrapper>

      <SectionWrapper className="mt-6">
        <Button 
          variant="primary" 
          fullWidth 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : null}
          {t('settings.save')}
        </Button>
      </SectionWrapper>
    </div>
  );
};
