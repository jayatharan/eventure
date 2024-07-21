package org.example.app.conversion;

import org.bson.types.ObjectId;
import org.example.app.messages.TaskDTO;
import org.example.datamodel.Task;

public class TaskMapper {
    public static TaskDTO toDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId().toHexString());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setDeadLine(task.getDeadLine());
        dto.setUserId(task.getUserId().toHexString());
        dto.setEventId(task.getEventId().toHexString());
        dto.setStatus(task.getStatus());
        return dto;
    }

    public static Task toEntity(TaskDTO dto) {
        Task task = new Task();
        mergeDTOtoEntity(task, dto);
        return task;
    }

    public static void mergeDTOtoEntity(Task task, TaskDTO dto) {
        task.setId(new ObjectId());
        if(dto.getId() != null &&!dto.getId().isEmpty()){
            task.setId(new ObjectId(dto.getId()));
        }
        if(dto.getEventId() != null &&!dto.getEventId().isEmpty()){
            task.setEventId(new ObjectId(dto.getEventId()));
        }
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDeadLine(dto.getDeadLine());
        task.setUserId(new ObjectId(dto.getUserId()));
        task.setStatus(dto.getStatus());
    }
}
