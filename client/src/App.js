import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useMatch, useNavigate} from 'react-router-dom'
import { Button } from 'react-bootstrap'

import LoginForm from './components/LoginForm'
import Menu from './components/Menu'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import User from './components/User'
import Blog from './components/Blog'

import loginService from './services/login'
import userService from './services/user'
import usersService from './services/users'
import blogService from './services/blogs'


const App = () => {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)


  useEffect(() => {
    const userFromStorage = userService.getUser()
    if (userFromStorage) {
      setUser(userFromStorage)
    }
  }, [])


  useEffect(() => {
    usersService.getAll().then(users =>
      setUsers(users)
      )
  }, [])


  const byLikes = (b1, b2) => b2.likes>b1.likes ? 1 : -1
  useEffect(() => {
    blogService.getAll().then(blogs => 
      setBlogs(blogs.sort(byLikes)))
  }, [])


  const login = async (username, password) => {
    loginService.login({
      username, password,
    }).then(user => {
      setUser(user)
      userService.setUser(user)
      notify(`${user.name} logged in!`)
    }).catch(() => {
      notify('wrong username/password', 'danger')
    })
  }


  const logout = () => {
    setUser(null)
    userService.clearUser()
    notify('Goodbye!')
  }


  const notify = (message, type='success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  
  const match = useMatch('/users/:id')
  const chosenUser = match
    ? users.find(user => user.id === match.params.id)
    : null

  
  const blogFormRef = useRef()

  const createBlog = async (blog) => {
    blogService.create(blog).then(createdBlog => {
      notify(`A new blog '${createdBlog.title}' by ${createdBlog.author} added.`)
      setBlogs(blogs.concat(createdBlog))
      blogFormRef.current.toggleVisibility()
    }).catch(error => {
      notify('Creating a blog failed: ' + error.response.data.error, 'alert')
    })
  }


  const likeBlog = (id) => {
    const toLike = blogs.find(b => b.id === id)
    const liked = {
      ...toLike,
      likes: (toLike.likes||0) + 1,
      user: toLike.user.id
    }

    blogService.update(liked.id, liked).then(updatedBlog => {
      notify(`You liked '${updatedBlog.title}' by ${updatedBlog.author}.`)
      const updatedBlogs = blogs
        .map(b => b.id===id ? updatedBlog : b)
        .sort(byLikes)
      setBlogs(updatedBlogs)
    })
  }


  const navigate = useNavigate()
  const removeBlog = (id) => {
    const toRemove = blogs.find(b => b.id === id)
    const ok = window.confirm(`Remove '${toRemove.title}' by ${toRemove.author}?`)
    if (!ok) {
      return
    }

    blogService.remove(id).then(() => {
      const updatedBlogs = blogs
        .filter(b => b.id!==id)
        .sort(byLikes)
      setBlogs(updatedBlogs)
    })
    navigate('/')
    notify('Blog deleted.')
  }

  
  const addComment = async (event, id, comment) => {
    event.preventDefault()
    await blogService.comment(id, comment)
    const toComment = blogs.find(b => b.id === id)
    const updatedBlog = { ...toComment, comments: toComment.comments.concat(comment)}
    const updatedBlogs = blogs.map(b => b.id === id ? updatedBlog : b)
    setBlogs(updatedBlogs)
  }


  if (user === null) {
    return <div className='container'>
      <Notification notification={notification} />
      <LoginForm onLogin={login} />
    </div>
  }

  return (
    <div className='container'>
      <h2>Blogs</h2>
      <Notification notification={notification} />
      <div style={{ marginBottom: 15 }}>
        {user.name} logged in
        <Button style={{ marginLeft: 10 }}
                variant='outline-secondary'
                size='sm' onClick={logout}
                >
          logout
        </Button>
      </div>
      <Menu />
      <Routes>
        <Route path='/' element={<BlogList blogs={blogs} blogFromRef={blogFormRef} create={createBlog} />} />
        <Route path='/users' element={<UserList users={users} />} />
        <Route path='/users/:id' element={<User user={chosenUser} />} />
        <Route path='/blogs/:id' element={<Blog user={user} blogs={blogs} like={likeBlog} remove={removeBlog} add={addComment}/>} />
      </Routes>
    </div>
  )
}

export default App
