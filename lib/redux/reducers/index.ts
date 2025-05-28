import { combineReducers } from "redux";
import authReducer from "../slices/auth/auth.slice";
// import usersReducer from "../slices/users/user.slice";

const rootReducer = combineReducers({

    auth: authReducer,
    // users: usersReducer,

});


export default rootReducer;
