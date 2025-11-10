import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { getUserProfile, saveUserProfile, clearUserProfile } from '../services/userService';

interface UserProfileFormProps {
    onProfileUpdate: (profile: UserProfile | null) => void;
    t: (key: string) => string;
}

const initialProfileState: UserProfile = {
    age: '',
    gender: '',
    nationality: '',
    religion: '',
    other: '',
};

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ onProfileUpdate, t }) => {
    const [profile, setProfile] = useState<UserProfile>(initialProfileState);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedProfile = getUserProfile();
        if (savedProfile) {
            setProfile(savedProfile);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        saveUserProfile(profile);
        onProfileUpdate(profile);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };
    
    const handleClear = () => {
        if (window.confirm(t('clearProfileConfirm'))) {
            clearUserProfile();
            setProfile(initialProfileState);
            onProfileUpdate(null);
        }
    };

    return (
        <div className="p-4 md:p-6 text-slate-300 space-y-4 text-sm leading-relaxed">
            <div className="p-3 bg-yellow-900/20 rounded-md border border-yellow-700/50 text-yellow-300 text-xs">
                <p><strong>{t('privacyNotice')}:</strong> {t('privacyNoticeDesc')}</p>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="age" className="block text-sm font-medium text-slate-300">{t('profileAge')}</label>
                        <input type="text" name="age" id="age" value={profile.age} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2" />
                    </div>
                     <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-slate-300">{t('profileGender')}</label>
                        <input type="text" name="gender" id="gender" value={profile.gender} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2" />
                    </div>
                     <div>
                        <label htmlFor="nationality" className="block text-sm font-medium text-slate-300">{t('profileNationality')}</label>
                        <input type="text" name="nationality" id="nationality" value={profile.nationality} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2" />
                    </div>
                     <div>
                        <label htmlFor="religion" className="block text-sm font-medium text-slate-300">{t('profileReligion')}</label>
                        <input type="text" name="religion" id="religion" value={profile.religion} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2" />
                    </div>
                </div>
                <div>
                    <label htmlFor="other" className="block text-sm font-medium text-slate-300">{t('profileOther')}</label>
                    <input type="text" name="other" id="other" value={profile.other} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2" />
                </div>
                 <div className="flex justify-end gap-4">
                     <button type="button" onClick={handleClear} className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors">
                        {t('clearProfile')}
                    </button>
                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
                        {isSaved ? t('saved') : t('saveProfile')}
                    </button>
                </div>
            </form>
        </div>
    );
};