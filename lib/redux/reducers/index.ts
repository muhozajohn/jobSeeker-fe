import { combineReducers } from "redux";
import authReducer from "../slices/auth/auth.slice";
import usersReducer from "../slices/auth/user.Slice";
import recruitersReducer from "../slices/recruiter/recruiterSlice";
import jobsReducer from "../slices/jobs/jobsSlice";
import jobCategoriesReducer from "../slices/JobCategories/JobCategoriesSlice";
import applicationsReducer from "../slices/applications/applicationSlice";
import workAssignmentsReducer from "../slices/assignments/assignmentSlice";
import workerReducer from "../slices/worker/workerSlice";

const rootReducer = combineReducers({

    auth: authReducer,
    users: usersReducer,
    recruiters: recruitersReducer,
    jobs: jobsReducer,
    jobCategories: jobCategoriesReducer,
    applications: applicationsReducer,
    workAssignments: workAssignmentsReducer,
    worker: workerReducer,

});


export default rootReducer;
