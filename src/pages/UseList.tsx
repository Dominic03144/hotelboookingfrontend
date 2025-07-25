// src/pages/UsersList.tsx

import { useGetAllUsersQuery } from "../features/admin/AdminApi";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const { data: users, isLoading, isError } = useGetAllUsersQuery();
  const navigate = useNavigate();

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Failed to load users.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="min-w-full bg-white shadow border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4">User ID</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr
              key={user.userId}
              className="border-t cursor-pointer hover:bg-gray-200"
              onClick={() => navigate(`/admin/users/${user.userId}`)}
            >
              <td className="py-2 px-4">{user.userId}</td>
              <td className="py-2 px-4">
                {user.firstname} {user.lastname}
              </td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
