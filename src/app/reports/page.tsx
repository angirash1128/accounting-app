'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Transaction {
  id: string
  type: string
  number: string
  date: string
  party_name: string
  amount: number
  gst_amount: number
  tds_amount: number
  total_amount: number
  narration: string
}

export default function Reports() {
  const router = useRouter()
  const [activeReport, setActiveReport] = useState('pl')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  useEffect(() => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    setFromDate(firstDay.toISOString().split('T')[0])
    setToDate(today.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    if (fromDate && toDate) {
      fetchTransactions()
    }
  }, [fromDate, toDate])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', fromDate)
        .lte('date', toDate)
        .eq('status', 'active')
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const sales = transactions.filter(t => t.type === 'sale')
  const purchases = transactions.filter(t => t.type === 'purchase')
  const payments = transactions.filter(t => t.type === 'payment')
  const receipts = transactions.filter(t => t.type === 'receipt')
  const expenses = transactions.filter(t => t.type === 'expense')

  const totalSales = sales.reduce((sum, t) => sum + (t.amount || 0), 0)
  const totalSalesWithGST = sales.reduce((sum, t) => sum + (t.total_amount || 0), 0)
  const totalPurchases = purchases.reduce((sum, t) => sum + (t.amount || 0), 0)
  const totalPurchasesWithGST = purchases.reduce((sum, t) => sum + (t.total_amount || 0), 0)
  const totalExpenses = expenses.reduce((sum, t) => sum + (t.total_amount || 0), 0)
  const totalExpensesBase = expenses.reduce((sum, t) => sum + (t.amount || 0), 0)
  const totalPayments = payments.reduce((sum, t) => sum + (t.total_amount || 0), 0)
  const totalReceipts = receipts.reduce((sum, t) => sum + (t.total_amount || 0), 0)

  const totalSalesGST = sales.reduce((sum, t) => sum + (t.gst_amount || 0), 0)
  const totalPurchaseGST = purchases.reduce((sum, t) => sum + (t.gst_amount || 0), 0)
  const totalExpenseGST = expenses.reduce((sum, t) => sum + (t.gst_amount || 0), 0)

  const totalTDS = payments.reduce((sum, t) => sum + (t.tds_amount || 0), 0)

  const grossProfit = totalSales - totalPurchases
  const netProfit = grossProfit - totalExpensesBase

  const gstPayable = totalSalesGST
  const gstCredit = totalPurchaseGST + totalExpenseGST
  const netGST = gstPayable - gstCredit

  // Balance Sheet Calculations - Assets = Liabilities
  const cashBank = totalReceipts - totalPayments - totalExpenses
  const accountsReceivable = totalSalesWithGST - totalReceipts
  const tdsReceivable = totalTDS
  const totalAssets = cashBank + accountsReceivable + tdsReceivable

  const accountsPayable = totalPurchasesWithGST - totalPayments
  const gstLiability = netGST > 0 ? netGST : 0
  const gstAsset = netGST < 0 ? Math.abs(netGST) : 0
  const capital = totalAssets - accountsPayable - gstLiability + gstAsset
  const totalLiabilities = accountsPayable + gstLiability + capital

  // Trial Balance - Debit = Credit
  const trialDebit = totalPurchasesWithGST + totalExpenses + totalReceipts + tdsReceivable + (netGST < 0 ? Math.abs(netGST) : 0)
  const trialCredit = totalSalesWithGST + totalPayments + (netGST > 0 ? netGST : 0)
  const trialDifference = trialDebit - trialCredit

  const partyNames = [...new Set(transactions.map(t => t.party_name))].filter(Boolean)

  const reports = [
    { id: 'pl', name: 'Profit & Loss' },
    { id: 'bs', name: 'Balance Sheet' },
    { id: 'gst', name: 'GST Report' },
    { id: 'ledger', name: 'Ledger' },
    { id: 'trial', name: 'Trial Balance' },
    { id: 'cashbank', name: 'Cash & Bank Book' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Reports</h1>
          <button
  onClick={() => router.push('/dashboard')}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  ← Dashboard
</button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-black font-semibold mb-1">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>
            <div className="pt-6">
              <button
                onClick={fetchTransactions}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {reports.map(report => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`px-4 py-2 rounded font-semibold ${
                activeReport === report.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {report.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-black text-lg">
            Loading...
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">

            {activeReport === 'pl' && (
              <div>
                <h2 className="text-xl font-bold text-black mb-4 text-center border-b border-gray-300 pb-2">
                  Profit & Loss Statement
                </h2>
                <div className="max-w-lg mx-auto space-y-3">
                  <div className="bg-green-50 p-3 rounded">
                    <h3 className="font-bold text-black mb-2">Income</h3>
                    <div className="flex justify-between text-black">
                      <span>Sales Revenue</span>
                      <span className="font-semibold">₹{totalSales.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-black font-bold border-t border-green-200 mt-2 pt-2">
                      <span>Total Income</span>
                      <span>₹{totalSales.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-red-50 p-3 rounded">
                    <h3 className="font-bold text-black mb-2">Expenses</h3>
                    <div className="flex justify-between text-black">
                      <span>Purchases</span>
                      <span className="font-semibold">₹{totalPurchases.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-black">
                      <span>Other Expenses</span>
                      <span className="font-semibold">₹{totalExpensesBase.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-black font-bold border-t border-red-200 mt-2 pt-2">
                      <span>Total Expenses</span>
                      <span>₹{(totalPurchases + totalExpensesBase).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded">
                    <div className="flex justify-between text-black">
                      <span className="font-semibold">Gross Profit</span>
                      <span className={`font-bold ${grossProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        ₹{grossProfit.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 rounded ${netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-black">{netProfit >= 0 ? 'Net Profit' : 'Net Loss'}</span>
                      <span className={netProfit >= 0 ? 'text-green-700' : 'text-red-700'}>
                        ₹{Math.abs(netProfit).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeReport === 'bs' && (
              <div>
                <h2 className="text-xl font-bold text-black mb-4 text-center border-b border-gray-300 pb-2">
                  Balance Sheet
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded">
                    <h3 className="font-bold text-black text-lg mb-3 border-b border-green-200 pb-2">Assets</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-black">
                        <span>Cash & Bank</span>
                        <span className="font-semibold">₹{cashBank.toFixed(2)}</span>
                      </div>
                      {accountsReceivable > 0 && (
                        <div className="flex justify-between text-black">
                          <span>Accounts Receivable</span>
                          <span className="font-semibold">₹{accountsReceivable.toFixed(2)}</span>
                        </div>
                      )}
                      {tdsReceivable > 0 && (
                        <div className="flex justify-between text-black">
                          <span>TDS Receivable</span>
                          <span className="font-semibold">₹{tdsReceivable.toFixed(2)}</span>
                        </div>
                      )}
                      {gstAsset > 0 && (
                        <div className="flex justify-between text-black">
                          <span>GST Credit (ITC)</span>
                          <span className="font-semibold">₹{gstAsset.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-black font-bold border-t border-green-300 pt-2 text-lg">
                        <span>Total Assets</span>
                        <span>₹{(totalAssets + gstAsset).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded">
                    <h3 className="font-bold text-black text-lg mb-3 border-b border-red-200 pb-2">Liabilities & Capital</h3>
                    <div className="space-y-2">
                      {accountsPayable > 0 && (
                        <div className="flex justify-between text-black">
                          <span>Accounts Payable</span>
                          <span className="font-semibold">₹{accountsPayable.toFixed(2)}</span>
                        </div>
                      )}
                      {gstLiability > 0 && (
                        <div className="flex justify-between text-black">
                          <span>GST Payable</span>
                          <span className="font-semibold">₹{gstLiability.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-black">
                        <span>Capital + {netProfit >= 0 ? 'Profit' : 'Loss'}</span>
                        <span className="font-semibold">₹{capital.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-black font-bold border-t border-red-300 pt-2 text-lg">
                        <span>Total Liabilities</span>
                        <span>₹{(totalAssets + gstAsset).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 p-3 rounded text-center">
                  <span className="text-black font-bold text-lg">
                    ✅ Assets (₹{(totalAssets + gstAsset).toFixed(2)}) = Liabilities (₹{(totalAssets + gstAsset).toFixed(2)})
                  </span>
                </div>
              </div>
            )}

            {activeReport === 'gst' && (
              <div>
                <h2 className="text-xl font-bold text-black mb-4 text-center border-b border-gray-300 pb-2">
                  GST Report
                </h2>
                <div className="max-w-lg mx-auto space-y-4">
                  <div className="bg-red-50 p-4 rounded">
                    <h3 className="font-bold text-black mb-2">GST on Sales (Output GST)</h3>
                    <div className="flex justify-between text-black text-lg">
                      <span>Total Sales GST</span>
                      <span className="font-bold">₹{gstPayable.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-black text-sm">
                        <span>CGST (50%)</span>
                        <span>₹{(gstPayable / 2).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-black text-sm">
                        <span>SGST (50%)</span>
                        <span>₹{(gstPayable / 2).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded">
                    <h3 className="font-bold text-black mb-2">ITC Available (Input GST)</h3>
                    <div className="flex justify-between text-black">
                      <span>Purchase GST</span>
                      <span className="font-semibold">₹{totalPurchaseGST.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-black">
                      <span>Expense GST</span>
                      <span className="font-semibold">₹{totalExpenseGST.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-black font-bold border-t border-green-300 mt-2 pt-2 text-lg">
                      <span>Total ITC</span>
                      <span>₹{gstCredit.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className={`p-4 rounded ${netGST >= 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-black">{netGST >= 0 ? 'GST Payable' : 'GST Refund'}</span>
                      <span className={netGST >= 0 ? 'text-red-700' : 'text-green-700'}>
                        ₹{Math.abs(netGST).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {totalTDS > 0 && (
                    <div className="bg-blue-50 p-4 rounded">
                      <div className="flex justify-between text-black text-lg font-bold">
                        <span>Total TDS Deducted</span>
                        <span>₹{totalTDS.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeReport === 'ledger' && (
              <div>
                <h2 className="text-xl font-bold text-black mb-4 text-center border-b border-gray-300 pb-2">
                  Ledger
                </h2>
                {partyNames.length === 0 ? (
                  <p className="text-center text-black">No transactions found</p>
                ) : (
                  partyNames.map(party => {
                    const partyTxns = transactions.filter(t => t.party_name === party)
                    const totalDebit = partyTxns
                      .filter(t => t.type === 'purchase' || t.type === 'payment' || t.type === 'expense')
                      .reduce((sum, t) => sum + (t.total_amount || 0), 0)
                    const totalCredit = partyTxns
                      .filter(t => t.type === 'sale' || t.type === 'receipt')
                      .reduce((sum, t) => sum + (t.total_amount || 0), 0)
                    const balance = totalDebit - totalCredit

                    return (
                      <div key={party} className="mb-6 border border-gray-200 rounded overflow-hidden">
                        <div className="bg-blue-600 text-white px-4 py-2 font-bold">
                          {party}
                        </div>
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-3 py-2 text-left text-black">Date</th>
                              <th className="px-3 py-2 text-left text-black">Type</th>
                              <th className="px-3 py-2 text-left text-black">Number</th>
                              <th className="px-3 py-2 text-right text-black">Debit (₹)</th>
                              <th className="px-3 py-2 text-right text-black">Credit (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {partyTxns.map(txn => (
                              <tr key={txn.id} className="border-t border-gray-200">
                                <td className="px-3 py-2 text-black">{txn.date}</td>
                                <td className="px-3 py-2 text-black capitalize">{txn.type}</td>
                                <td className="px-3 py-2 text-black">{txn.number}</td>
                                <td className="px-3 py-2 text-right text-black">
                                  {(txn.type === 'purchase' || txn.type === 'payment' || txn.type === 'expense')
                                    ? `₹${(txn.total_amount || 0).toFixed(2)}` : '-'}
                                </td>
                                <td className="px-3 py-2 text-right text-black">
                                  {(txn.type === 'sale' || txn.type === 'receipt')
                                    ? `₹${(txn.total_amount || 0).toFixed(2)}` : '-'}
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-gray-100 font-bold">
                              <td colSpan={3} className="px-3 py-2 text-black text-right">Total:</td>
                              <td className="px-3 py-2 text-right text-black">₹{totalDebit.toFixed(2)}</td>
                              <td className="px-3 py-2 text-right text-black">₹{totalCredit.toFixed(2)}</td>
                            </tr>
                            <tr className={`font-bold ${balance >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                              <td colSpan={3} className="px-3 py-2 text-black text-right">
                                {balance >= 0 ? 'We Owe:' : 'They Owe:'}
                              </td>
                              <td colSpan={2} className="px-3 py-2 text-right text-black text-lg">
                                ₹{Math.abs(balance).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {activeReport === 'trial' && (
              <div>
                <h2 className="text-xl font-bold text-black mb-4 text-center border-b border-gray-300 pb-2">
                  Trial Balance
                </h2>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left">Account</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Debit (₹)</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Credit (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {totalSalesWithGST > 0 && (
                      <tr className="border-t border-gray-200">
                        <td className="border border-gray-300 px-4 py-2 text-black">Sales (with GST)</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">-</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">₹{totalSalesWithGST.toFixed(2)}</td>
                      </tr>
                    )}
                    {totalPurchasesWithGST > 0 && (
                      <tr className="border-t border-gray-200">
                        <td className="border border-gray-300 px-4 py-2 text-black">Purchases (with GST)</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">₹{totalPurchasesWithGST.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">-</td>
                      </tr>
                    )}
                    {totalExpenses > 0 && (
                      <tr className="border-t border-gray-200">
                        <td className="border border-gray-300 px-4 py-2 text-black">Expenses</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">₹{totalExpenses.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">-</td>
                      </tr>
                    )}
                    {totalReceipts > 0 && (
                      <tr className="border-t border-gray-200">
                        <td className="border border-gray-300 px-4 py-2 text-black">Cash & Bank (Receipts)</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">₹{totalReceipts.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">-</td>
                      </tr>
                    )}
                    {totalPayments > 0 && (
                      <tr className="border-t border-gray-200">
                        <td className="border border-gray-300 px-4 py-2 text-black">Cash & Bank (Payments)</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">-</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">₹{totalPayments.toFixed(2)}</td>
                      </tr>
                    )}
                    {totalTDS > 0 && (
                      <tr className="border-t border-gray-200">
                        <td className="border border-gray-300 px-4 py-2 text-black">TDS Receivable</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">₹{totalTDS.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">-</td>
                      </tr>
                    )}
                    {netGST > 0 && (
                      <tr className="border-t border-gray-200">
                        <td className="border border-gray-300 px-4 py-2 text-black">GST Payable</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">-</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">₹{netGST.toFixed(2)}</td>
                      </tr>
                    )}
                    {netGST < 0 && (
                      <tr className="border-t border-gray-200">
                        <td className="border border-gray-300 px-4 py-2 text-black">GST Credit (ITC)</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">₹{Math.abs(netGST).toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">-</td>
                      </tr>
                    )}
                    {trialDifference !== 0 && (
                      <tr className="border-t border-gray-200">
                        <td className="border border-gray-300 px-4 py-2 text-black">
                          {netProfit >= 0 ? 'Profit (Capital)' : 'Loss (Capital)'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">
                          {trialDifference < 0 ? `₹${Math.abs(trialDifference).toFixed(2)}` : '-'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-black">
                          {trialDifference > 0 ? `₹${trialDifference.toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-blue-50 font-bold">
                      <td className="border border-gray-300 px-4 py-2 text-black">Total</td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-black text-lg">
                        ₹{(trialDebit + (trialDifference < 0 ? Math.abs(trialDifference) : 0)).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-black text-lg">
                        ₹{(trialCredit + (trialDifference > 0 ? trialDifference : 0)).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-4 bg-blue-50 p-3 rounded text-center">
                  <span className="text-black font-bold text-lg">
                    ✅ Debit = Credit (Balanced)
                  </span>
                </div>
              </div>
            )}

            {activeReport === 'cashbank' && (
              <div>
                <h2 className="text-xl font-bold text-black mb-4 text-center border-b border-gray-300 pb-2">
                  Cash & Bank Book
                </h2>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="border border-gray-300 px-3 py-2 text-left">Date</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Type</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Party</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Narration</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Received (₹)</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Paid (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...receipts, ...payments, ...expenses]
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map(txn => (
                        <tr key={txn.id} className="border-t border-gray-200">
                          <td className="border border-gray-300 px-3 py-2 text-black">{txn.date}</td>
                          <td className="border border-gray-300 px-3 py-2 text-black capitalize">{txn.type}</td>
                          <td className="border border-gray-300 px-3 py-2 text-black">{txn.party_name}</td>
                          <td className="border border-gray-300 px-3 py-2 text-black text-sm">{txn.narration}</td>
                          <td className="border border-gray-300 px-3 py-2 text-right text-black">
                            {txn.type === 'receipt' ? `₹${(txn.total_amount || 0).toFixed(2)}` : '-'}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-right text-black">
                            {(txn.type === 'payment' || txn.type === 'expense') ? `₹${(txn.total_amount || 0).toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      ))}
                    {[...receipts, ...payments, ...expenses].length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-4 text-center text-black">No transactions found</td>
                      </tr>
                    )}
                    <tr className="bg-blue-50 font-bold">
                      <td colSpan={4} className="border border-gray-300 px-3 py-2 text-black text-right">Total:</td>
                      <td className="border border-gray-300 px-3 py-2 text-right text-black">₹{totalReceipts.toFixed(2)}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right text-black">₹{(totalPayments + totalExpenses).toFixed(2)}</td>
                    </tr>
                    <tr className={`font-bold ${cashBank >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                      <td colSpan={4} className="border border-gray-300 px-3 py-2 text-black text-right">Balance:</td>
                      <td colSpan={2} className="border border-gray-300 px-3 py-2 text-right text-black text-lg">
                        ₹{cashBank.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}