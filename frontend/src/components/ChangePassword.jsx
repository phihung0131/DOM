import { useState } from "react";
import { toast } from "react-toastify";

const ChangePassword = ({ userInfo }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await fetch(
        "https://domstore.azurewebsites.net/api/v1/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Đổi mật khẩu thành công!");
      } else {
        toast.error(data.message || "Đã xảy ra lỗi không xác định.");
      }
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <>
      <div className="hidden sm:flex flex-1 flex-col bg-white border-[2px] border-[#EFF1F3] p-6 rounded-xl">
        <h3 className="text-lg font-medium mb-4">Đổi mật khẩu</h3>
        <form
          onSubmit={handleSubmit}
          className="hidden sm:flex flex-1 flex-col bg-white"
        >
          <label>Mật khẩu cũ</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu cũ"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-2 mb-4 border-[2px] border-[#EFF1F3] py-1 px-4 rounded-xl"
          />

          <label>Mật khẩu mới</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-2 mb-4 border-[2px] border-[#EFF1F3] py-1 px-4 rounded-xl"
          />

          <label>Xác nhận mật khẩu mới</label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 mb-4 border-[2px] border-[#EFF1F3] py-1 px-4 rounded-xl"
          />

          <button
            className="bg-[#0688B4] hover:shadow hover:shadow-[#0688B4] rounded-xl text-white font-bold mt-3 py-2"
            type="submit"
          >
            Thay đổi mật khẩu
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
