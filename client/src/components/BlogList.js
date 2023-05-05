import { Link } from 'react-router-dom'

import Togglable from './Togglable'
import NewBlogForm from './NewBlogForm'


const BlogList = ({ blogs, blogFromRef, create }) => {

  const style = {
    padding: 10,
    margin: 5,
    borderStyle: 'solid',
    borderWidth: 1,
  }

  return (
    <div>
      <Togglable buttonLabel='new blog' ref={blogFromRef}>
        <NewBlogForm
          onCreate={create}
        />
      </Togglable>

      <div id='blogs'>
        {blogs.map(blog =>
          <div key={blog.id} style={style}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogList
