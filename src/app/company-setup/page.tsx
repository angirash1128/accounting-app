"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompanySetup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessCategory: "",
    gstRegistered: "",
    gstin: "",
    gstScheme: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    financialYearStart: "april",
    panNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const businessTypes = [
    "Sole Proprietorship",
    "Partnership Firm",
    "LLP (Limited Liability Partnership)",
    "Private Limited Company",
    "Public Limited Company",
    "HUF (Hindu Undivided Family)",
    "Trust / NGO",
    "Others"
  ];

  const businessCategories = [
    "🛒 Retail / General Store",
    "📦 Wholesale / Distributor",
    "🏭 Manufacturing / Factory",
    "💻 IT / Software Services",
    "🔧 Professional Services (CA, Lawyer, Doctor)",
    "🍕 Restaurant / Food Business",
    "⛽ Petrol Pump",
    "🏗️ Construction / Real Estate",
    "📱 E-Commerce / Online Seller",
    "🚛 Transport / Logistics",
    "👨‍🌾 Agriculture / Farming",
    "🎓 Education / Coaching",
    "💊 Medical / Pharmacy",
    "👔 Freelancer / Consultant",
    "🏪 Departmental Store",
    "🏭 Trading Company",
    "🔌 Electronics / Hardware",
    "👗 Textile / Garments",
    "💎 Jewellery",
    "📋 Others"
  ];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Chandigarh", "Jammu & Kashmir", "Ladakh",
    "Puducherry", "Andaman & Nicobar", "Lakshadweep",
    "Dadra & Nagar Haveli and Daman & Diu"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🏢</div>
          <h1 className="text-2xl font-bold text-black">
            Setup Your Business
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Fill in your details once and everything will be auto-configured
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {step > s ? "✓" : s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 mx-1 ${step > s ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between mb-6 px-2">
          <span className={`text-xs font-semibold ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
            🏪 Business Info
          </span>
          <span className={`text-xs font-semibold ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
            📋 GST & Tax
          </span>
          <span className={`text-xs font-semibold ${step >= 3 ? "text-blue-600" : "text-gray-400"}`}>
            📍 Address
          </span>
        </div>

        <form onSubmit={handleSubmit}>

          {/* STEP 1: Business Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  🏢 Business / Company Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  🏛️ Business Type *
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black bg-white"
                  required
                >
                  <option value="">-- Select Business Type --</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  📦 Business Category *
                </label>
                <select
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black bg-white"
                  required
                >
                  <option value="">-- Select Business Category --</option>
                  {businessCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  📞 Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg text-lg"
              >
                Next Step →
              </button>
            </div>
          )}

          {/* STEP 2: GST & Tax */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  🧾 GST Registered? *
                </label>
                <select
                  name="gstRegistered"
                  value={formData.gstRegistered}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black bg-white"
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="yes">✅ Yes, GST Registered</option>
                  <option value="no">❌ No, Not Registered</option>
                  <option value="applied">⏳ Applied, In Process</option>
                </select>
              </div>

              {formData.gstRegistered === "yes" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      🔢 GSTIN Number *
                    </label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      placeholder="22AAAAA0000A1Z5"
                      maxLength={15}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black uppercase"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Enter 15 digit GSTIN number
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      📊 GST Scheme *
                    </label>
                    <select
                      name="gstScheme"
                      value={formData.gstScheme}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black bg-white"
                      required
                    >
                      <option value="">-- Select GST Scheme --</option>
                      <option value="regular">📄 Regular (Normal GST Filing)</option>
                      <option value="composition">📝 Composition Scheme (Turnover up to 1.5 Cr)</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  🪪 PAN Number *
                </label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  📅 Financial Year Start
                </label>
                <select
                  name="financialYearStart"
                  value={formData.financialYearStart}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black bg-white"
                >
                  <option value="april">📅 April (Standard - April to March)</option>
                  <option value="january">📅 January (January to December)</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Address */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  🏠 Business Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete business address"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    🏙️ City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    📮 PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="177001"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  🗺️ State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black bg-white"
                  required
                >
                  <option value="">-- Select State --</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  📧 Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="business@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
                >
                  ✅ Setup Complete
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            💡 You can change these details later from Settings
          </p>
        </div>
      </div>
    </div>
  );
}