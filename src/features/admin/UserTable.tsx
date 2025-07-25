// src/pages/admin/UserTable.tsx
import { useGetAllUsersQuery } from "../../features/admin/AdminApi";

export default function UserTable() {
  const { data: users, isLoading, error } = useGetAllUsersQuery();

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users!</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4">#</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Phone</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <tr key={user.id} className="border-t">
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{user.firstname} {user.lastname}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4 capitalize">{user.role}</td>
              <td className="py-2 px-4">{user.contactPhone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
