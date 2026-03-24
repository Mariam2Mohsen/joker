import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import UsersPage from './pages/UsersPage/UsersPage';
import AddUser from './pages/UsersPage/AddUser';
import Login from './pages/Login';
import CategoryList from './pages/CategoryPage/CategoryList';
import AddCategory from './pages/CategoryPage/AddCategory';
import SubCategoryList from './pages/SubCategoryPage/SubCategoryList';
import AddSubCategory from './pages/SubCategoryPage/AddSubCategory';
import ServiceList from './pages/ServicePage/ServiceList';
import AddService from './pages/ServicePage/AddService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<Login />} />

    
        <Route path="/admin" element={<AdminLayout />}>
          
         
          <Route path="users/list" element={<UsersPage />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="/admin/users/edit/:id" element={<AddUser />} />
    
          <Route index element={<Navigate to="users/list" />} />
          <Route path="/admin/category/list" element={<CategoryList />} />
        <Route path="/admin/category/add" element={<AddCategory />} />
        <Route path="/admin/subcategory/list" element={<SubCategoryList />} />
        <Route path="/admin/subcategory/add" element={<AddSubCategory />} />
        <Route path="/admin/service/list" element={<ServiceList />} />
        <Route path="/admin/service/add" element={<AddService />} />
        <Route path="/admin/service/edit/:id" element={<AddService />} />
        
 
        </Route>

      
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
       <ToastContainer />
    </Router>
  );
}

export default App;