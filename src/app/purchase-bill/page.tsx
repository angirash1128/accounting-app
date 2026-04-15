'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PurchaseBill() {
  const router = useRouter()
  const [bill, setBill] = useState({
    number: 'PUR-001',
    date: new Date().toISOString().split('T')[0],
    party_name: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0, gst_rate: 18, gst_amount: 0 }],
    narration: ''
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...bill.items]
    newItems[index] = { ...newItems[index], [field]: value }
    if (field === 'quantity' || field === 'rate' || field === 'gst_rate') {
      const qty = field === 'quantity' ? Number(value) : newItems[index].quantity
      const rate = field === 'rate' ? Number(value) : newItems[index].rate
      const gstRate = field === 'gst_rate' ? Number(value) : newItems[index].gst_rate
      const amount = qty * rate
      const gstAmount = (amount * gstRate) / 100
      newItems[index].amount = amount
      newItems[index].gst_amount = gstAmount
    }
    setBill({ ...bill, items: newItems })
  }

  const addItem = () => {
    setBill({
      ...bill,
      items: [...bill.items, { description: '', quantity: 1, rate: 0, amount: 0, gst_rate: 18, gst_amount: 0 }]
    })
  }

  const removeItem = (index: number) => {
    if (bill.items.length > 1) {
      const newItems = bill.items.filter((_, i) => i !== index)
      setBill({ ...bill, items: newItems })
    }
  }

  const subtotal = bill.items.reduce((sum, item) => sum + item.amount, 0)
  const totalGst = bill.items.reduce((sum, item) => sum + item.gst_amount, 0)
  const grandTotal = subtotal + totalGst

  const saveBill = async () => {
    if (!bill.party_name) { alert('Please enter party name!'); return }
    setLoading(true)
    try {
      // ✅ Get Current Logged In User
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please login first!')
        router.push('/login')
        return
      }

      const { data: txn, error: txnError } = await supabase
        .from('transactions')
        .insert({
          type: 'purchase',
          number: bill.number,
          date: bill.date,
          party_name: bill.party_name,
          amount: subtotal,
          gst_rate: bill.items[0]?.gst_rate || 0,
          gst_amount: totalGst,
          total_amount: grandTotal,
          narration: bill.narration,
          status: 'active',
          user_id: session.user.id  // ✅ User ID Save Ho Raha Hai
        })
        .select()
        .single()

      if (txnError) throw txnError

      for (const item of bill.items) {
        await supabase.from('transaction_items').insert({
          transaction_id: txn.id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
          gst_rate: item.gst_rate,
          gst_amount: item.gst_amount
        })
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      setBill({
        number: `PUR-${String(Date.now()).slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        party_name: '',
        items: [{ description: '', quantity: 1, rate: 0, amount: 0, gst_rate: 18, gst_amount: 0 }],
        narration: ''
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving bill!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">🛒 Purchase Bill</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ← Dashboard
          </button>
        </div>

        {saved && (
          <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded mb-4 text-center font-bold">
            ✅ Purchase Bill Saved Successfully!
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-black font-semibold mb-1">Bill Number</label>
              <input
                type="text"
                value={bill.number}
                onChange={(e) => setBill({ ...bill, number: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1">Date</label>
              <input
                type="date"
                value={bill.date}
                onChange={(e) => setBill({ ...bill, date: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1">Party Name *</label>
              <input
                type="text"
                value={bill.party_name}
                onChange={(e) => setBill({ ...bill, party_name: e.target.value })}
                placeholder="Supplier name"
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>
          </div>

          <h2 className="text-lg font-bold text-black mb-3">Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-gray-300 px-3 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-20">Qty</th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-28">Rate</th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-28">Amount</th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-24">GST %</th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-28">GST Amt</th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-28">Total</th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-16">X</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Item name"
                        className="w-full border-none outline-none text-black"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        className="w-full text-center border-none outline-none text-black"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                        className="w-full text-center border-none outline-none text-black"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center text-black font-semibold">
                      ₹{item.amount.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <select
                        value={item.gst_rate}
                        onChange={(e) => updateItem(index, 'gst_rate', Number(e.target.value))}
                        className="w-full text-center border-none outline-none text-black"
                      >
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                        <option value={28}>28%</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center text-black">
                      ₹{item.gst_amount.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center text-black font-bold">
                      ₹{(item.amount + item.gst_amount).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      <button onClick={() => removeItem(index)} className="text-red-600 font-bold hover:text-red-800">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={addItem} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Item
          </button>

          <div className="mt-6 flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-black">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black">
                <span>Total GST:</span>
                <span className="font-semibold">₹{totalGst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-700 font-semibold">
                <span>ITC Claimable:</span>
                <span>₹{totalGst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black text-xl font-bold border-t border-gray-300 pt-2">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-black font-semibold mb-1">Narration</label>
            <textarea
              value={bill.narration}
              onChange={(e) => setBill({ ...bill, narration: e.target.value })}
              placeholder="Any notes..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              rows={2}
            />
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={saveBill}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded text-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : '💾 Save Purchase Bill'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}