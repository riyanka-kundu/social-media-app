import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./pages/AuthLayout";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import MyPosts from "./pages/MyPosts";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" Component={Login} />
          <Route path="/sign-up" Component={SignUp} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/" index Component={Home} />
          <Route path="/create-post" Component={CreatePost} />
          <Route path="/my-posts" index Component={MyPosts} />
          <Route path="/profile" Component={Profile} />
          <Route path="/edit-post/:id" Component={EditPost} />
          <Route path="/edit-profile" Component={EditProfile} />

          <Route path="/post/:id" Component={Post} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
