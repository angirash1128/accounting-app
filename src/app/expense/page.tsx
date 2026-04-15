'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Expense() {
  const router = useRouter()
  const [expense, setExpense] = useState({
    number: 'EXP-001',
    date: new Date().toISOString().split('T')[0],
    category: 'office',
    party_name: '',
    amount: 0,
    gst_applicable: false,
    gst_rate: 18,
    gst_amount: 0,
    total_amount: 0,
    payment_mode: 'bank',
    narration: ''
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateAmount = (value: number) => {
    const gstAmount = expense.gst_applicable ? (value * expense.gst_rate) / 100 : 0
    setExpense({ ...expense, amount: value, gst_amount: gstAmount, total_amount: value + gstAmount })
  }

  const toggleGST = (checked: boolean) => {
    const gstAmount = checked ? (expense.amount * expense.gst_rate) / 100 : 0
    setExpense({ ...expense, gst_applicable: checked, gst_amount: gstAmount, total_amount: expense.amount + gstAmount })
  }

  const updateGSTRate = (rate: number) => {
    const gstAmount = expense.gst_applicable ? (expense.amount * rate) / 100 : 0
    setExpense({ ...expense, gst_rate: rate, gst_amount: gstAmount, total_amount: expense.amount + gstAmount })
  }

  const saveExpense = async () => {
    if (!expense.party_name) { alert('Please enter party name!'); return }
    if (expense.amount <= 0) { alert('Please enter amount!'); return }
    setLoading(true)
    try {
      // ✅ Get Current Logged In User
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please login first!')
        router.push('/login')
        return
      }

      await supabase.from('transactions').insert({
        type: 'expense',
        number: expense.number,
        date: expense.date,
        party_name: expense.party_name,
        amount: expense.amount,
        gst_rate: expense.gst_applicable ? expense.gst_rate : 0,
        gst_amount: expense.gst_amount,
        total_amount: expense.gst_applicable ? expense.total_amount : expense.amount,
        narration: `${expense.category.toUpperCase()} | ${expense.payment_mode.toUpperCase()} | ${expense.narration}`,
        status: 'active',
        user_id: session.user.id  // ✅ User ID Save Ho Raha Hai
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      setExpense({
        number: `EXP-${String(Date.now()).slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        category: 'office',
        party_name: '',
        amount: 0,
        gst_applicable: false,
        gst_rate: 18,
        gst_amount: 0,
        total_amount: 0,
        payment_mode: 'bank',
        narration: ''
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving expense!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">📋 Expense Voucher</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ← Dashboard
          </button>
        </div>

        {saved && (
          <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded mb-4 text-center font-bold">
            ✅ Expense Saved Successfully!
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-black font-semibold mb-1">Expense Number</label>
              <input type="text" value={expense.number}
                onChange={(e) => setExpense({ ...expense, number: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1">Date</label>
              <input type="date" value={expense.date}
                onChange={(e) => setExpense({ ...expense, date: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1">Category</label>
              <select value={expense.category}
                onChange={(e) => setExpense({ ...expense, category: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black">
                <option value="office">Office Expense</option>
                <option value="rent">Rent</option>
                <option value="salary">Salary</option>
                <option value="travel">Travel</option>
                <option value="telephone">Telephone</option>
                <option value="internet">Internet</option>
                <option value="electricity">Electricity</option>
                <option value="repair">Repair & Maintenance</option>
                <option value="printing">Printing & Stationery</option>
                <option value="transport">Transport</option>
                <option value="professional">Professional Fees</option>
                <option value="insurance">Insurance</option>
                <option value="misc">Miscellaneous</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-black font-semibold mb-1">Party Name *</label>
              <input type="text" value={expense.party_name}
                onChange={(e) => setExpense({ ...expense, party_name: e.target.value })}
                placeholder="Paid to whom"
                className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1">Amount (₹) *</label>
              <input type="number" value={expense.amount}
                onChange={(e) => updateAmount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black text-lg" />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
            <div className="flex items-center mb-4">
              <input type="checkbox" checked={expense.gst_applicable}
                onChange={(e) => toggleGST(e.target.checked)} className="w-5 h-5 mr-3" />
              <label className="text-black font-bold text-lg">GST Applicable?</label>
            </div>
            {expense.gst_applicable && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-black font-semibold mb-1">GST Rate (%)</label>
                  <select value={expense.gst_rate}
                    onChange={(e) => updateGSTRate(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black">
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-black font-semibold mb-1">GST Amount</label>
                  <input type="text" value={`₹${expense.gst_amount.toFixed(2)}`} readOnly
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black bg-gray-100 font-bold" />
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-black font-semibold mb-1">Payment Mode</label>
            <select value={expense.payment_mode}
              onChange={(e) => setExpense({ ...expense, payment_mode: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black">
              <option value="cash">Cash</option>
              <option value="bank">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-black">
                <span>Base Amount:</span>
                <span className="font-semibold">₹{expense.amount.toFixed(2)}</span>
              </div>
              {expense.gst_applicable && (
                <div className="flex justify-between text-black">
                  <span>GST ({expense.gst_rate}%):</span>
                  <span className="font-semibold">₹{expense.gst_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-black text-xl font-bold border-t border-blue-300 pt-2">
                <span>Total Expense:</span>
                <span>₹{(expense.gst_applicable ? expense.total_amount : expense.amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-black font-semibold mb-1">Narration</label>
            <textarea value={expense.narration}
              onChange={(e) => setExpense({ ...expense, narration: e.target.value })}
              placeholder="Expense details..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-black" rows={2} />
          </div>

          <div className="text-center">
            <button onClick={saveExpense} disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded text-lg font-bold hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? 'Saving...' : '💾 Save Expense'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}