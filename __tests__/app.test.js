const request = require("supertest");
const app = require("../app")
const db = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")
const connection = require("../db/connection")

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

describe.only('GET /api/reviews', () => {
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
    it('returns 200 and returns each review object by date descending order', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body
            expect(reviews).toBeSortedBy('created_at', {descending: true})
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