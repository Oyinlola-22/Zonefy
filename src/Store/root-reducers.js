import { combineReducers } from "@reduxjs/toolkit";
import zonefyReducer from "../Features/zonefySlice";
import errorReducer from "../Features/errorSlice";

const rootReducer = combineReducers({
  zonefy: zonefyReducer,
  error: errorReducer,
  // Add other reducers here if you have them
});

export default rootReducer;
