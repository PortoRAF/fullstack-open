const listHelper = require('../utils/list_helper')

const emptyList = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  }, {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }, {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  }, {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  }, {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  }, {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  const result = listHelper.dummy(emptyList)
  expect(result).toBe = (1)
})

describe('total likes', () => {
  test('when list has only one blog equals the likes of that', () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
  })

  test('when list has several blogs', () => {
    const result = listHelper.totalLikes(blogs)

    expect(result).toBe(36)
  })

  test('of empty array is zero', () => {
    const result = listHelper.totalLikes(emptyList)

    expect(result).toBe(0)
  })
})

describe('favorite blog', () => {
  test('of an empty list returns empty object', () => {
    const result = listHelper.favoriteBlog(emptyList)
    expect(result).toEqual({})
  })

  test('when list has only one blog equals to itself', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)

    const expectedResult = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    }

    expect(result).toEqual(expectedResult)
  })

  test('when list has several blogs', () => {
    const result = listHelper.favoriteBlog(blogs)

    const expectedResult = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }

    expect(result).toEqual(expectedResult)
  })
})

describe('most authors', () => {
  test('of an empty list returns null', () => {
    const result = listHelper.mostBlogs(emptyList)
    expect(result).toBeNull()
  })

  test('when list has only one blog equals to one', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)

    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    }

    expect(result).toEqual(expectedResult)
  })

  test('when list has several blogs sums the number of blogs with such author', () => {
    const result = listHelper.mostBlogs(blogs)

    const expectedResult = {
      author: 'Robert C. Martin',
      blogs: 3,
    }

    expect(result).toEqual(expectedResult)
  })
})

describe('most likes', () => {
  test('of an empty list returns null', () => {
    const result = listHelper.mostLikes(emptyList)
    expect(result).toBeNull()
  })

  test('when list has only one blog equals to its number of likes', () => {
    const result = listHelper.mostLikes(listWithOneBlog)

    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      likes: 5
    }

    expect(result).toEqual(expectedResult)
  })

  test('when list has several blogs sums the number of likes for each author', () => {
    const result = listHelper.mostLikes(blogs)

    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    }

    expect(result).toEqual(expectedResult)
  })
})