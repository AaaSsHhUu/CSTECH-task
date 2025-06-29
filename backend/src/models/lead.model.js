import mongoose, {Schema} from "mongoose";

const leadSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    phone : {
        type: String,
        required: true,
    },
    notes : {
        type: String,
        required: false,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
    },
    fileBatchId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UploadedFile',
    }
}, {timestamps: true});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;