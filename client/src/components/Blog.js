import { useParams } from 'react-router-dom'
import { Button, ListGroup, Form } from 'react-bootstrap'
import { useState } from 'react'


const Blog = ({ blogs, like, remove, add, user }) => {
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  const [comment, setComment] = useState('')
 
 if (!blog) return null
  
  const handleSubmit = async (event) => {
    add(event, id, comment)
    setComment('')
  }

  const own = user.username === blog.user.username
  let url = blog.url
  if (url.substring(0, 4) !== 'http') url = 'https://' + blog.url

  return (
    <div className='blog'>
      <div style={{marginBottom: 10}}>
        <h1>{blog.title}</h1>
        <h3>by {blog.author}</h3>
      </div>

      <a href={`${url}`} target='_blank' rel='noreferrer'>
        {url}
      </a> 
      <br />

      <div style={{marginBottom: 10, marginTop: 10}}>
        <b>{blog.likes} likes</b> <Button variant='outline-primary' size='sm' onClick={() => like(blog.id)}>like</Button>
      </div>

      <p>
        Added by {blog.user.name}
      </p>

      {own && <Button variant='outline-danger' size='sm' onClick={() => remove(blog.id)}>
        remove
      </Button>
      }

      <div style={{marginTop: 10}}>
        <h3>Comments:</h3>
        <ListGroup variant='flush'>
          {blog.comments.map((comment, i) => <ListGroup.Item key={i}>{comment}</ListGroup.Item>)}
        </ListGroup>
        
        <Form onSubmit={handleSubmit} style={{marginTop: 10}}>
          <Form.Group>
            <Form.Control as='textarea' rows={3} placeholder='Write a comment...'
              value={comment} onChange={({ target }) => setComment(target.value)}>
            </Form.Control>
            <Button id='login-button' type='submit' style={{ marginTop: 5 }}>
              add comment
            </Button>
          </Form.Group>
        </Form>

      </div>
    </div>
  )
}

export default Blog
