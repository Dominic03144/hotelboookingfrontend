import React, { useState } from "react";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useAddUserMutation,
} from "../features/admin/AdminApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface User {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  isVerified: boolean;
}

const roleOptions = ["user", "admin", "member", "owner", "driver", "customer"];

const AdminUsersPage = () => {
  const { data: users, isLoading, isError } = useGetAllUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [addUser, { isLoading: isAddingUser }] = useAddUserMutation();

  const navigate = useNavigate();

  const [showAddForm, setShowAddForm] = useState(false);

  const [newUser, setNewUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    contactPhone: "",
    role: "user",
    password: "",
  });

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await updateUserRole({ userId, role: newRole }).unwrap();
      toast.success("✅ User role updated");
    } catch {
      toast.error("❌ Failed to update user role");
    }
  };

  const handleDeleteConfirm = async (userId: number) => {
    toast.dismiss();
    toast.info("Deleting user...", { autoClose: 1000 });

    try {
      await deleteUser(userId).unwrap();
      toast.success("✅ User deleted successfully");
    } catch {
      toast.error("❌ Failed to delete user");
    }
  };

  const handleDelete = (userId: number) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col">
          <p className="font-medium mb-2">⚠️ Confirm delete user?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                handleDeleteConfirm(userId);
                closeToast();
              }}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Yes, Delete
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addUser(newUser).unwrap();
      toast.success("✅ User added successfully");
      setNewUser({
        firstname: "",
        lastname: "",
        email: "",
        address: "",
        contactPhone: "",
        role: "user",
        password: "",
      });
      setShowAddForm(false);
    } catch (error: any) {
      const msg = error?.data?.message || error?.error || "❌ Failed to add user";
      toast.error(msg);
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading users...</p>;
  if (isError)
    return (
      <p className="text-red-500 text-center mt-10">Failed to load users.</p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-8 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Add New User
        </button>
      )}

      {showAddForm && (
        <form
          onSubmit={handleAddUser}
          className="mb-8 p-6 bg-gray-50 rounded shadow max-w-md"
        >
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>

          <input
            type="text"
            placeholder="First Name"
            value={newUser.firstname}
            onChange={(e) =>
              setNewUser({ ...newUser, firstname: e.target.value })
            }
            required
            className="border p-2 rounded w-full mb-3"
            disabled={isAddingUser}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newUser.lastname}
            onChange={(e) =>
              setNewUser({ ...newUser, lastname: e.target.value })
            }
            required
            className="border p-2 rounded w-full mb-3"
            disabled={isAddingUser}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
            className="border p-2 rounded w-full mb-3"
            disabled={isAddingUser}
          />
          <input
            type="text"
            placeholder="Contact Phone"
            value={newUser.contactPhone}
            onChange={(e) =>
              setNewUser({ ...newUser, contactPhone: e.target.value })
            }
            required
            className="border p-2 rounded w-full mb-3"
            disabled={isAddingUser}
          />
          <input
            type="text"
            placeholder="Address"
            value={newUser.address}
            onChange={(e) =>
              setNewUser({ ...newUser, address: e.target.value })
            }
            required
            className="border p-2 rounded w-full mb-3"
            disabled={isAddingUser}
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
            className="border p-2 rounded w-full mb-3"
            disabled={isAddingUser}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border p-2 rounded w-full mb-5"
            disabled={isAddingUser}
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isAddingUser}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isAddingUser ? "Adding..." : "Add User"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border border-gray-300 text-left">User ID</th>
              <th className="py-3 px-4 border border-gray-300 text-left">Full Name</th>
              <th className="py-3 px-4 border border-gray-300 text-left">Email</th>
              <th className="py-3 px-4 border border-gray-300 text-left">Role</th>
              <th className="py-3 px-4 border border-gray-300 text-left">Verified</th>
              <th className="py-3 px-4 border border-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user: User) => (
                <tr
                  key={user.userId}
                  className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/admin/users/${user.userId}`)}
                >
                  <td className="py-2 px-4">{user.userId}</td>
                  <td className="py-2 px-4">
                    {user.firstname} {user.lastname}
                  </td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">
                    <select
                      value={user.role}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleRoleChange(user.userId, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4 text-center">
                    {user.isVerified ? "✅" : "❌"}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(user.userId);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
