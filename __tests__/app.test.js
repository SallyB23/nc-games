const request = require("supertest");
const app = require("../app")
const db = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")
const connection = require("../db/connection");
const { parse } = require("dotenv");

beforeEach(() => seed(db));
afterAll(() => connection.end());

describe('GET /api/categories', () => {
    it('returns 200 status with array of all category objects containing properties slug and description', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({ body }) => {
            const { categories } = body
            expect(categories).toBeInstanceOf(Array)
            expect(categories).toHaveLength(4)
            categories.forEach((category) => {
                expect(category).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                )
            })
        })
    });
});

describe('GET /api/reviews', () => {
    it('return 200 status with an array of all reviews objects', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body
            expect(reviews).toBeInstanceOf(Array)
            expect(reviews).toHaveLength(13)
            reviews.forEach(review => {
                expect(review).toEqual({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id:expect.any(Number),
                    category: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    review_body:expect.any(String),
                    designer: expect.any(String),
                    comment_count: expect.any(Number)
                })
            })
        })
    });
    it('returns 200 and returns array of all review objects sorted by descending date order', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body
            expect(reviews).toBeSortedBy('created_at', {descending: true})
        })
    });
    it('returns 200 and returns array of review objects sorted by descending votes', () => {
        return request(app)
        .get('/api/reviews?sort_by=votes')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body
            expect(reviews).toBeSortedBy('votes', {descending: true})
        })
    });
    it('returns 200 and returns array of review objects sorted by descending title', () => {
        return request(app)
        .get('/api/reviews?sort_by=title')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body
            expect(reviews).toBeSortedBy('title', {descending: true, coerce: true})
        })
    });
    it('returns 200 with all reviews in descending created_at order when passed invalid query type', () => {
        return request(app)
        .get('/api/reviews?sort=title')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body
            expect(reviews).toHaveLength(13)
            expect(reviews).toBeSortedBy('created_at', {descending: true})
        })
    });
    it('returns 200 with all reviews in descending created_at order when passed invalid sort_by option', () => {
        return request(app)
        .get('/api/reviews?sort=title')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body
            expect(reviews).toHaveLength(13)
            expect(reviews).toBeSortedBy('created_at', {descending: true})
        })
    });
    it('returns 200 with array object in ascending order when passed as query', () => {
        return request(app)
        .get('/api/reviews?order=asc')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body
            expect(reviews).toBeSortedBy('created_at')
        })
    });
    it('returns 200 status and ignores any order query value other than asc and defaults to desc', () => {
        return request(app)
        .get('/api/reviews?order=66')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body
            expect(reviews).toBeSortedBy('created_at', {descending: true})
        })
    });
    it('returns 200 status with filtered array of review objects based on category filter query', () => {
        return request(app)
        .get('/api/reviews?category=dexterity')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body
            expect(reviews).toBeInstanceOf(Array)
            expect(reviews).toHaveLength(1)
            expect(reviews[0].category).toBe('dexterity')
        })
    });
    it('returns 404 with bad request message when given an invalid category to filter by', () => {
        return request(app)
        .get('/api/reviews?category=cheese')
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe("Resource not found")
        })
    });
    it('returns 200 with an empty array when given valid category but there are no results when filtered', () => {
        return request(app)
        .get('/api/reviews?category=children\'s games')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body
            expect(reviews).toBeInstanceOf(Array)
            expect(reviews).toHaveLength(0)
        })
    })
    it('returns 200 with array list filtered by category, in ascending votes order', () => {
        return request(app)
        .get('/api/reviews?category=social+deduction&&order=asc&&sort_by=votes')
        .expect(200)
        .then(({ body }) => {
            const{ reviews } = body
            expect(reviews).toHaveLength(11)
            expect(reviews).toBeSortedBy('votes')
        })
    });
    it('returns 200 with all reviews and ignores SQL injection code', () => {
        return request(app)
        .get('/api/reviews?sort_by=title;+SELECT+*+FROM+users')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body
            expect(reviews).toHaveLength(13)
        })
    });
});

describe('GET /api/reviews/:review_id', () => {
    it('return 200 status with a review object as a message', () => {
        return request(app)
        .get('/api/reviews/4')
        .expect(200)
        .then(({ body }) => {
            const { review } = body
            expect(review).toBeInstanceOf(Object)
            expect(review).toEqual({
                review_id: 4,
                title: "Dolor reprehenderit",
                review_body: expect.any(String),
                designer: "Gamey McGameface",
                review_img_url: expect.any(String),
                votes: 7,
                category: "social deduction",
                owner: "mallionaire",
                created_at: expect.any(String),
                comment_count: expect.any(Number)
            })
        })
    });
    it('return 200 status with a review object as a message with correct comment count', () => {
        return request(app)
        .get('/api/reviews/2')
        .expect(200)
        .then(({ body }) => {
            const { review } = body
            expect(review.comment_count).toBe(3)
        })
    });
    it('returns 404 status with a corresponding not found message when review_id doesn\'t exist', () => {
        return request(app)
        .get('/api/reviews/599')
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe("review_id not found")
        })
    });
    it('return 400 status with a corresponding bad request message when review_id is invalid', () => {
        return request(app)
        .get('/api/reviews/banana')
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe("Bad Request")
        })
    });
});

describe('PATCH /api/reviews/:review_id', () => {
    it('returns 200 status code with the number of votes increased in the updated object', () => {
        const voteUpdate = {
            inc_votes: 10
        }
        return request(app)
        .patch('/api/reviews/4')
        .send(voteUpdate)
        .expect(200)
        .then(({ body }) => {
            const { review } = body
            expect(review).toBeInstanceOf(Object)
            expect(review.review_id).toBe(4)
            expect(review.title).toBe("Dolor reprehenderit")
            expect(review.votes).toBe(17)
        })
    });
    it('returns 200 status code with the number of votes decreased in the updated object if the new vote number passed is a minus number', () => {
        const voteUpdate = {
            inc_votes: -17
        }
        return request(app)
        .patch('/api/reviews/4')
        .send(voteUpdate)
        .expect(200)
        .then(({ body }) => {
            const { review } = body
            expect(review).toBeInstanceOf(Object)
            expect(review.votes).toBe(-10)
        })
    });
    it('returns 404 status with a corresponding not found message when passed review_id ot of range', () => {
        const voteUpdate = {
            inc_votes: -17
        }
        return request(app)
        .patch('/api/reviews/599')
        .send(voteUpdate)
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe("review_id not found")
        })
    });
    it('returns 400 status with a corresponding bad request message when passed review_id of invaild type', () => {
        const voteUpdate = {
            inc_votes: -17
        }
        return request(app)
        .patch('/api/reviews/banana')
        .send(voteUpdate)
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe("Bad Request")
        })   
    });
    it('returns 400 status with a corresponding bad request message when sent an incorrect key in sent object', () => {
        const voteUpdate = {
            votes: 10
        }
        return request(app)
        .patch('/api/reviews/4')
        .send(voteUpdate)
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe("Bad Request")
        })
    });
    it('returns 400 status with a corresponding bad request message when sent an object with an invalid value', () => {
        const voteUpdate = {
            inc_votes: "ten"
        }
        return request(app)
        .patch('/api/reviews/4')
        .send(voteUpdate)
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe("Bad Request")
        })
    });
    it('returns 200 status code with the number of votes changed ignoring any other information passed in the object', () => {
        const voteUpdate = {
            inc_votes: 10,
            title: "Hello there..."
        }
        return request(app)
        .patch('/api/reviews/4')
        .send(voteUpdate)
        .expect(200)
        .then(({ body }) => {
            const { review } = body
            expect(review).toBeInstanceOf(Object)
            expect(review.review_id).toBe(4)
            expect(review.title).toBe("Dolor reprehenderit")
            expect(review.votes).toBe(17)
        })
    });
});

describe('GET /api/reviews/:review_id/comments', () => {
    it('returns 200 status code with array of comments for relevant review_id', () => {
        return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then(({ body }) => {
            const { comments } = body
            expect(comments).toBeInstanceOf(Array)
            expect(comments).toHaveLength(3)
            comments.forEach(comment => {
                expect(comment).toEqual({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    review_id: expect.any(Number)
                })
            })
        })
    });    
    it('returns 400 with bad request message when given id that is of invalid type', () => {
        return request(app)
        .get('/api/reviews/order/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe("Bad Request")
        })
    });
    it('returns 404 with not found message when given an id that doesn\'t exist', () => {
        return request(app)
        .get('/api/reviews/66/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe("Resource not found")
        })
    });
    it('returns 200 with an empty array if there are no comments for that id but the id exists', () => {
        return request(app)
        .get('/api/reviews/4/comments')
        .expect(200)
        .then(({ body }) => {
            const { comments } = body
            expect(comments).toBeInstanceOf(Array)
            expect(comments).toHaveLength(0)
        })
    });
});

describe('POST /api/reviews/:review_id/comments', () => {
    it('returns 201 status code with new comment when passed valid request', () => {
        const newComment = {
            username: "dav3rid",
            body: "Good soldiers follow orders"
        }

        return request(app)
        .post('/api/reviews/5/comments')
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
            const { comment } = body
            expect(comment).toBeInstanceOf(Object)
            expect(comment.comment_id).toBe(7)
            expect(comment.votes).toBe(0)
            expect(comment.author).toBe("dav3rid")
            expect(comment.body).toBe("Good soldiers follow orders")
            expect(comment.review_id).toBe(5)
            expect(comment).toHaveProperty("created_at")
        })
    });
    it('returns 400 with bad request message when given id that is of invalid type', () => {
        const newComment = {
            username: "dav3rid",
            body: "Good soldiers follow orders"
        }        
        return request(app)
        .post('/api/reviews/rex/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe("Bad Request")
        })
    });
    it('returns 404 with not found message when given an id that doesn\'t exist', () => {
        const newComment = {
            username: "dav3rid",
            body: "Good soldiers follow orders"
        }
        return request(app)
        .post('/api/reviews/99/comments')
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe("Resource not found")
        })
    });
    it('returns 400 status with bad request message when passed a request with an invalid key', () => {
        const newComment = {
            user: "dav3rid",
            body: "Good soldiers follow orders"
        }
        return request(app)
        .post('/api/reviews/5/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe("Bad Request")
        })
    });
    it('returns 401 error status with message of unauthorised if passed invalid username', () => {
        const newComment = {
            username: "Obi-Wan",
            body: "Hello there"
        }
        return request(app)
        .post('/api/reviews/5/comments')
        .send(newComment)
        .expect(401)
        .then(({ body }) => {
            expect(body.message).toBe("Unauthorised")
        })
    });
});
describe('DELETE /api/comments/:comment_id', () => {
    it('returns 204 with no content when comment_id is valid', () => {
        return request(app)
        .delete('/api/comments/5')
        .expect(204)
    });
    it('returns 400 with bad request message when given comment_id that is of incorrect type', () => {
        return request(app)
        .delete('/api/comments/frodo')
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe("Bad Request")
        })
    });
    it('returns 404 with comment_id not found message when given comment_id of correct try but doesn\'t exist', () => {
        return request(app)
        .delete('/api/comments/421')
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe("comment_id not found")
        })
    });
});

describe('GET /api/users', () => {
    it('returns 200 status with array of all user objects each with properties username, name, avatar_url', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
            const { users } = body
            expect(users).toBeInstanceOf(Array)
            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                )
            })
        })
    })
})

describe('GET api/users/:username', () => {
    it('returns 200 with user based on username', () => {
        return request(app)
        .get('/api/users/philippaclaire9')
        .expect(200)
        .then(({ body }) => {
            const { user } = body
            expect(user).toEqual({
                username: "philippaclaire9",
                avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
                name: "philippa"
            })  
        });
    })
    it('returns 404 status with a corresponding not found message when username doesn\'t exist', () => {
        return request(app)
        .get('/api/users/padme')
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe("username not found")
        })
    });
});

describe('handling incorrect path errors', () => {
    it('returns 404 status with path not found error message when an incorrect path is input', () => {
        return request(app)
        .get('/api/nonsense')
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe("path not found")
        })
    });
});

describe('GET /api', () => {
    it('returns 200 status and a JSON object with information on api endpoints ', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            const { endpoints } = body
            const endpointKeys = Object.keys(endpoints)
            const expectedEndpoints = [
                "GET /api",
                "GET /api/categories",
                "GET /api/reviews",
                "GET /api/reviews/:review_id",
                "PATCH /api/reviews/:review_id",
                "GET /api/reviews/:review_id/comments",
                "POST /api/reviews/:review_id/comments",
                "DELETE /api/comments/:comment_id",
                "GET /api/users"
            ]
            expect(endpoints).toBeInstanceOf(Object)
            expect(endpointKeys).toHaveLength(9)
            expect(endpointKeys).toEqual(expectedEndpoints)
        })
    });
});