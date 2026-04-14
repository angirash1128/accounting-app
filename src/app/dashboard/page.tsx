"use client";
import { useState } from "react";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("home");

  // Demo Data
  const todayStats = {
    totalSales: 45250,
    totalPurchase: 32100,
    totalExpense: 5400,
    cashInHand: 128750,
    bankBalance: 542000,
    receivable: 185000,
    payable: 95000,
  };

  const recentTransactions = [
    { id: 1, type: "sale", party: "Rajesh Traders", amount: 15000, date: "आज", status: "paid" },
    { id: 2, type: "purchase", party: "Delhi Wholesale", amount: 32100, date: "आज", status: "unpaid" },
    { id: 3, type: "receipt", party: "Mohan & Sons", amount: 8500, date: "कल", status: "paid" },
    { id: 4, type: "expense", party: "Electricity Bill", amount: 2400, date: "कल", status: "paid" },
    { id: 5, type: "sale", party: "Priya Garments", amount: 22000, date: "2 दिन पहले", status: "unpaid" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const menuItems = [
    { id: "home", label: "🏠 Home", },
    { id: "sale", label: "🧾 New Sale", },
    { id: "purchase", label: "🛒 New Purchase", },
    { id: "payment", label: "💸 Payment", },
    { id: "receipt", label: "💰 Receipt", },
    { id: "expense", label: "📝 Expense", },
    { id: "parties", label: "👥 Parties", },
    { id: "items", label: "📦 Items", },
    { id: "reports", label: "📊 Reports", },
    { id: "gst", label: "📋 GST", },
    { id: "settings", label: "⚙️ Settings", },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
        {/* Logo */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">📊</span>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Accounting App</h1>
              <p className="text-xs text-gray-500">Form Bharo, Sab Auto!</p>
            </div>
          </div>
        </div>

        {/* Company Name */}
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <p className="text-sm font-semibold text-blue-800">🏢 Sharma General Store</p>
          <p className="text-xs text-blue-600">FY 2025-26</p>
        </div>

        {/* Menu */}
        <nav className="p-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-1 text-sm font-medium transition-all ${
                activeMenu === item.id
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Sharma Ji</p>
              <p className="text-xs text-gray-500">Owner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🏠 Dashboard</h2>
            <p className="text-sm text-gray-500">Aaj ka business overview</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-all shadow">
              + New Sale 🧾
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow">
              + New Purchase 🛒
            </button>
          </div>
        </div>

        {/* Stats Cards - Row 1 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
            <p className="text-sm text-gray-500 mb-1">📈 Aaj ki Sale</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(todayStats.totalSales)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-red-500">
            <p className="text-sm text-gray-500 mb-1">📉 Aaj ki Purchase</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(todayStats.totalPurchase)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-orange-500">
            <p className="text-sm text-gray-500 mb-1">📝 Aaj ka Expense</p>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(todayStats.totalExpense)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500 mb-1">💰 Net Profit (Aaj)</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(todayStats.totalSales - todayStats.totalPurchase - todayStats.totalExpense)}
            </p>
          </div>
        </div>

        {/* Stats Cards - Row 2 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500 mb-1">💵 Cash in Hand</p>
            <p className="text-xl font-bold text-gray-800">
              {formatCurrency(todayStats.cashInHand)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500 mb-1">🏦 Bank Balance</p>
            <p className="text-xl font-bold text-gray-800">
              {formatCurrency(todayStats.bankBalance)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500 mb-1">📥 Receivable (Lena hai)</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(todayStats.receivable)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500 mb-1">📤 Payable (Dena hai)</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(todayStats.payable)}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-6 gap-3">
            {[
              { icon: "🧾", label: "Sale Invoice", color: "bg-green-50 hover:bg-green-100 text-green-700" },
              { icon: "🛒", label: "Purchase", color: "bg-blue-50 hover:bg-blue-100 text-blue-700" },
              { icon: "💸", label: "Payment", color: "bg-red-50 hover:bg-red-100 text-red-700" },
              { icon: "💰", label: "Receipt", color: "bg-yellow-50 hover:bg-yellow-100 text-yellow-700" },
              { icon: "📝", label: "Expense", color: "bg-orange-50 hover:bg-orange-100 text-orange-700" },
              { icon: "📊", label: "Reports", color: "bg-purple-50 hover:bg-purple-100 text-purple-700" },
            ].map((action) => (
              <button
                key={action.label}
                className={`${action.color} p-4 rounded-xl text-center transition-all shadow-sm hover:shadow`}
              >
                <div className="text-2xl mb-1">{action.icon}</div>
                <div className="text-xs font-semibold">{action.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">📋 Recent Transactions</h3>
            <button className="text-sm text-blue-600 hover:underline">View All →</button>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="pb-3">Type</th>
                <th className="pb-3">Party</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      txn.type === "sale" ? "bg-green-100 text-green-700" :
                      txn.type === "purchase" ? "bg-blue-100 text-blue-700" :
                      txn.type === "receipt" ? "bg-yellow-100 text-yellow-700" :
                      "bg-orange-100 text-orange-700"
                    }`}>
                      {txn.type === "sale" ? "🧾 Sale" :
                       txn.type === "purchase" ? "🛒 Purchase" :
                       txn.type === "receipt" ? "💰 Receipt" :
                       "📝 Expense"}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-800 font-medium">{txn.party}</td>
                  <td className="py-3 text-sm text-gray-500">{txn.date}</td>
                  <td className="py-3 text-sm font-bold text-gray-800">
                    {formatCurrency(txn.amount)}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      txn.status === "paid" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {txn.status === "paid" ? "✅ Paid" : "⏳ Unpaid"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* GST Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📋 GST Summary (This Month)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Output GST (Sales pe)</span>
                <span className="text-sm font-bold text-red-600">{formatCurrency(8145)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Input GST (Purchase pe)</span>
                <span className="text-sm font-bold text-green-600">{formatCurrency(5778)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-800">Net GST Payable</span>
                <span className="text-sm font-bold text-blue-600">{formatCurrency(2367)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-bold text-gray-800 mb-3">🔔 Reminders</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-red-50 rounded-lg">
                <span className="text-lg">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-red-800">GSTR-3B Due</p>
                  <p className="text-xs text-red-600">20 July 2025 tak file karo</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                <span className="text-lg">💰</span>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Rajesh Traders se ₹22,000 lena hai</p>
                  <p className="text-xs text-yellow-600">5 din overdue</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                <span className="text-lg">📄</span>
                <div>
                  <p className="text-sm font-medium text-blue-800">GSTR-1 Ready</p>
                  <p className="text-xs text-blue-600">11 July 2025 tak file karo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profit & Loss Mini */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-3">📊 Profit & Loss (This Month)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(285000)}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(198000)}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Net Profit</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(87000)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}