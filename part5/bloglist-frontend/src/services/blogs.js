import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(baseUrl, config)
  return response.data
}

const create = async (blogData) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, blogData, config)
  return response.data
}

const update = async (blogData) => {
  const config = {
    headers: { Authorization: token }
  }
  const data = {
    likes: blogData.likes + 1
  }
  const response = await axios.put(`${baseUrl}/${blogData.id}`, data, config)
  return response.data
}

const remove = async (blogData) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${blogData.id}`, config)
  return response.data
}

export default {
  setToken,
  getAll,
  create,
  update,
  remove
}
