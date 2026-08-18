function ProfileForm({ user, profileForm, profileErrors, inputClass, handleProfileChange, cities }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label htmlFor="profile-fullName" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
        <input
          id="profile-fullName"
          type="text"
          value={profileForm.fullName}
          onChange={(e) => handleProfileChange('fullName', e.target.value)}
          aria-invalid={!!profileErrors.fullName}
          aria-describedby={profileErrors.fullName ? 'profile-fullName-error' : undefined}
          className={inputClass('fullName', !!profileErrors.fullName)}
        />
        {profileErrors.fullName && <p id="profile-fullName-error" className="mt-2 text-xs font-medium text-brand-orange animate-fade-in" role="alert">{profileErrors.fullName}</p>}
      </div>
      <div>
        <label htmlFor="profile-email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
        <input
          id="profile-email"
          type="email"
          value={profileForm.email || ''}
          onChange={(e) => handleProfileChange('email', e.target.value)}
          aria-invalid={!!profileErrors.email}
          aria-describedby={profileErrors.email ? 'profile-email-error' : undefined}
          placeholder="Enter your email"
          className={inputClass('email', !!profileErrors.email)}
        />
        {profileErrors.email && <p id="profile-email-error" className="mt-2 text-xs font-medium text-brand-orange animate-fade-in" role="alert">{profileErrors.email}</p>}
      </div>
      <div>
        <label htmlFor="profile-mobile" className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
        <div className="relative">
          <input
            id="profile-mobile"
            type="tel"
            inputMode="numeric"
            value={profileForm.mobile}
            onChange={(e) => handleProfileChange('mobile', e.target.value)}
            aria-invalid={!!profileErrors.mobile}
            aria-describedby={profileErrors.mobile ? 'profile-mobile-error' : undefined}
            className={inputClass('mobile', !!profileErrors.mobile)}
            readOnly
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400">
            <i className="fa-solid fa-lock text-xs" />
          </div>
        </div>
        {profileErrors.mobile && <p id="profile-mobile-error" className="mt-2 text-xs font-medium text-brand-orange animate-fade-in" role="alert">{profileErrors.mobile}</p>}
      </div>
      <div>
        <label htmlFor="profile-city" className="block text-sm font-semibold text-slate-700 mb-2">City</label>
        <select
          id="profile-city"
          value={profileForm.city}
          onChange={(e) => handleProfileChange('city', e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300 transition-all duration-200 appearance-none"
        >
          <option value="">Select City</option>
          {Object.entries(cities).map(([id, city]) => (
            <option key={id} value={id}>{city.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="profile-area" className="block text-sm font-semibold text-slate-700 mb-2">Area / Locality</label>
        <select
          id="profile-area"
          value={profileForm.area}
          onChange={(e) => handleProfileChange('area', e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300 transition-all duration-200 appearance-none"
        >
          <option value="">Select Area</option>
          {(cities[profileForm.city]?.areas || []).map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="profile-pincode" className="block text-sm font-semibold text-slate-700 mb-2">Pincode</label>
        <input
          id="profile-pincode"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={profileForm.pincode}
          onChange={(e) => handleProfileChange('pincode', e.target.value)}
          aria-invalid={!!profileErrors.pincode}
          aria-describedby={profileErrors.pincode ? 'profile-pincode-error' : undefined}
          className={inputClass('pincode', !!profileErrors.pincode)}
        />
        {profileErrors.pincode && <p id="profile-pincode-error" className="mt-2 text-xs font-medium text-brand-orange animate-fade-in" role="alert">{profileErrors.pincode}</p>}
      </div>
    </div>
  );
}

export default ProfileForm;