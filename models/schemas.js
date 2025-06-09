     const Joi = require('joi');
     
     module.exports.studentSchema = Joi.object({
        student: Joi.object({
            name: Joi.object({
                first: Joi.string().required(),
                last: Joi.string().required()
            }).required(),
            email: Joi.string().email().required(),
            description: Joi.string().required(),
        }).required()
    });

      
    module.exports.appointmentSchema = Joi.object({
        appointment: Joi.object({
            date: Joi.date().required(),
            startTime: Joi.string().required(),
            endTime: Joi.string().required(),
            note: Joi.string(),
            status: Joi.string().valid('booked', 'held', 'cancelled').default('booked')
        }).required()
    });