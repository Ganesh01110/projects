export const getRoleFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // const decodedToken = JSON.parse(atob(token.split(".")[1]));
      // console.log("Decoded token:", decodedToken);

      // return decodedToken?.role;
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        return decodedToken?.role;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
    }
    return null;
  };
  