import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Sample blog title',
  author: 'Sample blog author',
  url: 'Sample blog url',
  likes: 'Sample blog likes'
}

const mockLikesHandler = jest.fn()
const mockDeleteHandler = jest.fn()

let component

beforeEach(() => {
  component = render(
    <Blog blog={blog} updateLikes={mockLikesHandler} deleteBlog={mockDeleteHandler} />
  )
})

test('should render only blog\'s title and author by default', () => {
  expect(component.container).toHaveTextContent('Sample blog title')
  expect(component.container).toHaveTextContent('Sample blog author')
  expect(component.container.querySelector('.blogDetails')).toHaveStyle('display: none')
})

test('should display blog\'s url and likes when button is clicked', () => {
  const button = component.getByText('view')
  fireEvent.click(button)

  const div = component.container.querySelector('.blogDetails')
  expect(div).not.toHaveStyle('display: none')
})

test('should call handler in props twice if button is clicked twice', () => {
  const viewBtn = component.getByText('view')
  fireEvent.click(viewBtn)

  const likesBtn = component.getByText('like')
  fireEvent.click(likesBtn)
  fireEvent.click(likesBtn)

  expect(mockLikesHandler.mock.calls).toHaveLength(2)
})
