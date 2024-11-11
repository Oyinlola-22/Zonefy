import { createSlice } from "@reduxjs/toolkit";
import { clearErrors, setError } from "./errorSlice";
import axiosWithAuth, { axios, axiosAuth } from "./utils";

const zonefySlice = createSlice({
  name: "zonefy",
  initialState: {
    auth: null,
    isLoading: false,
    userData: null,
    refreshToken: null,
    houseData: null,
    notifyMessage: { isSuccess: false, message: "", description: "" },
    socketIOmessages: [],
  },
  reducers: {
    setSocketIOmessages: (state, actions) => {
      state.socketIOmessages = [...state.socketIOmessages, actions.payload];
    },
    setClearSocketIOmessages: (state, actions) => {
      state.socketIOmessages = [];
    },
    setAuth: (state, actions) => {
      state.auth = actions.payload;
    },
    setRefreshToken: (state, actions) => {
      state.refreshToken = actions.payload;
    },
    setLoading: (state, actions) => {
      state.isLoading = actions.payload;
    },
    setUserData: (state, actions) => {
      state.userData = actions.payload;
    },
    setNotifyMessage: (state, actions) => {
      state.notifyMessage = actions.payload;
    },
    setHouseData: (state, actions) => {
      state.notifyMessage = actions.payload;
    },
    setLogout: (state, actions) => {
      state.auth = null;
      state.isLoading = false;
      state.userData = null;
      state.refreshToken = null;
      state.houseData = null;
      state.notifyMessage = null;
      localStorage.removeItem("accesstoken");
    },
  },
});

const BASE_PATH = "/User";
const HOUSE_PATH = "/HouseProperty";

export const SignIn = (data) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const path = BASE_PATH + "/Login";
    const response = await axios.post(path, data);
    // console.log(data);
    if (response) {
      const data = response.data;
      console.log("login response: ", data);
      if (data.code === 200) {
        localStorage.setItem("accesstoken", data?.extrainfo?.accesstoken);
        dispatch(setUserData(data.data));
        dispatch(setAuth(data.extrainfo));
        dispatch(setRefreshToken(data?.extrainfo?.refreshtoken));

        dispatch(
          setNotifyMessage({
            isSuccess: true,
            message: data.message,
          })
        );
      }
    }
  } catch (error) {
    // console.log("login error response: ", error);
    dispatch(setError(error?.response?.data?.message));
    dispatch(
      setNotifyMessage({
        isSuccess: false,
        message: error?.response?.data?.message,
      })
    );
  }
  dispatch(setLoading(false));
};

export const SignUp = (data) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const path = BASE_PATH + "/Register";
    const response = await axios.post(path, data);
    if (response) {
      const data = response.data;
      console.log("SignUp response: ", data);
      if (data.code === 201) {
        dispatch(
          setNotifyMessage({
            isSuccess: true,
            message: "Sign Up Successful",
            description: "Please check your email for the confirmation code.",
          })
        );
      }
    }
  } catch (error) {
    // console.log("SignUp error response: ", error);
    dispatch(setError(error?.message));
  }

  dispatch(setLoading(false));
};

export const GetImageSource = () => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const img = getState()?.kitchen?.userData?.KitchenImage;
    const path = `Uploads/${img}`;
    const headers = {
      Origin: window.location.origin, // Use the current page's origin
    };
    // console.log("payload: ", img, ", ", headers);
    const response = await axios.get(path, {
      withCredentials: true,
      responseType: "blob",
      headers: headers,
    });
    if (response) {
      // Convert the blob to a temporary URL
      //console.log("GetImageSource response: ", response.data);
      const tempUrl = URL.createObjectURL(response.data);
      // console.log("tempImgUrl: ", tempUrl);
      // dispatch(setImageSrc(tempUrl));
    }
  } catch (error) {
    //console.log("GetImageSource error response: ", error);
    dispatch(setError(error?.message));
  }

  dispatch(setLoading(false));
};

export const ResendVerifyEmail = (email) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const path = BASE_PATH + `/ResendVerifyEmail?email=${email}`;
    const response = await axios.get(path);
    if (response) {
      const data = response.data;
      console.log("ResendVerifyEmail response: ", data);
      if (data.code === 200) {
        dispatch(
          setNotifyMessage({
            isSuccess: true,
            message: "Email Resent",
            description:
              "Email verification link has been resent. Check your email.",
          })
        );
      } else if (data.message === "Your email is now verified") {
        dispatch(
          setNotifyMessage({
            isSuccess: true,
            message: "Email Verified",
            description: "This email has been verified",
          })
        );
      }
    }
  } catch (error) {
    // console.log("ResendVerifyEmail error response: ", error);
    dispatch(
      setNotifyMessage({
        isSuccess: false,
        message: "Resend Email Failed",
        description: "An error occurred while resending the email.",
      })
    );
    dispatch(setError(error?.message));
  }

  dispatch(setLoading(false));
};

export const VerifyEmail = (payload) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const path = BASE_PATH + "/VerifyEmail";
    const response = await axios.put(path, payload);
    if (response) {
      const data = response.data;
      // console.log("VerifyEmail response: ", data);
      if (data.code === 200) {
        dispatch(
          setNotifyMessage({
            isSuccess: true,
            message: "Email Verified Success",
            description:
              "Welcome to QuicKee, become more efficient, Please signin",
          })
        );
      }
    }
  } catch (error) {
    // console.log("VerifyEmail error response: ", error);
    const err = error?.response?.data;
    dispatch(
      setNotifyMessage({
        isSuccess: false,
        message: err?.message,
        description: err?.message,
      })
    );
    dispatch(setError(error?.message));
  }

  dispatch(setLoading(false));
};

export const UploadImage = (payload) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const path = BASE_PATH + `/Upload?KitchenId=${payload.get("KitchenId")}`;
    const response = await axios.post(path, payload);
    if (response) {
      const data = response.data;
      // console.log("UploadImage response: ", data);
      if (data.code === 200) {
        const user = getState()?.kitchen?.userData;
        dispatch(
          setUserData({ ...user, KitchenImage: data?.extrainfo?.ImageUrl })
        );
        // dispatch(setImage(data?.extrainfo?.ImageUrl));
        dispatch(
          setNotifyMessage({
            isSuccess: true,
            message: "Image uploaded",
            description: "Image has been uploaded",
          })
        );
      }
    }
  } catch (error) {
    // console.log("UploadImage error response: ", error);
    dispatch(
      setNotifyMessage({
        isSuccess: false,
        message: "Upload error",
        description: "Image could not be uploaded",
      })
    );
    dispatch(setError(error?.message));
  }

  dispatch(setLoading(false));
};

export const ResetPasswords = (data) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const path = BASE_PATH + "/ResetPassword";
    const response = await axios.put(path, data);
    if (response) {
      const data = response.data;
      // console.log("ResetPasswords response: ", data);
      if (data.code === 200) {
        dispatch(
          setNotifyMessage({
            isSuccess: true,
            message: "Password Updated",
            description: "Your password has been changed successfully.",
          })
        );
      }
    }
  } catch (error) {
    // console.log("ResetPasswords error response: ", error);
    const err = error?.response?.data;
    dispatch(
      setNotifyMessage({
        isSuccess: false,
        message: err?.message,
        description: err?.message,
      })
    );
    dispatch(setError(error?.message));
  }

  dispatch(setLoading(false));
};

export const Forgotpassword = (data) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const path = BASE_PATH + `/ForgotPassword?email=${data}`;
    const response = await axios.get(path, data);
    if (response) {
      const data = response.data;
      console.log("Forgotpassword response: ", data.message);
      if (data.code === 204) {
        dispatch(
          setNotifyMessage({
            isSuccess: true,
            message: data.message,
          })
        );
      }
    }
  } catch (error) {
    console.log("Forgotpassword error response: ", error);
    const err = error?.response?.data?.message;
    dispatch(
      setNotifyMessage({
        isSuccess: false,
        message: err?.response?.data?.message,
      })
    );
    dispatch(setError(err?.response?.data?.message));
  }

  dispatch(setLoading(false));
};

export const GetNewToken = () => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const refresh = getState().kitchen.refreshToken;
    const user = getState().kitchen.userData;
    const path =
      BASE_PATH +
      `/GetNewAccessToken?Email=${user?.KitchenEmail}&&UserId=${user?.Id}`;
    const response = await axiosAuth(refresh).get(path);
    if (response) {
      const data = response.data;
      localStorage.setItem("accesstoken", data?.body?.AccessToken);
      dispatch(
        setAuth({ accesstoken: data?.body?.AccessToken, refreshtoken: refresh })
      );
      // console.log("GetNewToken response: ", data);
    }
  } catch (error) {
    // console.log("GetNewToken error response: ", error);
    dispatch(setError(error?.message));
  }

  dispatch(setLoading(false));
};

export const PlaceHouse = (data) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const path = HOUSE_PATH + "/Create";
    const response = await axios.post(path, data);
    if (response) {
      const data = response.data;
      console.log("Placement response: ", data);
      if (data.code === 200) {
        dispatch(setHouseData(data.data));
        dispatch(
          setNotifyMessage({
            isSuccess: true,
            message: "Property Placement Successful",
          })
        );
      }
    }
  } catch (error) {
    console.log("SignUp error response: ", error);
    dispatch(setError(error?.message));
  }

  dispatch(setLoading(false));
};

export const EditHouseProperty = (payload) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const path = HOUSE_PATH + "/Update";
    const response = await axios.put(path, payload);
    if (response) {
      const data = response.data;
      // console.log("VerifyEmail response: ", data);
      if (data.code === 200) {
        dispatch(
          setNotifyMessage({
            isSuccess: true,
            message: "Property Updated Successfully",
          })
        );
      }
    }
  } catch (error) {
    // console.log("VerifyEmail error response: ", error);
    const err = error?.response?.data;
    dispatch(
      setNotifyMessage({
        isSuccess: false,
        message: err?.message,
        description: err?.message,
      })
    );
    dispatch(setError(error?.message));
  }

  dispatch(setLoading(false));
};

export const GetAllProperty = (data) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const path = HOUSE_PATH + `/GetAll?pageNumber=${data}`;
    const response = await axios.get(path, data);
    if (response) {
      const data = response.data;
      console.log("GetAll response: ", data.message);
      if (data.code === 204) {
        dispatch(
          setNotifyMessage({
            isSuccess: true,
            message: data.message,
          })
        );
      }
    }
  } catch (error) {
    console.log("GetAll error response: ", error);
    const err = error?.response?.data?.message;
    dispatch(
      setNotifyMessage({
        isSuccess: false,
        message: err?.response?.data?.message,
      })
    );
    dispatch(setError(err?.response?.data?.message));
  }

  dispatch(setLoading(false));
};

export const DeleteProperty = (data) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const path = HOUSE_PATH + `/Delete?id=${data}`;
    const response = await axiosWithAuth.delete(path);
    if (response) {
      const data = response.data;
      // console.log("Delete response: ", data);
      if (data.code === 200) {
        // dispatch(GetKitchenMenus(kitchenId));
        dispatch(
          setNotifyMessage({
            isSuccess: true,
            message: "Delete success",
            description: data?.body,
          })
        );
      }
    }
  } catch (error) {
    console.log("Delete error response: ", error);
    dispatch(setError(error?.message));
  }

  dispatch(setLoading(false));
};

export const {
  setLogout,
  setAuth,
  setLoading,
  setUserData,
  setHouseData,
  setNotifyMessage,
  setRefreshToken,
  setSocketIOmessages,
  setClearSocketIOmessages,
} = zonefySlice.actions;
export default zonefySlice.reducer;
