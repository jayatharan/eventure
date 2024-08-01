import Task from "../models/taskModel.js"

export const getMyTasks = async (req, res) => {
    const userId = req.user.sub
    const {
        status,
        from
    } = req.query

    const tasks = await Task.find({
        userId,
        status,
        deadLine: {
            $gte: new Date(from)
        }
    }).populate('eventId').exec()

    return res.send(tasks)
}

export const updateTaskStatus = async(req, res) => {
    const taskId = req.params.taskId;
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(taskId, {
        status
    }, {
        new: true,
        useFindAndModify: false
    })

    return res.send(task)
}
