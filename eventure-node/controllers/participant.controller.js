import Event from "../models/eventModel.js";
import Participant from "../models/participantModel.js";

export const getMyParticipants = async (req, res) => {
    const userId = req.user.sub;
    const {
        status,
        from
    } = req.query

    console.log(from)

    const events = await Event.find({
        startDate: { $gte: new Date(from) }
    }).select('_id').exec();

    const eventIds = events.map(event => event._id);

    const participants = await Participant.find({
        userId,
        status,
        eventId: { $in: eventIds }
    }).populate('eventId').exec()

    return res.send(participants)
}


export const updateParticipantStatus = async(req, res) => {
    const participantId = req.params.participantId;
    const { status } = req.body;
    const participant = await Participant.findByIdAndUpdate(participantId, {
        status
    }, {
        new: true,
        useFindAndModify: false
    })

    return res.send(participant)
}