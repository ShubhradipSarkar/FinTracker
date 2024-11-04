"use client"
import React, { useState } from "react";

const Tracker = () => {
  const [salary, setSalary] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [fields, setFields] = useState({
    necessities: { total: 0, subfields: { a: 0, b: 0, c: 0, d: 0, e: 0 }, submitted: false },
    savings: { total: 0, subfields: { a: 0, b: 0, c: 0, d: 0, e: 0 }, submitted: false },
    investment: { total: 0, subfields: { a: 0, b: 0, c: 0, d: 0, e: 0 }, submitted: false },
    leisure: { total: 0, subfields: { a: 0, b: 0, c: 0, d: 0, e: 0 }, submitted: false },
    charity: { total: 0, subfields: { a: 0, b: 0, c: 0, d: 0, e: 0 }, submitted: false },
  });

  const handleSalaryChange = (e) => {
    const newSalary = parseFloat(e.target.value) || 0;
    setSalary(newSalary);
    setRemaining(newSalary - getTotalExpense());
  };

  const handleSubfieldChange = (mainField, subField, value) => {
    const updatedFields = {
      ...fields,
      [mainField]: {
        ...fields[mainField],
        subfields: { ...fields[mainField].subfields, [subField]: parseFloat(value) || 0 },
      },
    };
    setFields(updatedFields);
  };

  const calculateMainFieldTotal = (mainField) => {
    const subfields = fields[mainField].subfields;
    return Object.values(subfields).reduce((acc, subValue) => acc + subValue, 0) ;
  };

  const handleSubmit = (mainField) => {
    const mainFieldTotal = calculateMainFieldTotal(mainField);
    const updatedFields = {
      ...fields,
      [mainField]: { ...fields[mainField], total: mainFieldTotal, submitted: true },
    };
    setFields(updatedFields);
    setRemaining(salary - getTotalExpense(updatedFields));
  };

  const getTotalExpense = (updatedFields = fields) => {
    return Object.values(updatedFields).reduce((acc, { total }) => acc + total, 0);
  };

  const getPercentage = (value) => (salary > 0 ? ((value / salary) * 100).toFixed(2) : "0.00");

  const getBarColor = (percentage) => {
    if (percentage > 75) return "bg-red-500";
    if (percentage > 50) return "bg-orange-500";
    if (percentage > 25) return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Financial Tracker</h1>

      {/* Remaining Salary */}
      <div className="p-4 mb-6 bg-blue-100 rounded-lg text-center">
        <h2 className="text-lg font-semibold text-gray-700">Remaining Salary:</h2>
        <p className="text-3xl font-bold text-blue-600">${remaining >= 0 ? remaining.toFixed(2) : 0}</p>
      </div>

      {/* Salary Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Enter Salary:</label>
        <input
          type="number"
          value={salary}
          onChange={handleSalaryChange}
          className="w-full text-gray-500 p-2 border rounded-lg"
          placeholder="Enter your credited salary"
        />
      </div>

      {/* Fields and Subfields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.keys(fields).map((mainField) => {
          const mainFieldTotal = calculateMainFieldTotal(mainField);
          const mainFieldPercentage = getPercentage(mainFieldTotal);

          return (
            <div key={mainField} className="p-4 bg-gray-100 text-gray-500 rounded-lg shadow-md">
              <label className="block text-gray-700 font-semibold capitalize mb-2">
                {mainField} Expense
              </label>
              <div className="text-sm text-gray-500">Total: ${mainFieldTotal.toFixed(2)}</div>
              <div className="text-sm text-gray-500">
                Percentage of Salary: {mainFieldPercentage}%
              </div>

              {/* Percentage Bar for Main Field */}
              <div className="relative w-full h-4 bg-gray-300 rounded-lg mt-2">
                <div
                  className={`h-4 rounded-lg ${getBarColor(mainFieldPercentage)}`}
                  
                ></div>
              </div>

              {/* Subfields */}
              <button
                className="text-blue-600 text-sm mt-2 underline"
                onClick={() =>
                  setFields({
                    ...fields,
                    [mainField]: { ...fields[mainField], showSubfields: !fields[mainField].showSubfields },
                  })
                }
              >
                {fields[mainField].showSubfields ? "Hide Subfields" : "Show Subfields"}
              </button>

              {fields[mainField].showSubfields && (
                <div className="mt-4 space-y-2">
                  {Object.keys(fields[mainField].subfields).map((subField) => (
                    <div key={subField} className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-gray-600 font-semibold">{subField.toUpperCase()}</label>
                        <input
                          type="number"
                          value={fields[mainField].subfields[subField]}
                          onChange={(e) => handleSubfieldChange(mainField, subField, e.target.value)}
                          className="w-2/5 p-1 border rounded text-gray-500"
                          placeholder={`Set ${subField} %`}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => handleSubmit(mainField)}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tracker;
