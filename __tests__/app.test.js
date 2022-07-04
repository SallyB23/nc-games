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

describe('handling incorrect path errors', () => {
    it('returns 404 status with path not found error message when an incorrect path is input', () => {
        return request(app)
        .get('/api/nonsense')
        .expect(404)
        .then(({ body }) => {
            expect(body.error).toBe("path not found")
        })
    });
});