const PasswordForgottenForm = () => {
    return (
        <div className="my-4">
            <div className="mb-2">
                <p className="font-bold">
                    Nhập địa chỉ email của bạn bên dưới.
                </p>
                <p>Chúng tôi sẽ gửi cho bạn một email để đặt lại mật khẩu.</p>
            </div>
            <div className="flex flex-col">
                <input
                    className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="email"
                    name="email"
                    placeholder="Địa chỉ email của bạn"
                />
                <button className="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-gray-900 transition duration-300 focus:outline-none focus:shadow-outline">
                    Gửi email đặt lại mật khẩu
                </button>
            </div>
        </div>
    );
};

export default PasswordForgottenForm;
