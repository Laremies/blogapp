import { useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'


const Blog = ({ blogs, like, remove, user }) => {
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  if (!blog) return null
  const own = user.username === blog.user.username
  let url = blog.url
  if (url.substring(0, 4) !== 'http') url = 'https://' + blog.url


  return (
    <div className='blog'>
      <div style={{marginBottom: 10}}>
        <h1>{blog.title}</h1>
        <h3>by {blog.author}</h3>
      </div>
      <a href={`${url}`} target='_blank' rel='noreferrer'>{url}</a> <br />
      <div style={{marginBottom: 10, marginTop: 10}}>
        <b>{blog.likes} likes</b> <Button variant='outline-primary' size='sm' onClick={() => like(blog.id)}>like</Button>
      </div>
      <p>Added by {blog.user.name}</p>
      {own&&<Button variant='outline-danger' size='sm' onClick={() => remove(blog.id)}>remove</Button>}
    </div>
  )
}

export default Blog
