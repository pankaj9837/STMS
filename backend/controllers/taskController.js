const Task = require("../models/Task");

// 📌 Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      createdBy: req.user._id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create task", error: err.message });
  }
};

// 📄 Get paginated tasks for the logged-in user
exports.getTasks = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const count = await Task.countDocuments({
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    });

    res.json({ tasks, totalPages: Math.ceil(count / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks", error: err.message });
  }
};

// 📃 Get single task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ msg: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching task", error: err.message });
  }
};

// ✏️ Update task
exports.updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update task", error: err.message });
  }
};

// ✅ Update status only
exports.updateTaskStatus = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update status", error: err.message });
  }
};

// ❌ Delete task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete task", error: err.message });
  }
};
