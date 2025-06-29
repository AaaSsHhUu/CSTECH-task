import mongoose, {Schema} from "mongoose";

const uploadedFileSchema = new Schema({
    originalName: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    totalLeads: {
        type: Number,
        default: 0,
    }
})

const UploadedFile = mongoose.model('UploadedFile', uploadedFileSchema);
export default UploadedFile;