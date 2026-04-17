import { Router } from "express";
const router = Router();
import { deletePort, getAllPorts } from "../controllers/ports.controller.js";
import { getPortByCode } from "../controllers/ports.controller.js";
import { createPort } from "../controllers/ports.controller.js";
import { updatePort } from "../controllers/ports.controller.js";

router.get('/',(req,res)=>{
    getAllPorts(req, res);
})

router.get('/:code',(req,res)=>{
      getPortByCode(req, res);
    });

router.post("/",(req,res)=>{
    createPort(req, res);
})

router.delete("/:code",(req,res)=>{
    deletePort(req, res);
})

router.patch("/:code", (req, res) => {
    updatePort(req, res);
});

export default router;
