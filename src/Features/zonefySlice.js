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
    propertyData: null,
    myPropertyData: null,
    messages: [],
    interestedMessage: [],
    image: null,
    interestedRenters: null,
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
      state.houseData = actions.payload;
    },
    setPropertyData: (state, actions) => {
      state.propertyData = actions.payload;
    },
    setMyPropertyData: (state, actions) => {
      state.myPropertyData = actions.payload;
    },
    setImage: (state, actions) => {
      state.image = actions.payload;
    },
    setMessages: (state, actions) => {
      state.messages = actions.payload;
    },
    setInterestedRenters: (state, actions) => {
      state.interestedRenters = actions.payload;
    },
    setInterestedMessage: (state, actions) => {
      state.interestedMessage = actions.payload;
    },
    setLogout: (state, actions) => {
      state.auth = null;
      state.isLoading = false;
      state.userData = null;
      state.refreshToken = null;
      state.houseData = null;
      state.propertyData = null;
      state.myPropertyData = null;
      state.image = null;
      state.messages = null;
      state.notifyMessage = null;
      state.interestedRenters = null;
      state.interestedMessage = null;
      localStorage.removeItem("accessToken");
    },
  },
});

const BASE_PATH = "/User";
const HOUSE_PATH = "/HouseProperty";
const CHAT_PATH = "/ChatMessage";

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
        localStorage.setItem("accessToken", data?.extraInfo?.accessToken);
        localStorage.setItem("refreshToken", data?.extraInfo?.refreshToken);
        dispatch(setUserData(data.data));
        dispatch(setAuth(data?.extraInfo?.accessToken));
        dispatch(setRefreshToken(data?.extraInfo?.refreshToken));

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

export const UploadImage = (data, image) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const token = localStorage.getItem("accessToken");
    const path = HOUSE_PATH + `/UploadImage?propertyId=${image}`;
    const response = await axiosWithAuth.post(path, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${token}`,
      },
    });
    console.log("Meeee", response);
    if (response) {
      const data = response.data;
      console.log("UploadImage response: ", data);
      if (data.code === 200) {
        const user = getState()?.zonefy?.mypropertyData;
        dispatch(
          setPropertyData({
            ...user,
            propertyImageUrl: data?.data?.propertyImageUrl,
          })
        );
        dispatch(setImage(data?.data?.propertyImageUrl));
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
    console.log("UploadImage error response: ", error);
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

export const GetNewToken = (data) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const refresh = getState().zonefy.data.refreshToken;
    // const user = getState().kitchen.userData;
    const path = BASE_PATH + "/RenewTokens";
    const response = await axiosAuth(refresh).post(path, data);
    if (response) {
      const data = response.data;
      console.log("GetNewToken response: ", data);
      localStorage.setItem("accessToken", data?.data?.accessToken);
      dispatch(
        setAuth({ accesstoken: data?.data?.accessToken, refreshtoken: refresh })
      );
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
    const response = await axiosWithAuth.post(path, data);
    if (response) {
      const data = response.data;
      console.log("Placement response: ", data);
      if (data.code === 201) {
        dispatch(setHouseData(data));
        localStorage.setItem("propertyId", data?.data.id);
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

export const EditHouseProperty = (data) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const payload = {
      email: getState().zonefy.userData.email,
      pageNumber: 1,
    };
    const path = HOUSE_PATH + "/Update";
    const response = await axiosWithAuth.put(path, data);
    if (response) {
      const data = response.data;
      console.log("VerifyEmail re  sponse: ", data);
      if (data.code === 200) {
        dispatch(GetPersonalProperty(payload));
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

export const GetAllProperty = (pageNumber) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const path = HOUSE_PATH + `/GetAll?pageNumber=${pageNumber}`;
    const response = await axios.get(path);
    if (response) {
      const data = response.data;
      console.log("GetAll responsedd: ", data.data);
      if (data.code === 200) {
        dispatch(setPropertyData(data.data));
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

export const GetPersonalProperty = (data) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const path =
      HOUSE_PATH +
      `/GetAllByEmail?email=${data.email}&&pageNumber=${data.pageNumber}`;
    const response = await axiosWithAuth.get(path);
    if (response) {
      const data = response.data;
      console.log("GetAll responsed: ", data.data);
      if (data.code === 200) {
        dispatch(setMyPropertyData(data.data));
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

export const DeleteProperty = (data) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    const payload = {
      email: getState().zonefy.userData.email,
      pageNumber: 1,
    };
    const path = HOUSE_PATH + `/Delete?id=${data}`;
    const response = await axiosWithAuth.delete(path);
    if (response) {
      const data = response.data;
      console.log("Delete response: ", data);
      if (data.code === 200) {
        dispatch(GetPersonalProperty(payload));
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

export const SendMessage = (data) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(clearErrors());

  try {
    console.log(data);
    const path = CHAT_PATH + "/Send";
    const response = await axiosWithAuth.post(path, data);
    if (response) {
      const responseData = response.data;
      // console.log("Chat response: ", responseData);

      if (responseData.code === 201) {
        // Use the original 'data' parameter to retrieve sender and receiver info
        dispatch(
          GetAllMessagesByIdentifier({
            sender: encodeURIComponent(data.senderEmail),
            receiver: encodeURIComponent(data.receiverEmail),
            pageNumber: 1,
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

export const GetAllMessagesByIdentifier =
  ({ sender, receiver, propertyId, pageNumber }) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());

    try {
      const path =
        CHAT_PATH +
        `/GetByUserIdsPropId?sender=${sender}&receiver=${receiver}&propertyId=${propertyId}&pageNumber=${pageNumber}`;
      const response = await axiosWithAuth.get(path);
      if (response) {
        const data = response.data;
        // console.log("GetAllChatByIdentifier: ", data);
        if (data.code === 200) {
          console.log("Fetched messages: ", data.data);
          dispatch(setMessages(data.data));
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

export const GetPropertyStatistics =
  ({ id, pageNumber }) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());

    try {
      const path =
        HOUSE_PATH +
        `/GetPropertyStatisticsById?id=${id}&pageNumber=${pageNumber}`;
      const response = await axiosWithAuth.get(path);
      if (response) {
        const data = response.data;
        console.log("GetAllChatByIdentifier: ", data);
        if (data.code === 200) {
          console.log("Fetched messages: ", data.data);
          dispatch(setInterestedRenters(data.data));
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

export const GetPropertyStatisticsByEmail =
  ({ email, pageNumber }) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearErrors());

    try {
      const path =
        HOUSE_PATH +
        `/GetAllUserPropertyStatisticsByEmail?email=${email}&pageNumber=${pageNumber}`;
      const response = await axiosWithAuth.get(path);
      if (response) {
        const data = response.data;
        console.log("GetAllChatByIdentifier: ", data);
        if (data.code === 200) {
          dispatch(setInterestedMessage(data.data));
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

export const {
  setLogout,
  setAuth,
  setLoading,
  setUserData,
  setHouseData,
  setPropertyData,
  setMyPropertyData,
  setImage,
  setMessages,
  setInterestedRenters,
  setInterestedMessage,
  setNotifyMessage,
  setRefreshToken,
  setSocketIOmessages,
  setClearSocketIOmessages,
} = zonefySlice.actions;
export default zonefySlice.reducer;
