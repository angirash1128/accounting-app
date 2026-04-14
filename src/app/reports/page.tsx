"use client";
import { useState } from "react";
export default function Reports() {
  const [activeReport, setActiveReport] = useState("pnl");
  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const pnlData = { revenue: { salesGoods: 850000, salesServices: 150000, salesReturn: -12000, otherIncome: 8500, interestIncome: 3200 }, expenses: { purchases: 520000, purchaseReturn: -8000, salary: 120000, rent: 25000, electricity: 8500, telephone: 4200, travelling: 12000, petrol: 6800, professionalFees: 15000, insurance: 12000, depreciation: 18000, others: 23300 } };
  const totalRevenue = Object.values(pnlData.revenue).reduce((a, b) => a + b, 0);
  const totalExpenses = Object.values(pnlData.expenses).reduce((a, b) => a + b, 0);
  const netProfit = totalRevenue - totalExpenses;
  const gstData = { outward: { b2b: 650000, b2c: 280000, totalTaxable: 930000, cgst: 42000, sgst: 42000, igst: 15000, totalTax: 99000 }, inward: { purchases: 520000, expenses: 85000, totalTaxable: 605000, cgst: 28500, sgst: 28500, igst: 8000, totalITC: 65000 } };
  const netGSTPayable = gstData.outward.totalTax - gstData.inward.totalITC;
  const ledgerEntries = [
    { date: "01 Apr 2025", particular: "Opening Balance", voucherType: "-", debit: 0, credit: 0, balance: 185000 },
    { date: "05 Apr 2025", particular: "Sale to Rajesh Traders", voucherType: "Sale Invoice", debit: 25000, credit: 0, balance: 210000 },
    { date: "08 Apr 2025", particular: "Receipt from Rajesh Traders", voucherType: "Receipt", debit: 0, credit: 15000, balance: 195000 },
    { date: "12 Apr 2025", particular: "Sale to Mohan Sons", voucherType: "Sale Invoice", debit: 18500, credit: 0, balance: 213500 },
    { date: "15 Apr 2025", particular: "Receipt from Mohan Sons", voucherType: "Receipt", debit: 0, credit: 18500, balance: 195000 },
    { date: "20 Apr 2025", particular: "Sale to Priya Garments", voucherType: "Sale Invoice", debit: 32000, credit: 0, balance: 227000 },
    { date: "25 Apr 2025", particular: "Receipt from Rajesh Traders", voucherType: "Receipt", debit: 0, credit: 10000, balance: 217000 },
  ];
  const trialData = [
    {name: "Cash in Hand", debit: 85000, credit: 0}, {name: "Bank Account", debit: 542000, credit: 0},
    {name: "Sundry Debtors", debit: 185000, credit: 0}, {name: "Stock in Trade", debit: 320000, credit: 0},
    {name: "Furniture", debit: 85000, credit: 0}, {name: "Computer", debit: 120000, credit: 0},
    {name: "Vehicle", debit: 450000, credit: 0}, {name: "CGST Input", debit: 28500, credit: 0},
    {name: "SGST Input", debit: 28500, credit: 0}, {name: "Sales", debit: 0, credit: 1000000},
    {name: "Purchase", debit: 520000, credit: 0}, {name: "Salary", debit: 120000, credit: 0},
    {name: "Rent", debit: 25000, credit: 0}, {name: "Sundry Creditors", debit: 0, credit: 195000},
    {name: "CGST Output", debit: 0, credit: 42000}, {name: "SGST Output", debit: 0, credit: 42000},
    {name: "Bank Loan", debit: 0, credit: 350000}, {name: "Capital", debit: 0, credit: 500000},
    {name: "Depreciation", debit: 118000, credit: 0}, {name: "Other Expenses", debit: 51000, credit: 0},
  ];
  const reports = [
    { id: "pnl", label: "📈 Profit and Loss", desc: "Income vs Expenses" },
    { id: "bs", label: "⚖️ Balance Sheet", desc: "Assets vs Liabilities" },
    { id: "gst", label: "📋 GST Summary", desc: "Output vs Input Tax" },
    { id: "ledger", label: "📒 Ledger", desc: "Account wise entries" },
    { id: "trial", label: "📊 Trial Balance", desc: "All accounts summary" },
  ];
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black">Reports</h1>
              <p className="text-base text-black mt-2">All reports are auto generated from your entries</p>
            </div>
            <a href="/dashboard" className="text-base text-black border-2 border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100 font-medium">Back to Dashboard</a>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 mb-8">
          {reports.map((r) => (
            <button key={r.id} onClick={() => setActiveReport(r.id)} className={"p-5 rounded-2xl border-2 text-left transition-all shadow-sm " + (activeReport === r.id ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-gray-200 text-black hover:border-blue-300 hover:shadow")}>
              <p className="text-lg font-bold">{r.label}</p>
              <p className={"text-sm mt-1 " + (activeReport === r.id ? "text-blue-100" : "text-black")}>{r.desc}</p>
            </button>
          ))}
        </div>
        {activeReport === "pnl" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8 pb-4 border-b-2">
              <div><h2 className="text-2xl font-bold text-black">Profit and Loss Statement</h2><p className="text-base text-black mt-1">FY 2025-26 (April 2025 - March 2026)</p></div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">Download PDF</button>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <div className="bg-gray-50 rounded-xl p-5 mb-4"><h3 className="text-lg font-bold text-black">INCOME / REVENUE</h3></div>
                <div className="space-y-4 px-2">
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Sales - Goods</span><span className="text-base font-semibold text-black">{fmt(pnlData.revenue.salesGoods)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Sales - Services</span><span className="text-base font-semibold text-black">{fmt(pnlData.revenue.salesServices)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Less: Sales Return</span><span className="text-base font-semibold text-black">{fmt(pnlData.revenue.salesReturn)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Other Income</span><span className="text-base font-semibold text-black">{fmt(pnlData.revenue.otherIncome)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Interest Income</span><span className="text-base font-semibold text-black">{fmt(pnlData.revenue.interestIncome)}</span></div>
                  <div className="flex justify-between py-4 bg-gray-50 rounded-xl px-4 mt-4"><span className="text-lg font-bold text-black">Total Revenue</span><span className="text-lg font-bold text-black">{fmt(totalRevenue)}</span></div>
                </div>
              </div>
              <div>
                <div className="bg-gray-50 rounded-xl p-5 mb-4"><h3 className="text-lg font-bold text-black">EXPENSES</h3></div>
                <div className="space-y-4 px-2">
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Purchases</span><span className="text-base font-semibold text-black">{fmt(pnlData.expenses.purchases)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Less: Purchase Return</span><span className="text-base font-semibold text-black">{fmt(pnlData.expenses.purchaseReturn)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Salary</span><span className="text-base font-semibold text-black">{fmt(pnlData.expenses.salary)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Rent</span><span className="text-base font-semibold text-black">{fmt(pnlData.expenses.rent)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Electricity</span><span className="text-base font-semibold text-black">{fmt(pnlData.expenses.electricity)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Telephone</span><span className="text-base font-semibold text-black">{fmt(pnlData.expenses.telephone)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Travelling and Petrol</span><span className="text-base font-semibold text-black">{fmt(pnlData.expenses.travelling + pnlData.expenses.petrol)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Professional Fees</span><span className="text-base font-semibold text-black">{fmt(pnlData.expenses.professionalFees)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Insurance</span><span className="text-base font-semibold text-black">{fmt(pnlData.expenses.insurance)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Depreciation</span><span className="text-base font-semibold text-black">{fmt(pnlData.expenses.depreciation)}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-base text-black">Others</span><span className="text-base font-semibold text-black">{fmt(pnlData.expenses.others)}</span></div>
                  <div className="flex justify-between py-4 bg-gray-50 rounded-xl px-4 mt-4"><span className="text-lg font-bold text-black">Total Expenses</span><span className="text-lg font-bold text-black">{fmt(totalExpenses)}</span></div>
                </div>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-2xl p-6 text-center border-2 border-gray-200">
                <p className="text-base text-black mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-black">{fmt(totalRevenue)}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 text-center border-2 border-gray-200">
                <p className="text-base text-black mb-2">Total Expenses</p>
                <p className="text-3xl font-bold text-black">{fmt(totalExpenses)}</p>
              </div>
              <div className="bg-blue-600 rounded-2xl p-6 text-center">
                <p className="text-base text-white mb-2">Net Profit</p>
                <p className="text-3xl font-bold text-white">{fmt(netProfit)}</p>
              </div>
            </div>
          </div>
        )}
        {activeReport === "bs" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8 pb-4 border-b-2">
              <div><h2 className="text-2xl font-bold text-black">Balance Sheet</h2><p className="text-base text-black mt-1">As on 14 April 2026</p></div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">Download PDF</button>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <div className="bg-gray-50 rounded-xl p-5 mb-6"><h3 className="text-lg font-bold text-black">ASSETS</h3></div>
                <div className="bg-gray-50 rounded-xl p-5 mb-4"><h4 className="font-bold text-black">Current Assets</h4></div>
                <div className="space-y-4 px-2 mb-8">
                  {[["Cash in Hand", 85000], ["Bank Balance", 542000], ["Sundry Debtors", 185000], ["Stock in Trade", 320000], ["GST Input Credit", 57000], ["TDS Receivable", 12000], ["Advances", 45000]].map(([name, val]) => (
                    <div key={name} className="flex justify-between py-2 border-b"><span className="text-base text-black">{name}</span><span className="text-base font-semibold text-black">{fmt(val as number)}</span></div>
                  ))}
                  <div className="flex justify-between py-4 bg-gray-100 rounded-xl px-4"><span className="text-base font-bold text-black">Total Current Assets</span><span className="text-base font-bold text-black">{fmt(1246000)}</span></div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 mb-4"><h4 className="font-bold text-black">Fixed Assets</h4></div>
                <div className="space-y-4 px-2">
                  {[["Furniture", 85000], ["Computer", 120000], ["Vehicle", 450000], ["Less: Depreciation", -118000]].map(([name, val]) => (
                    <div key={name} className="flex justify-between py-2 border-b"><span className="text-base text-black">{name}</span><span className="text-base font-semibold text-black">{fmt(val as number)}</span></div>
                  ))}
                  <div className="flex justify-between py-4 bg-gray-100 rounded-xl px-4"><span className="text-base font-bold text-black">Total Fixed Assets</span><span className="text-base font-bold text-black">{fmt(537000)}</span></div>
                </div>
                <div className="flex justify-between py-5 mt-6 bg-blue-600 rounded-2xl px-6"><span className="text-lg font-bold text-white">TOTAL ASSETS</span><span className="text-lg font-bold text-white">{fmt(1783000)}</span></div>
              </div>
              <div>
                <div className="bg-gray-50 rounded-xl p-5 mb-6"><h3 className="text-lg font-bold text-black">LIABILITIES AND EQUITY</h3></div>
                <div className="bg-gray-50 rounded-xl p-5 mb-4"><h4 className="font-bold text-black">Current Liabilities</h4></div>
                <div className="space-y-4 px-2 mb-8">
                  {[["Sundry Creditors", 195000], ["GST Payable", 84000], ["TDS Payable", 8500], ["Salary Payable", 35000]].map(([name, val]) => (
                    <div key={name} className="flex justify-between py-2 border-b"><span className="text-base text-black">{name}</span><span className="text-base font-semibold text-black">{fmt(val as number)}</span></div>
                  ))}
                  <div className="flex justify-between py-4 bg-gray-100 rounded-xl px-4"><span className="text-base font-bold text-black">Total Current Liabilities</span><span className="text-base font-bold text-black">{fmt(322500)}</span></div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 mb-4"><h4 className="font-bold text-black">Long Term Liabilities</h4></div>
                <div className="space-y-4 px-2 mb-8">
                  {[["Bank Loan", 350000], ["Vehicle Loan", 280000]].map(([name, val]) => (
                    <div key={name} className="flex justify-between py-2 border-b"><span className="text-base text-black">{name}</span><span className="text-base font-semibold text-black">{fmt(val as number)}</span></div>
                  ))}
                  <div className="flex justify-between py-4 bg-gray-100 rounded-xl px-4"><span className="text-base font-bold text-black">Total Long Term</span><span className="text-base font-bold text-black">{fmt(630000)}</span></div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 mb-4"><h4 className="font-bold text-black">Equity / Capital</h4></div>
                <div className="space-y-4 px-2">
                  {[["Capital", 500000], ["Current Year Profit", netProfit], ["Less: Drawings", -75000]].map(([name, val]) => (
                    <div key={name} className="flex justify-between py-2 border-b"><span className="text-base text-black">{name}</span><span className="text-base font-semibold text-black">{fmt(val as number)}</span></div>
                  ))}
                  <div className="flex justify-between py-4 bg-gray-100 rounded-xl px-4"><span className="text-base font-bold text-black">Total Equity</span><span className="text-base font-bold text-black">{fmt(500000 + netProfit - 75000)}</span></div>
                </div>
                <div className="flex justify-between py-5 mt-6 bg-blue-600 rounded-2xl px-6"><span className="text-lg font-bold text-white">TOTAL LIABILITIES</span><span className="text-lg font-bold text-white">{fmt(1783000)}</span></div>
              </div>
            </div>
          </div>
        )}
        {activeReport === "gst" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8 pb-4 border-b-2">
              <div><h2 className="text-2xl font-bold text-black">GST Summary Report</h2><p className="text-base text-black mt-1">April 2025</p></div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">Download PDF</button>
            </div>
            <div className="grid grid-cols-2 gap-12 mb-8">
              <div>
                <div className="bg-gray-50 rounded-xl p-5 mb-6"><h3 className="text-lg font-bold text-black">OUTPUT TAX (On Sales)</h3></div>
                <div className="space-y-4 px-2">
                  {[["B2B Taxable Value", gstData.outward.b2b], ["B2C Taxable Value", gstData.outward.b2c], ["Total Taxable", gstData.outward.totalTaxable], ["CGST", gstData.outward.cgst], ["SGST", gstData.outward.sgst], ["IGST", gstData.outward.igst]].map(([name, val]) => (
                    <div key={name} className="flex justify-between py-2 border-b"><span className="text-base text-black">{name}</span><span className="text-base font-semibold text-black">{fmt(val as number)}</span></div>
                  ))}
                  <div className="flex justify-between py-4 bg-gray-100 rounded-xl px-4"><span className="text-base font-bold text-black">Total Output Tax</span><span className="text-base font-bold text-black">{fmt(gstData.outward.totalTax)}</span></div>
                </div>
              </div>
              <div>
                <div className="bg-gray-50 rounded-xl p-5 mb-6"><h3 className="text-lg font-bold text-black">INPUT TAX CREDIT (On Purchases)</h3></div>
                <div className="space-y-4 px-2">
                  {[["Purchases Taxable", gstData.inward.purchases], ["Expenses Taxable", gstData.inward.expenses], ["Total Taxable", gstData.inward.totalTaxable], ["CGST", gstData.inward.cgst], ["SGST", gstData.inward.sgst], ["IGST", gstData.inward.igst]].map(([name, val]) => (
                    <div key={name} className="flex justify-between py-2 border-b"><span className="text-base text-black">{name}</span><span className="text-base font-semibold text-black">{fmt(val as number)}</span></div>
                  ))}
                  <div className="flex justify-between py-4 bg-gray-100 rounded-xl px-4"><span className="text-base font-bold text-black">Total ITC Available</span><span className="text-base font-bold text-black">{fmt(gstData.inward.totalITC)}</span></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="bg-gray-50 rounded-2xl p-6 text-center border-2"><p className="text-base text-black mb-2">Output Tax</p><p className="text-3xl font-bold text-black">{fmt(gstData.outward.totalTax)}</p></div>
              <div className="bg-gray-50 rounded-2xl p-6 text-center border-2"><p className="text-base text-black mb-2">Input Tax Credit</p><p className="text-3xl font-bold text-black">{fmt(gstData.inward.totalITC)}</p></div>
              <div className="bg-blue-600 rounded-2xl p-6 text-center"><p className="text-base text-white mb-2">Net GST Payable</p><p className="text-3xl font-bold text-white">{fmt(netGSTPayable)}</p></div>
            </div>
          </div>
        )}
        {activeReport === "ledger" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8 pb-4 border-b-2">
              <div><h2 className="text-2xl font-bold text-black">Ledger - Sundry Debtors</h2><p className="text-base text-black mt-1">April 2025</p></div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">Download PDF</button>
            </div>
            <table className="w-full">
              <thead><tr className="bg-gray-50 rounded-xl"><th className="p-4 text-left text-base font-bold text-black">Date</th><th className="p-4 text-left text-base font-bold text-black">Particulars</th><th className="p-4 text-left text-base font-bold text-black">Voucher Type</th><th className="p-4 text-left text-base font-bold text-black">Debit</th><th className="p-4 text-left text-base font-bold text-black">Credit</th><th className="p-4 text-left text-base font-bold text-black">Balance</th></tr></thead>
              <tbody>{ledgerEntries.map((entry, i) => (<tr key={i} className="border-b hover:bg-gray-50"><td className="p-4 text-base text-black">{entry.date}</td><td className="p-4 text-base text-black">{entry.particular}</td><td className="p-4 text-base text-black">{entry.voucherType}</td><td className="p-4 text-base font-semibold text-black">{entry.debit > 0 ? fmt(entry.debit) : "-"}</td><td className="p-4 text-base font-semibold text-black">{entry.credit > 0 ? fmt(entry.credit) : "-"}</td><td className="p-4 text-base font-bold text-black">{fmt(entry.balance)}</td></tr>))}</tbody>
            </table>
            <div className="mt-6 p-5 bg-blue-600 rounded-2xl flex justify-between"><span className="text-lg font-bold text-white">Closing Balance</span><span className="text-lg font-bold text-white">{fmt(ledgerEntries[ledgerEntries.length - 1].balance)} Dr</span></div>
          </div>
        )}
        {activeReport === "trial" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8 pb-4 border-b-2">
              <div><h2 className="text-2xl font-bold text-black">Trial Balance</h2><p className="text-base text-black mt-1">As on 14 April 2026</p></div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">Download PDF</button>
            </div>
            <table className="w-full">
              <thead><tr className="bg-gray-50"><th className="p-4 text-left text-base font-bold text-black">Account Name</th><th className="p-4 text-left text-base font-bold text-black">Debit</th><th className="p-4 text-left text-base font-bold text-black">Credit</th></tr></thead>
              <tbody>{trialData.map((acc, i) => (<tr key={i} className="border-b hover:bg-gray-50"><td className="p-4 text-base text-black">{acc.name}</td><td className="p-4 text-base font-semibold text-black">{acc.debit > 0 ? fmt(acc.debit) : "-"}</td><td className="p-4 text-base font-semibold text-black">{acc.credit > 0 ? fmt(acc.credit) : "-"}</td></tr>))}</tbody>
            </table>
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-2xl p-5 text-center border-2"><p className="text-base text-black mb-2">Total Debit</p><p className="text-2xl font-bold text-black">{fmt(2678000)}</p></div>
              <div className="bg-blue-600 rounded-2xl p-5 text-center"><p className="text-base text-white mb-2">Total Credit</p><p className="text-2xl font-bold text-white">{fmt(2129000)}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
