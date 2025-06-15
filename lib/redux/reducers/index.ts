import { combineReducers } from "redux";
import authReducer from "../slices/auth/auth.slice";
import usersReducer from "../slices/auth/user.Slice";
import recruitersReducer from "../slices/recruiter/recruiterSlice";
import jobsReducer from "../slices/jobs/jobsSlice";
import jobCategoriesReducer from "../slices/JobCategories/JobCategoriesSlice";
import applicationsReducer from "../slices/applications/applicationSlice";

const rootReducer = combineReducers({

    auth: authReducer,
    users: usersReducer,
    recruiters: recruitersReducer,
    jobs: jobsReducer,
    jobCategories: jobCategoriesReducer,
    applications: applicationsReducer,

});


export default rootReducer;
