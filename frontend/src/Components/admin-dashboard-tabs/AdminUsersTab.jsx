import React, { useState, useEffect } from 'react';
import { Search, Trash2, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminUsersTab = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/users`);
      if (!res.ok) throw new Error('Failed to load users list');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [SERVER_URL]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`User role updated to ${newRole}`);
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      } else {
        throw new Error(data.message || 'Failed to update user role');
      }
    } catch (err) {
      toast.error(err.message || 'Error updating user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const res = await fetch(`${SERVER_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('User deleted successfully');
        setUsers(users.filter(u => u._id !== userId));
      } else {
        throw new Error(data.message || 'Failed to delete user');
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/30 border border-red-900/50 rounded-2xl text-red-400 text-sm flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <span>Failed to load users: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Manage Users</h2>
          <p className="text-xs text-zinc-500 mt-1">Review registrations, toggle admin authorization, or purge accounts.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121214] border border-zinc-800 focus:border-zinc-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#141416] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 font-bold uppercase tracking-wider bg-zinc-900/30">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs text-zinc-300">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="px-6 py-4.5 font-semibold text-white">{user.name || 'No Name'}</td>
                    <td className="px-6 py-4.5 text-zinc-400">{user.email}</td>
                    <td className="px-6 py-4.5">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={user.email === 'admin@gmail.com'}
                        className="bg-[#121214] border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-zinc-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="seeker">Seeker</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={user.email === 'admin@gmail.com'}
                        className="text-zinc-500 hover:text-red-400 transition p-1.5 hover:bg-red-500/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-zinc-500 italic">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersTab;
