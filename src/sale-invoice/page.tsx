"use client";
import { useState } from "react";

interface InvoiceItem {
  id: number;
  name: string;
  hsn: string;
  qty: number;
  rate: number;
  gstRate: number;
  amount: number;
  gstAmount: number;
  totalAmount: number;
}

export default function SaleInvoice() {
  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    customerGSTIN: "",
    customerPhone: "",
    customerState: "",
    invoiceNumber: "INV-2025-001",
    invoiceDate: new Date().toISOString().split("T")[0],
    paymentMode: "cash",
    companyState: "Himachal Pradesh",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, name: "", hsn: "", qty: 1, rate: 0, gstRate: 18, amount: 0, gstAmount: 0, totalAmount: 0 },
  ]);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Chandigarh", "Jammu & Kashmir", "Ladakh",
  ];

  const gstRates = [0, 0.25, 3, 5, 12, 18, 28];

  const calculateItem = (item: InvoiceItem): InvoiceItem => {
    const amount = item.qty * item.rate;
    const gstAmount = (amount * item.gstRate) / 100;
    const totalAmount = amount + gstAmount;
    return { ...item, amount, gstAmount, totalAmount };
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        return calculateItem(updated);
      }
      return item;
    }));
  };

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([...items, { id: newId, name: "", hsn: "", qty: 1, rate: 0, gstRate: 18, amount: 0, gstAmount: 0, totalAmount: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const isInterstate = invoiceData.customerState !== "" && invoiceData.customerState !== invoiceData.companyState;
  const totalCGST = isInterstate ? 0 : items.reduce((sum, item) => sum + item.gstAmount / 2, 0);
  const totalSGST = isInterstate ? 0 : items.reduce((sum, item) => sum + item.gstAmount / 2, 0);
  const totalIGST = isInterstate ? items.reduce((sum, item) => sum + item.gstAmount, 0) : 0;
  const totalGST = items.reduce((sum, item) => sum + item.gstAmount, 0);
  const grandTotal = subtotal + totalGST;
  const roundedTotal = Math.round(grandTotal);
  const roundOff = roundedTotal - grandTotal;

  const fmt = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Invoice Saved!\n\nInvoice No: " + invoiceData.invoiceNumber + "\nCustomer: " + invoiceData.customerName + "\nSubtotal: " + fmt(subtotal) + "\nGST: " + fmt(totalGST) + "\nGrand Total: " + fmt(roundedTotal) + "\n\nGST Type: " + (isInterstate ? "IGST (Interstate)" : "CGST + SGST (Intrastate)") + "\n\nJournal Entry Created Automatically!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-black">New Sale Invoice</h1>
              <p className="text-sm text-black mt-1">Fill the form, GST will be auto calculated</p>
            </div>
            <a href="/dashboard" className="text-sm text-black border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">Back to Dashboard</a>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-black mb-4">Invoice Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Invoice Number</label>
                <input type="text" value={invoiceData.invoiceNumber} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black outline-none bg-gray-50" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Invoice Date</label>
                <input type="date" value={invoiceData.invoiceDate} onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Payment Mode</label>
                <select value={invoiceData.paymentMode} onChange={(e) => setInvoiceData({ ...invoiceData, paymentMode: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black outline-none bg-white">
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="cheque">Cheque</option>
                  <option value="credit">Credit (Udhar)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-black mb-4">Customer Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Customer Name *</label>
                <input type="text" value={invoiceData.customerName} onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })} placeholder="Customer name" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">GSTIN (Optional)</label>
                <input type="text" value={invoiceData.customerGSTIN} onChange={(e) => setInvoiceData({ ...invoiceData, customerGSTIN: e.target.value.toUpperCase() })} placeholder="22AAAAA0000A1Z5" maxLength={15} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Phone Number</label>
                <input type="tel" value={invoiceData.customerPhone} onChange={(e) => setInvoiceData({ ...invoiceData, customerPhone: e.target.value })} placeholder="9876543210" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Customer State *</label>
                <select value={invoiceData.customerState} onChange={(e) => setInvoiceData({ ...invoiceData, customerState: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black outline-none bg-white" required>
                  <option value="">-- Select State --</option>
                  {indianStates.map((state) => (<option key={state} value={state}>{state}</option>))}
                </select>
              </div>
            </div>
            {invoiceData.customerState && (
              <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm font-semibold text-black">{isInterstate ? "IGST will apply (Interstate: " + invoiceData.companyState + " to " + invoiceData.customerState + ")" : "CGST + SGST will apply (Intrastate: Same State - " + invoiceData.customerState + ")"}</p>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-black mb-4">Items / Products</h2>
            <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-semibold text-black bg-gray-100 p-3 rounded-lg">
              <div className="col-span-1">#</div>
              <div className="col-span-2">Item Name</div>
              <div className="col-span-1">HSN</div>
              <div className="col-span-1">Qty</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-1">GST %</div>
              <div className="col-span-1">Amount</div>
              <div className="col-span-1">GST</div>
              <div className="col-span-1">Total</div>
              <div className="col-span-1"></div>
            </div>
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <div className="col-span-1 text-sm text-black pl-3">{index + 1}</div>
                <div className="col-span-2"><input type="text" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} placeholder="Item" className="w-full px-2 py-2 border border-gray-300 rounded text-sm text-black outline-none" /></div>
                <div className="col-span-1"><input type="text" value={item.hsn} onChange={(e) => updateItem(item.id, "hsn", e.target.value)} placeholder="HSN" className="w-full px-2 py-2 border border-gray-300 rounded text-sm text-black outline-none" /></div>
                <div className="col-span-1"><input type="number" value={item.qty} onChange={(e) => updateItem(item.id, "qty", parseFloat(e.target.value) || 0)} min="0" className="w-full px-2 py-2 border border-gray-300 rounded text-sm text-black outline-none" /></div>
                <div className="col-span-2"><input type="number" value={item.rate} onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)} min="0" placeholder="0" className="w-full px-2 py-2 border border-gray-300 rounded text-sm text-black outline-none" /></div>
                <div className="col-span-1"><select value={item.gstRate} onChange={(e) => updateItem(item.id, "gstRate", parseFloat(e.target.value))} className="w-full px-1 py-2 border border-gray-300 rounded text-sm text-black outline-none bg-white">{gstRates.map((rate) => (<option key={rate} value={rate}>{rate}%</option>))}</select></div>
                <div className="col-span-1"><p className="text-sm text-black">{fmt(item.amount)}</p></div>
                <div className="col-span-1"><p className="text-sm text-black">{fmt(item.gstAmount)}</p></div>
                <div className="col-span-1"><p className="text-sm font-bold text-black">{fmt(item.totalAmount)}</p></div>
                <div className="col-span-1"><button type="button" onClick={() => removeItem(item.id)} className="text-black font-bold px-2">X</button></div>
              </div>
            ))}
            <button type="button" onClick={addItem} className="mt-3 text-sm font-semibold text-black border-2 border-dashed border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 w-full">+ Add More Items</button>
          </div>
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="max-w-sm ml-auto">
              <h2 className="text-lg font-bold text-black mb-4">Invoice Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-black">Subtotal</span><span className="text-sm font-medium text-black">{fmt(subtotal)}</span></div>
                {isInterstate ? (
                  <div className="flex justify-between"><span className="text-sm text-black">IGST</span><span className="text-sm font-medium text-black">{fmt(totalIGST)}</span></div>
                ) : (
                  <><div className="flex justify-between"><span className="text-sm text-black">CGST</span><span className="text-sm font-medium text-black">{fmt(totalCGST)}</span></div><div className="flex justify-between"><span className="text-sm text-black">SGST</span><span className="text-sm font-medium text-black">{fmt(totalSGST)}</span></div></>
                )}
                <div className="flex justify-between"><span className="text-sm text-black">Round Off</span><span className="text-sm text-black">{roundOff >= 0 ? "+" : ""}{roundOff.toFixed(2)}</span></div>
                <div className="border-t-2 border-gray-300 pt-3 flex justify-between"><span className="text-lg font-bold text-black">Grand Total</span><span className="text-lg font-bold text-black">{fmt(roundedTotal)}</span></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 mb-6 border-2 border-dashed border-gray-200">
            <h2 className="text-lg font-bold text-black mb-2">Auto Journal Entry Preview</h2>
            <p className="text-xs text-black mb-3">This entry will be automatically created when you save</p>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-black bg-gray-100"><th className="p-2">Account</th><th className="p-2">Debit</th><th className="p-2">Credit</th></tr></thead>
              <tbody>
                <tr className="border-b border-gray-200"><td className="p-2 text-black font-medium">{invoiceData.customerName || "Customer"} A/c</td><td className="p-2 font-bold text-black">{fmt(roundedTotal)}</td><td className="p-2 text-black">-</td></tr>
                <tr className="border-b border-gray-200"><td className="p-2 text-black font-medium">Sales A/c</td><td className="p-2 text-black">-</td><td className="p-2 font-bold text-black">{fmt(subtotal)}</td></tr>
                {isInterstate ? (
                  <tr className="border-b border-gray-200"><td className="p-2 text-black font-medium">IGST Output A/c</td><td className="p-2 text-black">-</td><td className="p-2 font-bold text-black">{fmt(totalIGST)}</td></tr>
                ) : (
                  <><tr className="border-b border-gray-200"><td className="p-2 text-black font-medium">CGST Output A/c</td><td className="p-2 text-black">-</td><td className="p-2 font-bold text-black">{fmt(totalCGST)}</td></tr><tr className="border-b border-gray-200"><td className="p-2 text-black font-medium">SGST Output A/c</td><td className="p-2 text-black">-</td><td className="p-2 font-bold text-black">{fmt(totalSGST)}</td></tr></>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex space-x-4 mb-10">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg">Save Invoice</button>
            <button type="button" className="px-8 bg-gray-200 text-black py-3 rounded-xl font-bold hover:bg-gray-300">Save and Print</button>
          </div>
        </form>
      </div>
    </div>
  );
}