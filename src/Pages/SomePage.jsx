import React, { useEffect, useState } from "react";
import { getProtectedData } from "../Api/Protected";

export default function SomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const result = await getProtectedData();
      setData(result);
    }

    loadData();
  }, []);

  return (
    <div className="text-white bg-gray-900 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Protected Data</h1>
      {data ? (
        <pre className="bg-gray-800 p-4 rounded-lg">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
