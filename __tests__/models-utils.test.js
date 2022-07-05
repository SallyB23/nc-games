const connection = require("../db/connection");
const { checkExists } = require("../models/model-utils");

afterAll(() => connection.end());

describe('checkExists', () => {
    it('returns error message if value does not exist in table', () => {
        return checkExists("reviews", "review_id", 499)
        .catch(err => {
            expect(err).toEqual({ status: 404, message: 'Resource not found' })
        })
    });
});