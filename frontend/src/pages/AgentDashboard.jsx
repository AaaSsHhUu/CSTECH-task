import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const AgentDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();

  const fetchAgentLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/agent/leads/${user.id}`, // Assuming this route gets leads for logged-in agent
        { withCredentials: true }
      );

      if (res.data.success) {
        setLeads(res.data.leads);
      } else {
        toast.error("Failed to load leads");
      }
    } catch (error) {
      toast.error("Error fetching leads");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentLeads();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading your leads...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        My Assigned Leads
      </h1>

      {leads.length === 0 ? (
        <div className="text-center text-gray-500">No leads assigned yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="text-left p-3">First Name</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr
                  key={lead._id || index}
                  className="border-t hover:bg-gray-50 text-sm"
                >
                  <td className="p-3">{lead.firstName}</td>
                  <td className="p-3">{lead.phone}</td>
                  <td className="p-3">{lead.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
