const express = require("express");
const bodyParser = require("body-parser");
const Joi = require("@hapi/joi");
const app = express();
app.use(bodyParser.json());

const schema = Joi.object({
  fullName: Joi.string().required().max(128).messages({
    "string.empty": `"fullName" is required`,
    "string.max": `"fullName" must be less than or equal to 128 characters long`,
    "any.required": `"fullName" is required`,
  }),
  email: Joi.string().email().required().messages({
    "string.empty": `"email" is required`,
  }),
  age: Joi.number().required().min(18).max(100).messages({
    "number.min": `"age" must be larger than or equal to 18`,
    "number.max": `"age" must be less than or equal to 100`,
  }),
  title: Joi.string().valid("Mr.", "Mrs.", "Ms.", "N/A").messages({
    "string.valid": `"title" must be one of [Mr., Mrs., Ms., N/A]`,
  }),
  password: Joi.string(),
  token: Joi.string(),
  registrationTimestamp: Joi.date(),
})
  .xor("token", "password")
  .messages({
    "object.missing": "either password or token must be present",
    "object.xor": "only one of password or token must be present",
  });

app.post("/user", (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    let msgArray = [];
    for (let msg of error.details) {
      msgArray.push({ message: msg.message });
    }
    return res.status(422).json({
      statusCode: 422,
      errors: msgArray,
    });
  } else {
    return res.status(201).send();
  }
});

app.listen(3000, () => {
  console.log("This server port is 3000!!");
});
