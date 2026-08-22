import { useAuth } from '@/store/authSlice';
import { cities } from '@/data/locations';
import { formatDate } from '@/utils';
import PageHeader from '@/components/ui/PageHeader';
import PageContainer from '@/components/ui/PageContainer';
import { useProfileForm } from './hooks/useProfileForm';
import { useNotifications } from './hooks/useNotifications';
import { PhotoUploadSection } from './components/PhotoUploadSection';
import ProfileForm from './components/ProfileForm';
import { NotificationPreferences } from './components/NotificationPreferences';

function ProfilePage() {
  const { user, updateProfile, updateNotifications, uploadProfileImage, loading, error, clearSuccess, successMessage } = useAuth();

  const {
    activeTab,
    setActiveTab,
    saving,
    saveError,
    saveSuccess,
    profileErrors,
    photoUploading,
    photoInputRef,
    profileForm,
    handleProfileChange,
    handlePhotoUpload,
    handleProfileSave,
    inputClass,
    avatarSrc,
    initial,
  } = useProfileForm(user, updateProfile, uploadProfileImage, clearSuccess, successMessage, error);

  const {
    notifSaving,
    handleNotificationToggle,
    handleSavePreferences,
  } = useNotifications(user, updateNotifications);

  const listerId = user?.listerId || user?._id || '—';
  const accountStatus = (user?.accountStatus || 'active').replace(/-/g, ' ');

  return (
    <PageContainer>
      <PageHeader
        title="Account Settings"
        subtitle="Manage your profile details, photo, and notification preferences"
      />

      <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 pt-6">
          <nav className="flex gap-6" aria-label="Profile sections">
            <button
              onClick={() => setActiveTab('profile')}
              aria-current={activeTab === 'profile' ? 'page' : undefined}
              className={`pb-4 text-sm font-bold border-b-2 transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <i className={`fa-solid fa-user-circle ${activeTab === 'profile' ? 'text-brand-blue' : 'text-slate-400'}`} aria-hidden="true" />
              General Profile
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              aria-current={activeTab === 'notifications' ? 'page' : undefined}
              className={`pb-4 text-sm font-bold border-b-2 transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'notifications'
                  ? 'border-brand-gold text-brand-gold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <i className={`fa-solid fa-bell ${activeTab === 'notifications' ? 'text-brand-gold' : 'text-slate-400'}`} aria-hidden="true" />
              Notifications
            </button>
          </nav>
        </div>

        <div className="p-6 sm:p-8">
          {saveSuccess && (
            <div className="mb-8 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 p-4 text-sm font-medium text-brand-gold flex items-start gap-3 animate-fade-in" role="status">
              <i className="fa-solid fa-check-circle mt-0.5" aria-hidden="true" />
              {saveSuccess}
            </div>
          )}
          {saveError && (
            <div className="mb-8 rounded-2xl bg-brand-orange/10 border border-brand-orange/30 p-4 text-sm font-medium text-brand-orange flex items-start gap-3 animate-fade-in" role="alert">
              <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" />
              {saveError}
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-8 animate-fade-in" noValidate>
              <PhotoUploadSection
                user={user}
                avatarSrc={avatarSrc}
                initial={initial}
                photoUploading={photoUploading}
                photoInputRef={photoInputRef}
                handlePhotoUpload={handlePhotoUpload}
              />

              <ProfileForm
                user={user}
                profileForm={profileForm}
                profileErrors={profileErrors}
                inputClass={inputClass}
                handleProfileChange={handleProfileChange}
                cities={cities}
              />

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button type="submit" disabled={saving || loading}
                  className="inline-flex items-center justify-center gap-2 bg-brand-blue text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-glow-blue hover:bg-brand-blue/90 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {saving ? <i className="fa-solid fa-circle-notch fa-spin text-sm" /> : <i className="fa-solid fa-floppy-disk text-sm" />}
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <NotificationPreferences
              user={user}
              notifSaving={notifSaving}
              handleNotificationToggle={handleNotificationToggle}
              handleSavePreferences={handleSavePreferences}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default ProfilePage;