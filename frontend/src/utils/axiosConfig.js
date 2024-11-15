const authConfig = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
};

export { authConfig };
