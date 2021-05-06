const yup = require('yup')
const Users = require('./users-model')

function logger(req, res, next) {
    console.log(`
    ${req.method} request to ${res.baseUrl} endpoint
    req.body ${JSON.stringify(req.body)}
    req.params.id ${req.params.id}
    `)
    next()
}

async function validateUserId(req,res,next) {
    try {
        const user = await Users.getById(req.params.id)
        if(!user) {
            next({
                status: 404,
                message: `user id ${req.params.id} not found`
            })
        } else {
            req.user = user
            next()
        }
    } catch(err) {
        next(err)
    }
}

const nameSchema = yup.object({
    name: yup.string()
    .trim()
    .required('name required')
    .min(3, 'name must have a minimum of 3 characters')
    .max(50, 'character limit 100 on name')
})

async function validateUser(req, res, next) {
    try {
        const validated = await nameSchema.validate(req.body, {
            stripUnknown: true
        })
        req.body = validated
        next()
    } catch (err) {
        next({
            status: 400,
            message: err.message
        })
    }
}

const postSchema = yup.object({
    text: yup.string()
    .trim()
    .required('text required')
    .min(3, 'text must have a minimum of 3 characters')
    .max(100, 'character limit 100 on texts')
})

async function validatePost(req, res, next) {
    try {
        const validated = await postSchema.validate(req.body, {
            stripUnknown: true
        })
        req.body = validated
        next()
    } catch (err) {
        next({
            status: 400,
            message: err.message
        })
    }
}

module.exports = {logger, validateUserId, validatePost}