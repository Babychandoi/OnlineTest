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
import Payment from "../pages/payment/index";
import CreateExam from "../pages/subjects/section/exam/createExam";
import CheckoutPage from "../pages/payment/section/CheckOutPage";
import PaymentResultPage from '../pages/payment/section/VNPayReturnPage'
import Home from "../pages/home/index"
import Achievement from "../pages/ranking/index";
import ForgotPassword from "../pages/login/section/ForgotPassword";
import ResetPassword from "../pages/login/section/ResetPassword";
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
                },{
                    path :'forgot-password',
                    element : (<ForgotPassword />)

                }
            ]
        },
        {
            path : 'reset-password',
            element : (<ResetPassword />)
        },
        {
            path : "",
            element : (<Home />)
        },{
            path : 'achievements',
            element : (<Achievement />)
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
        },{
            path : 'payment',
            element : (<Payment />)
        },
        {
            path :'create-exam',
            element : (<CreateExam />)
        },{
            path : 'payment/checkout',
            element : (<CheckoutPage/>)
        },{
            path : 'payment/result',
            elemet : (<PaymentResultPage />)
        }
    ]
}