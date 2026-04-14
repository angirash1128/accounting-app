'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Transaction {
  id: string
  type: string
  date: string
  party_name: string
  amount: number
  gst_amount: number
  tds_amount: number
  total_amount: number
}

export default function Dashboard() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('status', 'active')
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const handleFocus = () => {
      fetchData()
    }
    window.addEventListener('focus', handleFocus)
    window.addEventListener('popstate', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('popstate', handleFocus)
    }
  }, [fetchData])

  const sales = transactions.filter(t => t.type === 'sale')
  const purchases = transactions.filter(t => t.type === 'purchase')
  const payments = transactions.filter(t => t.type === 'payment')
  const receipts = transactions.filter(t => t.type === 'receipt')
  const expenses = transactions.filter(t => t.type === 'expense')

  const totalSales = sales.reduce((sum, t) => sum + (t.total_amount || 0), 0)
  const totalPurchases = purchases.reduce((sum, t) => sum + (t.total_amount || 0), 0)
  const totalPayments = payments.reduce((sum, t) => sum + (t.total_amount || 0), 0)
  const totalReceipts = receipts.reduce((sum, t) => sum + (t.total_amount || 0), 0)
  const totalExpenses = expenses.reduce((sum, t) => sum + (t.total_amount || 0), 0)

  const totalSalesGST = sales.reduce((sum, t) => sum + (t.gst_amount || 0), 0)
  const totalPurchaseGST = purchases.reduce((sum, t) => sum + (t.gst_amount || 0), 0)
  const netGST = totalSalesGST - totalPurchaseGST

  const totalTDS = payments.reduce((sum, t) => sum + (t.tds_amount || 0), 0)

  const salesBase = sales.reduce((sum, t) => sum + (t.amount || 0), 0)
  const purchasesBase = purchases.reduce((sum, t) => sum + (t.amount || 0), 0)
  const expensesBase = expenses.reduce((sum, t) => sum + (t.amount || 0), 0)
  const netProfit = salesBase - purchasesBase - expensesBase

  const cashBalance = totalReceipts - totalPayments - totalExpenses

  const recentTransactions = transactions.slice(0, 10)

  const menuItems = [
    { name: 'Sale Invoice', link: '/sale-invoice', icon: '📄', color: 'bg-green-50 border-green-200' },
    { name: 'Purchase Bill', link: '/purchase-bill', icon: '🛒', color: 'bg-orange-50 border-orange-200' },
    { name: 'Payment', link: '/payment', icon: '💸', color: 'bg-red-50 border-red-200' },
    { name: 'Receipt', link: '/receipt', icon: '💰', color: 'bg-blue-50 border-blue-200' },
    { name: 'Expense', link: '/expense', icon: '📋', color: 'bg-yellow-50 border-yellow-200' },
    { name: 'Reports', link: '/reports', icon: '📊', color: 'bg-purple-50 border-purple-200' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-black text-lg py-8">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                <p className="text-black text-sm">Total Sales</p>
                <p className="text-black text-xl font-bold">₹{totalSales.toFixed(2)}</p>
                <p className="text-black text-xs">{sales.length} invoices</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
                <p className="text-black text-sm">Total Purchases</p>
                <p className="text-black text-xl font-bold">₹{totalPurchases.toFixed(2)}</p>
                <p className="text-black text-xs">{purchases.length} bills</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <p className="text-black text-sm">Cash Balance</p>
                <p className={`text-xl font-bold ${cashBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ₹{cashBalance.toFixed(2)}
                </p>
                <p className="text-black text-xs">Receipts - Payments</p>
              </div>
              <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${netProfit >= 0 ? 'border-green-500' : 'border-red-500'}`}>
                <p className="text-black text-sm">{netProfit >= 0 ? 'Net Profit' : 'Net Loss'}</p>
                <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ₹{Math.abs(netProfit).toFixed(2)}
                </p>
                <p className="text-black text-xs">Sales - Purchases - Expenses</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                <p className="text-black text-sm">Total Expenses</p>
                <p className="text-black text-xl font-bold">₹{totalExpenses.toFixed(2)}</p>
                <p className="text-black text-xs">{expenses.length} entries</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                <p className="text-black text-sm">Total Receipts</p>
                <p className="text-black text-xl font-bold">₹{totalReceipts.toFixed(2)}</p>
                <p className="text-black text-xs">{receipts.length} entries</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                <p className="text-black text-sm">GST {netGST >= 0 ? 'Payable' : 'Credit'}</p>
                <p className="text-black text-xl font-bold">₹{Math.abs(netGST).toFixed(2)}</p>
                <p className="text-black text-xs">Output - Input GST</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
                <p className="text-black text-sm">TDS Deducted</p>
                <p className="text-black text-xl font-bold">₹{totalTDS.toFixed(2)}</p>
                <p className="text-black text-xs">{payments.filter(p => (p.tds_amount || 0) > 0).length} payments</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {menuItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => router.push(item.link)}
                  className={`${item.color} border rounded-lg p-4 text-center hover:shadow-md transition cursor-pointer`}
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-black font-semibold text-sm">{item.name}</p>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-black mb-4">Recent Transactions</h2>
              {recentTransactions.length === 0 ? (
                <p className="text-center text-black py-4">No transactions yet. Start by creating a Sale Invoice!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="border border-gray-300 px-3 py-2 text-left">Date</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Type</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Party</th>
                        <th className="border border-gray-300 px-3 py-2 text-right">Amount (₹)</th>
                        <th className="border border-gray-300 px-3 py-2 text-right">GST (₹)</th>
                        <th className="border border-gray-300 px-3 py-2 text-right">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map(txn => (
                        <tr key={txn.id} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2 text-black">{txn.date}</td>
                          <td className="border border-gray-300 px-3 py-2 text-black capitalize">
                            <span className={`px-2 py-1 rounded text-sm font-semibold ${
                              txn.type === 'sale' ? 'bg-green-100 text-green-800' :
                              txn.type === 'purchase' ? 'bg-orange-100 text-orange-800' :
                              txn.type === 'payment' ? 'bg-red-100 text-red-800' :
                              txn.type === 'receipt' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {txn.type}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-black">{txn.party_name}</td>
                          <td className="border border-gray-300 px-3 py-2 text-right text-black">₹{(txn.amount || 0).toFixed(2)}</td>
                          <td className="border border-gray-300 px-3 py-2 text-right text-black">₹{(txn.gst_amount || 0).toFixed(2)}</td>
                          <td className="border border-gray-300 px-3 py-2 text-right text-black font-bold">₹{(txn.total_amount || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}