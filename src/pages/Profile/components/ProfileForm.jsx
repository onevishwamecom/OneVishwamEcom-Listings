function ProfileForm({ user, profileForm, profileErrors, inputClass, handleProfileChange, cities }) {
  const currentCityKey = Object.keys(cities || {}).find(
    (k) => k.toLowerCase() === (profileForm.city || '').toLowerCase()
  ) || profileForm.city;
  const suggestedAreas = (cities && (cities[currentCityKey]?.areas || cities[profileForm.city]?.areas)) || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label htmlFor="profile-fullName" className="block text-sm font-semibold text-slate-700 mb-2">
          Full Name
        </label>
        <input
          id="profile-fullName"
          type="text"
          value={profileForm.fullName}
          onChange={(e) => handleProfileChange('fullName', e.target.value)}
          aria-invalid={!!profileErrors.fullName}
          aria-describedby={profileErrors.fullName ? 'profile-fullName-error' : undefined}
          placeholder="Enter your full name"
          className={inputClass('fullName', !!profileErrors.fullName)}
        />
        {profileErrors.fullName && (
          <p id="profile-fullName-error" className="mt-2 text-xs font-medium text-brand-orange animate-fade-in" role="alert">
            {profileErrors.fullName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="profile-email" className="block text-sm font-semibold text-slate-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <input
            id="profile-email"
            type="email"
            value={profileForm.email || ''}
            readOnly
            tabIndex={-1}
            placeholder="Email address"
            className="w-full rounded-2xl border border-slate-200 bg-slate-100/70 px-4 py-3.5 pr-10 text-sm font-medium text-slate-600 cursor-not-allowed select-none outline-none"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400" title="Non-editable">
            <i className="fa-solid fa-lock text-xs" />
          </div>
        </div>
        <p className="mt-1.5 text-xs text-slate-400">Email address cannot be changed</p>
      </div>

      <div>
        <label htmlFor="profile-mobile" className="block text-sm font-semibold text-slate-700 mb-2">
          Phone Number
        </label>
        <div className="relative">
          <input
            id="profile-mobile"
            type="tel"
            value={profileForm.mobile || ''}
            readOnly
            tabIndex={-1}
            placeholder="Phone number"
            className="w-full rounded-2xl border border-slate-200 bg-slate-100/70 px-4 py-3.5 pr-10 text-sm font-medium text-slate-600 cursor-not-allowed select-none outline-none"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400" title="Non-editable">
            <i className="fa-solid fa-lock text-xs" />
          </div>
        </div>
        <p className="mt-1.5 text-xs text-slate-400">Phone number cannot be changed</p>
      </div>

      <div>
        <label htmlFor="profile-city" className="block text-sm font-semibold text-slate-700 mb-2">
          City <span className="text-xs font-normal text-slate-400 ml-1">(Optional)</span>
        </label>
        <div className="relative">
          <select
            id="profile-city"
            value={profileForm.city}
            onChange={(e) => handleProfileChange('city', e.target.value)}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 pr-10 text-sm outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300 transition-all duration-200"
          >
            <option value="">Select City</option>
            {Object.entries(cities || {}).map(([id, city]) => (
              <option key={id} value={id}>{city.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
            <i className="fa-solid fa-chevron-down text-xs" />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="profile-area" className="block text-sm font-semibold text-slate-700 mb-2">
          Area / Locality <span className="text-xs font-normal text-slate-400 ml-1">(Optional)</span>
        </label>
        <input
          id="profile-area"
          type="text"
          list="area-suggestions"
          value={profileForm.area || ''}
          onChange={(e) => handleProfileChange('area', e.target.value)}
          placeholder="e.g. Whitefield, Koramangala"
          className={inputClass('area', !!profileErrors.area)}
        />
        {suggestedAreas.length > 0 && (
          <datalist id="area-suggestions">
            {suggestedAreas.map((area) => (
              <option key={area} value={area} />
            ))}
          </datalist>
        )}
      </div>

      <div>
        <label htmlFor="profile-pincode" className="block text-sm font-semibold text-slate-700 mb-2">
          Pincode <span className="text-xs font-normal text-slate-400 ml-1">(Optional)</span>
        </label>
        <input
          id="profile-pincode"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={profileForm.pincode}
          onChange={(e) => handleProfileChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter 6-digit pincode"
          aria-invalid={!!profileErrors.pincode}
          aria-describedby={profileErrors.pincode ? 'profile-pincode-error' : undefined}
          className={inputClass('pincode', !!profileErrors.pincode)}
        />
        {profileErrors.pincode && (
          <p id="profile-pincode-error" className="mt-2 text-xs font-medium text-brand-orange animate-fade-in" role="alert">
            {profileErrors.pincode}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfileForm;