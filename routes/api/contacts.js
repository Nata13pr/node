const express = require("express");
const router = express.Router();
const { NotFound, BadRequest } = require("http-errors");
const Joi = require("joi");

const constsOperations = require("../../models/contacts");

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await constsOperations.listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  console.log(contactId);
  try {
    const contact = await constsOperations.getContactById(contactId);
    if (!contact) {
      // throw new NotFound();

      // throw newCreateError(404, "Not found");
      // const error = new Error("Not found");
      // error.status = 404;
      // throw error;

      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      // throw new BadRequest(error.message)
      res.status(400).json({
        status: "error",
        code: 400,
        message: "missing required name field",
      });
    }
    const newContact = await constsOperations.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleteContact = await constsOperations.removeContact(contactId);
    if (!deleteContact) {
      throw new NotFound();
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  // const { contactId } = req.params;
  // try {
  //   if (!req.body) {
  //     return res.status(400).json({
  //       status: "error",
  //       code: 400,
  //       message: "missing required name field",
  //     });
  //   }
  //   const newContact = await constsOperations.updateContact(
  //     contactId,
  //     req.body
  //   );
  //   if (!newContact) {
  //     return res.status(404).json({
  //       status: "error",
  //       code: 404,
  //       message: "Not found",
  //     });
  //   }
  //   return res.json(newContact);
  // } catch (error) {
  //   next(error);
  // }

  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        status: "error",
        code: 400,
        message: "missing required name field",
      });
    }
    const { contactId } = req.params;
    const updateContact = await constsOperations.updateContact(
      contactId,
      req.body
    );
    console.log(updateContact);
    if (!updateContact) {
      // throw new NotFound();

      // throw newCreateError(404, "Not found");
      // const error = new Error("Not found");
      // error.status = 404;
      // throw error;

      return res.status(404).json({ message: "Not found" });
    }
    res.json(updateContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
