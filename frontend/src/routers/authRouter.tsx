import AdminDashboard from "../pages/admin"
import EmployeesManagement from "../pages/admin/sections/Employees"
import UsersManagement from "../pages/admin/sections/User"
import GradeSubjectManager from "../pages/admin/sections/GradeSubjectManager"
import ExamManagement from "../pages/admin/sections/ExamManager"
import CompetitionList from "../pages/admin/sections/CompetitionManager"
import  Statistical  from "../pages/admin/sections/statistical/index"
export const authRouter =[
     {
      path: '/administration',
      element: <AdminDashboard />,
      children : [
        {
          path :'',
          element : (<Statistical />)
        },
        {
            path :'employees',
            element : (<EmployeesManagement />)
        },
        {
          path : 'users',
          element : (<UsersManagement />),
        },{
          path : 'grades',
          element : (<GradeSubjectManager />)
        },{
          path : 'exams',
          element : (<ExamManagement />)
        },{
          path :'competitions',
          element : (<CompetitionList />)
        }
      ]
     }
]