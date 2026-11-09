'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Save, Loader2, CheckCircle, AlertCircle, Phone, 
  Mail, MapPin, Clock, Globe, Camera, PlayCircle, MessageCircle
} from 'lucide-react';

interface ContactSettings {
  id: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  google_maps_embed: string;
  office_hours: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  whatsapp_number: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    if (typeof supabase.from !== 'function') {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .limit(1)
        .single();

      if (data && !error) {
        setSettings(data as ContactSettings);
      } else if (error && error.code === 'PGRST116') {
        // No rows returned, we can just let it be null and the user will create one on save
        setSettings({
          id: '',
          phone: '',
          mobile: '',
          email: '',
          address: '',
          google_maps_embed: '',
          office_hours: '',
          facebook_url: '',
          instagram_url: '',
          youtube_url: '',
          whatsapp_number: ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 4000);
  };

  const handleInputChange = (field: keyof ContactSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setSaving(true);
    try {
      const payload = {
        phone: settings.phone,
        mobile: settings.mobile,
        email: settings.email,
        address: settings.address,
        google_maps_embed: settings.google_maps_embed,
        office_hours: settings.office_hours,
        facebook_url: settings.facebook_url,
        instagram_url: settings.instagram_url,
        youtube_url: settings.youtube_url,
        whatsapp_number: settings.whatsapp_number,
        updated_at: new Date().toISOString()
      };

      if (settings.id) {
        const { error } = await supabase
          .from('contact_settings')
          .update(payload)
          .eq('id', settings.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contact_settings')
          .insert([payload]);
        
        if (error) throw error;
        // Reload to get ID
        loadSettings();
      }

      showToast('success', 'Settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      showToast('error', err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p>Loading settings...</p>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Settings</h1>
        <p className="text-sm text-gray-500">Manage contact information and social media links displayed on the website.</p>
      </div>

      {/* Toast Notification */}
      {status && (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
          <div>
            <h4 className="font-medium">{status.type === 'success' ? 'Success' : 'Error'}</h4>
            <p className="text-sm opacity-90">{status.message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-500" />
            General Contact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Primary Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={settings.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="+91 - XXXX- XXXXXX"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={settings.mobile || ''}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  value={settings.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="contact@school.edu"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Office Hours
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={settings.office_hours || ''}
                  onChange={(e) => handleInputChange('office_hours', e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Mon - Sat: 9:00 AM - 4:30 PM"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location & Map */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Location
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Address
              </label>
              <textarea 
                rows={3}
                value={settings.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                placeholder="Enter full physical address..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Google Maps Embed URL (src link)
              </label>
              <input 
                type="text" 
                value={settings.google_maps_embed || ''}
                onChange={(e) => handleInputChange('google_maps_embed', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs"
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-xs text-gray-500 mt-1">Go to Google Maps &gt; Share &gt; Embed a map &gt; Copy only the URL inside the src="..." attribute.</p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-500" />
            Social Media
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Facebook URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="url" 
                  value={settings.facebook_url || ''}
                  onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Instagram URL
              </label>
              <div className="relative">
                <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="url" 
                  value={settings.instagram_url || ''}
                  onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                YouTube Channel URL
              </label>
              <div className="relative">
                <PlayCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="url" 
                  value={settings.youtube_url || ''}
                  onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://youtube.com/c/..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                WhatsApp Number (for chat)
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={settings.whatsapp_number || ''}
                  onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. +919876543210 (include country code)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 pb-12">
          <button 
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
