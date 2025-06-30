import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Eye, Upload } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const AdminDashboard = () => {
    const { register, handleSubmit } = useForm();

    const [agents, setAgents] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const [showAddAgentModal, setShowAddAgentModal] = useState(false);
    const [showLeadsModal, setShowLeadsModal] = useState(false);

    const [selectedAgentLeads, setSelectedAgentLeads] = useState([]);
    const [selectedAgentName, setSelectedAgentName] = useState('');

    const [loading, setLoading] = useState(false);
    const [addAgentLoading, setAddAgentLoading] = useState(false);
    const [uploadFileLoading, setUploadFileLoading] = useState(false);
    const [leadsLoading, setLeadsLoading] = useState(false);

    const fetchAllAgents = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/agent/all`,
                { withCredentials: true },
            );
            console.log('all agents res - ', res);

            if (res.data.success) {
                setAgents(res.data.agents);
            }
        } catch (error) {
            toast.error('Error fetching agents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllAgents();
    }, []);

    const handleAddAgent = async (data) => {
        try {
            setAddAgentLoading(true);
            const addAgentRes = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/agent/create`,
                {
                    ...data,
                },
                { withCredentials: true },
            );
            console.log('add agent res - ', addAgentRes);
            if (addAgentRes.data.success) {
                setShowAddAgentModal(false);
            }
        } catch (error) {
            console.log('add agent error - ', error);
            toast.error('Failed to add agent');
        } finally {
            setShowAddAgentModal(false);
            setAddAgentLoading(false);
            fetchAllAgents();
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            toast.error('No file selected');
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setUploadFileLoading(true);
            const fileUploadRes = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/file/upload`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            console.log('file upload res - ', fileUploadRes);
        } catch (error) {
            console.log('error uploading file - ', error);
            toast.error('File upload failed');
        } finally {
            setUploadFileLoading(false);
            setSelectedFile(null);
            fetchAllAgents();
        }
    };

    const handleViewLeads = async (agentId, agentName) => {
        try {
            setLeadsLoading(true);
            setSelectedAgentLeads([]);
            setShowLeadsModal(true);
            setSelectedAgentName(agentName);

            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/agent/leads/${agentId}`,
                { withCredentials: true },
            );

            if (res.data.success) {
                setSelectedAgentLeads(res.data.leads);
            } else {
                toast.error('Failed to fetch leads');
            }
        } catch (error) {
            console.error('Lead fetch error:', error);
            toast.error('Failed to fetch leads');
        } finally {
            setLeadsLoading(false);
        }
    };

    const handleDeleteAgent = async (id) => {
        try {
            const deleteRes = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/agent/${id}`,
                { withCredentials: true },
            );
            console.log('delete agent res - ', deleteRes);
            if (deleteRes.data.success) {
                toast.success('Agent deleted successfully');
            }
        } catch (error) {
            console.log('delete agent error - ', error);
            toast.error('Failed to delete agent');
        } finally {
            fetchAllAgents();
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Agents Data
                </h1>
                <div className="flex gap-3 text-sm">
                    <button
                        onClick={() => setShowAddAgentModal(true)}
                        className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        <Plus size={18} />
                        Add Agent
                    </button>
                    {/* File uploading */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        {/* File Select */}
                        <label className="flex items-center gap-3 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow border border-gray-300 transition">
                            <input
                                type="file"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                className="hidden"
                                onChange={(e) =>
                                    setSelectedFile(e.target.files[0])
                                }
                            />
                            <Upload size={18} />
                            <span>
                                {selectedFile
                                    ? 'Change File'
                                    : 'Select CSV/XLSX'}
                            </span>
                        </label>

                        {/* File name preview */}
                        {selectedFile && (
                            <span className="text-sm text-gray-600 max-w-sm truncate">
                                Selected: <strong>{selectedFile.name}</strong>
                            </span>
                        )}

                        {/* Upload Button */}
                        {selectedFile && (
                            <button
                                onClick={handleFileUpload}
                                disabled={uploadFileLoading}
                                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition ${
                                    uploadFileLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {uploadFileLoading ? 'Uploading...' : 'Upload'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Agent List */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg shadow">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-3">Name</th>
                            <th className="text-left p-3">Email</th>
                            <th className="text-left p-3">Mobile</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map((agent) => (
                            <tr
                                key={agent.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="p-3">{agent.name}</td>
                                <td className="p-3">{agent.email}</td>
                                <td className="p-3">
                                    {agent.countryCode + ' ' + agent.mobile}
                                </td>
                                <td className="p-3 flex gap-3">
                                    <button
                                        className="text-blue-600 hover:underline cursor-pointer"
                                          onClick={() => handleViewLeads(agent._id, agent.name)}

                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        className="text-red-600 hover:underline cursor-pointer"
                                        onClick={() =>
                                            handleDeleteAgent(agent._id)
                                        }
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Agent Modal */}
            {showAddAgentModal && (
                <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <h2 className="text-xl font-semibold mb-4">
                            Add New Agent
                        </h2>
                        <form
                            onSubmit={handleSubmit(handleAddAgent)}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Name
                                </label>
                                <input
                                    {...register('name', { required: true })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Enter name"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    {...register('email', { required: true })}
                                    type="email"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Enter email"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1/3">
                                    <label className="block mb-1 text-sm font-medium">
                                        Country Code
                                    </label>
                                    <input
                                        {...register('countryCode', {
                                            required: true,
                                        })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="+91"
                                    />
                                </div>
                                <div className="w-2/3">
                                    <label className="block mb-1 text-sm font-medium">
                                        Mobile
                                    </label>
                                    <input
                                        {...register('mobile', {
                                            required: true,
                                        })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddAgentModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addAgentLoading}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${addAgentLoading ? 'cursor-not-allowed' : ''}`}
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Agent Details Modal */}
            {showLeadsModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Leads for {selectedAgentName}
                            </h2>
                            <button
                                onClick={() => setShowLeadsModal(false)}
                                className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                            >
                                Close
                            </button>
                        </div>

                        {leadsLoading ? (
                            <div className="text-center py-10 text-gray-500">
                                Loading leads...
                            </div>
                        ) : selectedAgentLeads.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                No leads found.
                            </div>
                        ) : (
                            <table className="min-w-full bg-white border rounded">
                                <thead className="bg-gray-100 text-sm">
                                    <tr>
                                        <th className="text-left p-3 border">
                                            First Name
                                        </th>
                                        <th className="text-left p-3 border">
                                            Phone
                                        </th>
                                        <th className="text-left p-3 border">
                                            Notes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedAgentLeads.map((lead, idx) => (
                                        <tr
                                            key={lead._id || idx}
                                            className="border-t hover:bg-gray-50 text-sm"
                                        >
                                            <td className="p-3 border">
                                                {lead.firstName}
                                            </td>
                                            <td className="p-3 border">
                                                {lead.phone}
                                            </td>
                                            <td className="p-3 border">
                                                {lead.notes}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
