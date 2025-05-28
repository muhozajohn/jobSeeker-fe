import { combineReducers } from "redux";
import authReducer from "../slices/auth/auth.slice";
import recruitersReducer from "../slices/recruiter/recruiterSlice";
import jobsReducer from "../slices/jobs/jobsSlice";
// import usersReducer from "../slices/users/user.slice";

const rootReducer = combineReducers({

    auth: authReducer,
    // users: usersReducer,
    recruiters: recruitersReducer,
    jobs: jobsReducer

});


export default rootReducer;
