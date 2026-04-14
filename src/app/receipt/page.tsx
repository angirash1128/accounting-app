'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Receipt() {
  const router = useRouter()
  const [receipt, setReceipt] = useState({
    number: 'REC-001',
    date: new Date().toISOString().split('T')[0],
    party_name: '',
    amount: 0,
    receipt_mode: 'bank',
    against_invoice: '',
    narration: ''
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const saveReceipt = async () => {
    if (!receipt.party_name) { alert('Party name daalo!'); return }
    if (receipt.amount <= 0) { alert('Amount daalo!'); return }
    setLoading(true)
    try {
      await supabase.from('transactions').insert({
        type: 'receipt',
        number: receipt.number,
        date: receipt.date,
        party_name: receipt.party_name,
        amount: receipt.amount,
        total_amount: receipt.amount,
        narration: `${receipt.receipt_mode.toUpperCase()} | Against: ${receipt.against_invoice || 'N/A'} | ${receipt.narration}`,
        status: 'active'
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      setReceipt({
        number: `REC-${String(Date.now()).slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        party_name: '',
        amount: 0,
        receipt_mode: 'bank',
        against_invoice: '',
        narration: ''
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving receipt!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Receipt Voucher</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ← Dashboard
          </button>
        </div>

        {saved && (
          <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded mb-4 text-center font-bold">
            ✅ Receipt Saved Successfully!
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-black font-semibold mb-1">Receipt Number</label>
              <input type="text" value={receipt.number}
                onChange={(e) => setReceipt({ ...receipt, number: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1">Date</label>
              <input type="date" value={receipt.date}
                onChange={(e) => setReceipt({ ...receipt, date: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1">Party Name *</label>
              <input type="text" value={receipt.party_name}
                onChange={(e) => setReceipt({ ...receipt, party_name: e.target.value })}
                placeholder="Received from"
                className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-black font-semibold mb-1">Amount (₹) *</label>
              <input type="number" value={receipt.amount}
                onChange={(e) => setReceipt({ ...receipt, amount: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black text-lg" />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1">Receipt Mode</label>
              <select value={receipt.receipt_mode}
                onChange={(e) => setReceipt({ ...receipt, receipt_mode: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black">
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-black font-semibold mb-1">Against Invoice</label>
            <input type="text" value={receipt.against_invoice}
              onChange={(e) => setReceipt({ ...receipt, against_invoice: e.target.value })}
              placeholder="Invoice number (optional)"
              className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <div className="flex justify-between text-black text-xl font-bold">
              <span>Total Receipt Amount:</span>
              <span>₹{receipt.amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-black font-semibold mb-1">Narration</label>
            <textarea value={receipt.narration}
              onChange={(e) => setReceipt({ ...receipt, narration: e.target.value })}
              placeholder="Receipt details..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-black" rows={2} />
          </div>

          <div className="text-center">
            <button onClick={saveReceipt} disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded text-lg font-bold hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? 'Saving...' : '💾 Save Receipt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}