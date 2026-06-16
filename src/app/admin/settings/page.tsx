'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Save, Store, Mail, Phone, MapPin, DollarSign, Truck, Shield, Globe, Search, Bell, CreditCard } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/Loading'

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [settings, setSettings] = useState({
    storeName: 'Majesty Compucare Limited',
    storeEmail: 'sales.compucare111@gmail.com',
    storePhone: '+254 712 345 678',
    storeAddress: 'Nakuru, Kenya',
    currency: 'KES',
    taxRate: 16,
    shippingFee: 200,
    freeShippingThreshold: 5000,
    maintenanceMode: false,
    allowReviews: true,
    requireApprovalForReviews: false,
    mpesaEnabled: true,
    cashOnDeliveryEnabled: true,
    orderPrefix: 'ORD-',
    itemsPerPage: 12,
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    },
    seo: {
      title: 'Majesty Compucare Limited - Your Trusted Technology Partner in Kenya',
      description: 'Specializing in computer sales, IT solutions, CCTV security systems, networking, and technology support services.',
      keywords: 'computers, laptops, printers, CCTV, networking, IT solutions, Kenya, Nakuru'
    }
  })

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchSettings()
    }
  }, [status, session])

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        setSaveMessage('Settings saved successfully!')
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        setSaveMessage('Failed to save settings')
      }
    } catch (e) {
      setSaveMessage('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateSocialLink = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value }
    }))
  }

  const updateSeo = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      seo: { ...prev.seo, [key]: value }
    }))
  }

  if (status === 'loading') return <Loading />
  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    router.push('/admin')
    return null
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'social', label: 'Social', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
          {saveMessage && (
            <div className={`mb-6 p-4 rounded-lg ${saveMessage.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {saveMessage}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex">
              {/* Sidebar Tabs */}
              <div className="w-64 border-r bg-gray-50">
                <nav className="p-4 space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition text-left ${
                          activeTab === tab.id
                            ? 'bg-white text-blue-600 font-medium shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-8">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                        <div className="flex items-center space-x-2">
                          <Store className="w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={settings.storeName}
                            onChange={(e) => updateSetting('storeName', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Email</label>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={settings.storeEmail}
                            onChange={(e) => updateSetting('storeEmail', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Phone</label>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={settings.storePhone}
                            onChange={(e) => updateSetting('storePhone', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={settings.storeAddress}
                            onChange={(e) => updateSetting('storeAddress', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-5 h-5 text-gray-400" />
                          <select
                            value={settings.currency}
                            onChange={(e) => updateSetting('currency', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="KES">KES (Kenyan Shilling)</option>
                            <option value="USD">USD (US Dollar)</option>
                            <option value="EUR">EUR (Euro)</option>
                            <option value="GBP">GBP (British Pound)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                        <input
                          type="number"
                          value={settings.taxRate}
                          onChange={(e) => updateSetting('taxRate', parseFloat(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Order Prefix</label>
                        <input
                          type="text"
                          value={settings.orderPrefix}
                          onChange={(e) => updateSetting('orderPrefix', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Items Per Page</label>
                        <input
                          type="number"
                          value={settings.itemsPerPage}
                          onChange={(e) => updateSetting('itemsPerPage', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.allowReviews}
                            onChange={(e) => updateSetting('allowReviews', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-gray-700">Allow Customer Reviews</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.requireApprovalForReviews}
                            onChange={(e) => updateSetting('requireApprovalForReviews', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-gray-700">Require Approval for Reviews</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.maintenanceMode}
                            onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-gray-700">Maintenance Mode</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Payment Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.mpesaEnabled}
                            onChange={(e) => updateSetting('mpesaEnabled', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <div>
                            <span className="font-medium text-gray-900">M-Pesa Payments</span>
                            <p className="text-sm text-gray-500">Enable M-Pesa mobile money payments</p>
                          </div>
                        </label>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.cashOnDeliveryEnabled}
                            onChange={(e) => updateSetting('cashOnDeliveryEnabled', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <div>
                            <span className="font-medium text-gray-900">Cash on Delivery</span>
                            <p className="text-sm text-gray-500">Allow customers to pay on delivery</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Shipping Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Shipping Fee (KES)</label>
                        <input
                          type="number"
                          value={settings.shippingFee}
                          onChange={(e) => updateSetting('shippingFee', parseFloat(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold (KES)</label>
                        <input
                          type="number"
                          value={settings.freeShippingThreshold}
                          onChange={(e) => updateSetting('freeShippingThreshold', parseFloat(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">Orders above this amount qualify for free shipping</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">SEO Settings</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                        <input
                          type="text"
                          value={settings.seo.title}
                          onChange={(e) => updateSeo('title', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                        <textarea
                          value={settings.seo.description}
                          onChange={(e) => updateSeo('description', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                        <input
                          type="text"
                          value={settings.seo.keywords}
                          onChange={(e) => updateSeo('keywords', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Social Media Links</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                        <input
                          type="url"
                          value={settings.socialLinks.facebook}
                          onChange={(e) => updateSocialLink('facebook', e.target.value)}
                          placeholder="https://facebook.com/..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                        <input
                          type="url"
                          value={settings.socialLinks.twitter}
                          onChange={(e) => updateSocialLink('twitter', e.target.value)}
                          placeholder="https://twitter.com/..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                        <input
                          type="url"
                          value={settings.socialLinks.instagram}
                          onChange={(e) => updateSocialLink('instagram', e.target.value)}
                          placeholder="https://instagram.com/..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                        <input
                          type="url"
                          value={settings.socialLinks.linkedin}
                          onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-gray-600">Notification settings will be available in a future update.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
