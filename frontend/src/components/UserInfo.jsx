import { useState } from "react";

const UserInfo = ({ userInfo, updateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(userInfo.name);
    const [editedAddress, setEditedAddress] = useState(userInfo.address);

    const handleSave = () => {
        updateUser({ name: editedName, address: editedAddress });
        setIsEditing(false);
    };

    return (
        <>
            <div className="hidden sm:block flex-1 bg-white border-[2px] border-[#EFF1F3] p-6 mb-4 sm:mb-0 rounded-xl">
                <h3 className="text-lg font-medium mb-4">
                    Thông tin tài khoản
                </h3>
                <div className="sm:flex block gap-4">
                    <div className="flex-1">
                        <label>Họ và tên</label>
                        <div className="mt-2 mb-4 bg-[#EFF1F3] border-[2px] px-4 py-1 rounded-xl">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) =>
                                        setEditedName(e.target.value)
                                    }
                                    className="border-[2px] w-full px-4 py-2 rounded-xl"
                                />
                            ) : (
                                userInfo.name
                            )}
                        </div>
                        <label>Địa chỉ email</label>
                        <div className="mt-2 mb-4 bg-[#EFF1F3] border-[2px] px-4 py-1 rounded-xl">
                            {userInfo.email}
                        </div>
                        <label>Địa chỉ</label>
                        <div className="mt-2 mb-4 bg-[#EFF1F3] border-[2px] px-4 py-1 rounded-xl">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedAddress}
                                    onChange={(e) =>
                                        setEditedAddress(e.target.value)
                                    }
                                    className="border-[2px] w-full px-4 py-2 rounded-xl"
                                />
                            ) : (
                                userInfo.address
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <label>ID người dùng</label>
                        <div className="mt-2 mb-4 bg-[#EFF1F3] border-[2px] px-4 py-1 rounded-xl">
                            {userInfo._id}
                        </div>
                        <label>Role</label>
                        <div className="mt-2 mb-4 bg-[#EFF1F3] border-[2px] px-4 py-1 rounded-xl">
                            {userInfo.role}
                        </div>
                        <label>Thời gian tham gia</label>
                        <div className="mt-2 mb-4 bg-[#EFF1F3] border-[2px] px-4 py-1 rounded-xl">
                            {new Date(userInfo.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                {isEditing ? (
                    <button
                        onClick={handleSave}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl font-bold"
                    >
                        Lưu
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-xl font-bold"
                    >
                        Sửa thông tin
                    </button>
                )}
            </div>
        </>
    );
};

export default UserInfo;
