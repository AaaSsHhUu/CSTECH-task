import path from "path";
import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import csvParser from "csv-parser";
import {Readable} from "stream";
import xlsx from "xlsx";
import Agent from "../models/agent.model.js";
import UploadedFile from "../models/uploadedFile.model.js";
import Lead from "../models/lead.model.js";

export const uploadAndDistribute = asyncHandler(async (req, res) => {
    if(!req.file){
        throw new ErrorHandler("No file uploaded", 411);
    }

    const ext = path.extname(req.file.originalname).toLowerCase();

    const leads = [];

    // Parse CSV file
    if(ext === ".csv"){
        await new Promise((resolve, reject) => {
            const stream = Readable.from(req.file.buffer.toString());

            stream.pipe(csvParser()).on('data', (row) => {
                const {FirstName, Phone, Notes} = row;
                
                if(FirstName.trim() && Phone.trim()){
                    leads.push({
                        firstName : FirstName.trim(),
                        phone : Phone.trim(),
                        notes : Notes?.trim() || ''
                    })
                }
            })
            .on('end', resolve)
            .on('error', reject)
        })
    }
    // Parse xlsx or xls file
    else if(ext === '.xlsx' || ext === '.xls'){
        const workbook = xlsx.read(req.file.buffer, {type : 'buffer'});
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(sheet);

        json.forEach((row) => {
            const {FirstName, Phone, Notes} = row;
            if(FirstName.trim() && Phone.trim()){
                leads.push({
                    firstName : FirstName.trim(),
                    phone : Phone.trim(),
                    notes : Notes?.trim() || ''
                })
            }
        })
    }

    else{
        throw new ErrorHandler("Invalid file type. Only .csv, .xlsx or .xls files are allowed.", 400);
    }

    // Validate leads
    if(!leads.length){
        throw new ErrorHandler("No leads found in your file", 404);
    }

    // Get all agents
    const agents = await Agent.find({role : 'agent'});
    if(!agents.length){
        throw new ErrorHandler("No agents found", 404);
    }

    // Create a record for the uploaded file
    const newUploadedFile = await UploadedFile.create({
        originalName : req.file.originalname,
        uploadedBy : req.user?.id,
        totalLeads : leads.length
    })

    // Distributing leads to the agents
    const savedLeads = [];
    for(let i=0; i < leads.length; i++){
        const agent = agents[i % agents.length]

        const newLead = await Lead.create({
            ...leads[i],
            assignedTo : agent._id,
            fileBatchId : newUploadedFile._id
        })

        savedLeads.push(newLead);
    }

    res.status(201).json({
        success : true,
        message : "Leads uploaded and assigned successfully",
        total : savedLeads.length
    })

})