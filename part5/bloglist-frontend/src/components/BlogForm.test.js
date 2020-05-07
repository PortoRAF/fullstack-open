import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('form should call event handler with correct details', () => {
  const newBlog = {
    title: 'test blog title',
    author: 'test blog author',
    url: 'test blog url'
  }
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const form = component.container.querySelector('form')
  const titleInput = component.container.querySelector('#title')
  const authorInput = component.container.querySelector('#author')
  const urlInput = component.container.querySelector('#url')

  fireEvent.change(titleInput, { target: { value: newBlog.title } })
  fireEvent.change(authorInput, { target: { value: newBlog.author } })
  fireEvent.change(urlInput, { target: { value: newBlog.url } })

  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog).toHaveBeenCalledWith(newBlog)
})
