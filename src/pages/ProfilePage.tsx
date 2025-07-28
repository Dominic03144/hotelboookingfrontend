import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const {
    token,
    profileImageUrl,
    updateProfileImageUrl,
  } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState(profileImageUrl || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setFirstName(payload.firstName || "");
      setLastName(payload.lastName || "");
      setEmail(payload.email || "");
      setContactPhone(payload.contactPhone || "");
      setAddress(payload.address || "");
      setImageUrl(payload.profileImageUrl || "");
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, [token]);

  const handleSave = async () => {
    if (!token) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          contactPhone,
          address,
          profileImageUrl: imageUrl,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update profile");
      }

      toast.success("✅ Profile updated successfully!");

      updateProfileImageUrl(imageUrl);

      localStorage.setItem("profileImageUrl", imageUrl);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("contactPhone", contactPhone);
      localStorage.setItem("address", address);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* ✅ Toast container with better settings */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
      />

      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="First Name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Last Name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            disabled
            className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
          <p className="text-sm text-gray-500 mt-1">
            To change your email, please use the Settings page.
          </p>
        </div>

        <div>
          <label className="block mb-1 font-medium">Contact Phone</label>
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Contact Phone"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Address"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Profile Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Profile Image URL"
          />
        </div>

        {imageUrl && (
          <div>
            <img
              src={imageUrl}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
