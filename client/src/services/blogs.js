/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'
import userService  from './user'

const baseUrl = '/api/blogs'

const config = () => {
  return {
    headers: {
      Authorization: `bearer ${userService.getToken()}`
    },
  }
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject, config())
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`, config())
}

const comment = async (id, comment) => {
  const request = await axios.post(`${baseUrl}/${id}/comments`, { comment }, config())
  return request.data
}

export default { getAll, create, update, remove, comment }
