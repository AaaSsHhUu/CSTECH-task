import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../pages/AdminDashboard";
import AgentDashboard from "../pages/AgentDashboard";

function DashboardWrapper() {
    const {user} = useAuth();

    if(user.role === "admin") return <AdminDashboard />
    else if(user.role === "agent") return <AgentDashboard />
}

export default DashboardWrapper