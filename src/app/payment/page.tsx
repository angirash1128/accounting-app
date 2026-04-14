'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Payment() {
  const router = useRouter()
  const [payment, setPayment] = useState({
    number: 'PAY-001',
    date: new Date().toISOString().split('T')[0],
    party_name: '',
    amount: 0,
    payment_mode: 'bank',
    tds_applicable: false,
    tds_section: '194C',
    tds_rate: 2,
    tds_amount: 0,
    net_amount: 0,
    narration: ''
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const calculateTDS = (amount: number, tdsApplicable: boolean, tdsRate: number) => {
    const tdsAmount = tdsApplicable ? (amount * tdsRate) / 100 : 0
    const netAmount = amount - tdsAmount
    return { tdsAmount, netAmount }
  }

  const updateAmount = (value: number) => {
    const { tdsAmount, netAmount } = calculateTDS(value, payment.tds_applicable, payment.tds_rate)
    setPayment({ ...payment, amount: value, tds_amount: tdsAmount, net_amount: netAmount })
  }

  const toggleTDS = (checked: boolean) => {
    const { tdsAmount, netAmount } = calculateTDS(payment.amount, checked, payment.tds_rate)
    setPayment({ ...payment, tds_applicable: checked, tds_amount: tdsAmount, net_amount: netAmount })
  }

  const updateTDSRate = (rate: number) => {
    const { tdsAmount, netAmount } = calculateTDS(payment.amount, payment.tds_applicable, rate)
    setPayment({ ...payment, tds_rate: rate, tds_amount: tdsAmount, net_amount: netAmount })
  }

  const updateTDSSection = (section: string) => {
    let rate = 2
    if (section === '194C') rate = 2
    else if (section === '194J') rate = 10
    else if (section === '194H') rate = 5
    else if (section === '194I') rate = 10
    else if (section === '194A') rate = 10
    const { tdsAmount, netAmount } = calculateTDS(payment.amount, payment.tds_applicable, rate)
    setPayment({ ...payment, tds_section: section, tds_rate: rate, tds_amount: tdsAmount, net_amount: netAmount })
  }

  const savePayment = async () => {
    if (!payment.party_name) { alert('Party name daalo!'); return }
    if (payment.amount <= 0) { alert('Amount daalo!'); return }
    setLoading(true)
    try {
      await supabase.from('transactions').insert({
        type: 'payment',
        number: payment.number,
        date: payment.date,
        party_name: payment.party_name,
        amount: payment.amount,
        tds_rate: payment.tds_applicable ? payment.tds_rate : 0,
        tds_amount: payment.tds_amount,
        total_amount: payment.tds_applicable ? payment.net_amount : payment.amount,
        narration: `${payment.payment_mode.toUpperCase()} | TDS: ${payment.tds_applicable ? payment.tds_section : 'N/A'} | ${payment.narration}`,
        status: 'active'
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      setPayment({
        number: `PAY-${String(Date.now()).slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        party_name: '',
        amount: 0,
        payment_mode: 'bank',
        tds_applicable: false,
        tds_section: '194C',
        tds_rate: 2,
        tds_amount: 0,
        net_amount: 0,
        narration: ''
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving payment!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Payment Voucher</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ← Dashboard
          </button>
        </div>

        {saved && (
          <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded mb-4 text-center font-bold">
            ✅ Payment Saved Successfully!
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-black font-semibold mb-1">Voucher Number</label>
              <input type="text" value={payment.number}
                onChange={(e) => setPayment({ ...payment, number: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1">Date</label>
              <input type="date" value={payment.date}
                onChange={(e) => setPayment({ ...payment, date: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1">Party Name *</label>
              <input type="text" value={payment.party_name}
                onChange={(e) => setPayment({ ...payment, party_name: e.target.value })}
                placeholder="Pay to whom"
                className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-black font-semibold mb-1">Amount (₹) *</label>
              <input type="number" value={payment.amount}
                onChange={(e) => updateAmount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black text-lg" />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1">Payment Mode</label>
              <select value={payment.payment_mode}
                onChange={(e) => setPayment({ ...payment, payment_mode: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black">
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
            <div className="flex items-center mb-4">
              <input type="checkbox" checked={payment.tds_applicable}
                onChange={(e) => toggleTDS(e.target.checked)} className="w-5 h-5 mr-3" />
              <label className="text-black font-bold text-lg">TDS Applicable?</label>
            </div>
            {payment.tds_applicable && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-black font-semibold mb-1">TDS Section</label>
                  <select value={payment.tds_section}
                    onChange={(e) => updateTDSSection(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black">
                    <option value="194C">194C - Contractor (2%)</option>
                    <option value="194J">194J - Professional (10%)</option>
                    <option value="194H">194H - Commission (5%)</option>
                    <option value="194I">194I - Rent (10%)</option>
                    <option value="194A">194A - Interest (10%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-black font-semibold mb-1">TDS Rate (%)</label>
                  <input type="number" value={payment.tds_rate}
                    onChange={(e) => updateTDSRate(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
                </div>
                <div>
                  <label className="block text-black font-semibold mb-1">TDS Amount</label>
                  <input type="text" value={`₹${payment.tds_amount.toFixed(2)}`} readOnly
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black bg-gray-100 font-bold" />
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-black">
                <span>Gross Amount:</span>
                <span className="font-semibold">₹{payment.amount.toFixed(2)}</span>
              </div>
              {payment.tds_applicable && (
                <div className="flex justify-between text-red-600">
                  <span>TDS ({payment.tds_section} @ {payment.tds_rate}%):</span>
                  <span className="font-semibold">- ₹{payment.tds_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-black text-xl font-bold border-t border-blue-300 pt-2">
                <span>Net Payment:</span>
                <span>₹{(payment.tds_applicable ? payment.net_amount : payment.amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-black font-semibold mb-1">Narration</label>
            <textarea value={payment.narration}
              onChange={(e) => setPayment({ ...payment, narration: e.target.value })}
              placeholder="Payment details..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-black" rows={2} />
          </div>

          <div className="text-center">
            <button onClick={savePayment} disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded text-lg font-bold hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? 'Saving...' : '💾 Save Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}