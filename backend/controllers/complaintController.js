// const Complaint = require("../models/Complaint");

// // CREATE COMPLAINT (Student)
// exports.createComplaint = async (req, res) => {
//   try {
//     const { title, description, category } = req.body;

//     const complaint = await Complaint.create({
//       title,
//       description,
//       category,
//       student: req.user.id
//     });

//     res.status(201).json(complaint);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // GET ALL COMPLAINTS (Admin/Warden)
// exports.getAllComplaints = async (req, res) => {
//   try {
//     let complaints;

//     if (req.user.role === "student") {
//       // only own complaints
//       complaints = await Complaint.find({ student: req.user.id });
//     } 
//     else if (req.user.role === "staff") {
//       // only assigned complaints
//       complaints = await Complaint.find({ assignedTo: req.user.id });
//     } 
//     else if (req.user.role === "warden" || req.user.role === "admin") {
//       // full access
//       complaints = await Complaint.find();
//     }

//     complaints = await Complaint.find(complaints)
//       .populate("student", "name email")
//       .populate("assignedTo", "name email");

//     res.json(complaints);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // UPDATE STATUS (Staff)
// exports.updateStatus = async (req, res) => {
//   try {
//     const complaint = await Complaint.findById(req.params.id);

//     if (!complaint) {
//       return res.status(404).json({ message: "Not found" });
//     }

//     // 🔒 Restrict staff
//     if (
//       req.user.role === "staff" &&
//       complaint.assignedTo.toString() !== req.user.id
//     ) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     complaint.status = req.body.status;
//     await complaint.save();

//     res.json(complaint);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// // ASSIGN COMPLAINT (Admin/Warden)
// exports.assignComplaint = async (req, res) => {
//   try {
//     const { staffId } = req.body;

//     const complaint = await Complaint.findByIdAndUpdate(
//       req.params.id,
//       { assignedTo: staffId, status: "in-progress" },
//       { returnDocument: "after" }
//     ).populate("assignedTo", "name email");

//     res.json(complaint);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };