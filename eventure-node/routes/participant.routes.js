import { Router } from "express"
import { getMyParticipants, updateParticipantStatus } from "../controllers/participant.controller.js";

const participantRouter = Router()

participantRouter.get("/my-participants", getMyParticipants)
participantRouter.post("/:participantId/update-status", updateParticipantStatus)

export default participantRouter;