
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Usersignup from './userSignup/signup.jsx'
import UserLogin from './userLogin/login.jsx'
import DoctorSignup from './doctorsignup/signup.jsx';
import DoctorLogin from './doctorlogin/login.jsx'
import Options from './options/options.jsx'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Usersignup />} />
          <Route path='/login' element={<UserLogin />} />
          <Route path='/doctorsignup' element={<DoctorSignup />} />
          <Route path='/doctorlogin' element={<DoctorLogin />} />
          <Route path='/options' element={<Options />} />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
