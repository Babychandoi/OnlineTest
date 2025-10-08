import Dashboard from "../pages/Dashboard";
import LoginForm from "../pages/login";
import Signin from "../pages/login/section/signin";
import Signup from "../pages/login/section/signup";
import Profile from "../pages/profile/index"
import Subjects from "../pages/subjects/index"
import History from "../pages/history/index"
import CompetitionList from "../pages/competition/section/CompetitionList";
import ExamList from '../pages/subjects/section/exam/ExamList';
import CompetitionExam from "../pages/competition/section/CompetitionExam";
export const indexRouter: any = {
    path: '/',
    element: (<Dashboard />),
    children: [
        {
            path: 'ot',
            element: (<LoginForm />),
            children: [
                {
                    path: '',
                    element: (<Signin />)
                },
                {
                    path: 'signup',
                    element: (<Signup />)
                }
            ]
        },
        {
            path : 'profile',
            element : (<Profile />)
        },
        {
            path : 'subjects',
            element : (<Subjects />)
        },
        {
            path : 'history',
            element : (<History />)
        },{
            path :'quiz-test',
            element : (<CompetitionList />)
        },{
            path : "exams",
            element: (<ExamList />)
        },{
            path :'competition',
            element : (<CompetitionExam />)
        }
    ]
}