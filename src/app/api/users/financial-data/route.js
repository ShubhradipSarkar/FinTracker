import { NextRequest, NextResponse } from "next/server";
import FinancialData from "@/models/BaseModel";
import { connect } from "../../../../../DBConfig/DBConfig";

// Ensure MongoDB connection
connect();

// Handler for POST and PUT requests
export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { userId, ...rest } = reqBody; // Destructure userId and the rest of the fields

        if (userId) {
            // If userId exists, find the document by userId and update it
            const existingData = await FinancialData.findOneAndUpdate(
                { userId },    // Find the document by userId
                { ...rest },   // Update with the rest of the fields (like salary, fields)
                { new: true, upsert: true }  // Return the updated document or create a new one if it doesn't exist
            );

            if (existingData) {
                return NextResponse.json({
                    message: "Financial data updated successfully",
                    success: true,
                    data: existingData
                });
            }
        } else {
            // If userId doesn't exist, create a new entry
            const newData = new FinancialData(reqBody);
            await newData.save();

            return NextResponse.json({
                message: "Financial data created successfully",
                success: true,
                data: newData
            });
        }
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json({
            message: "An error occurred",
            success: false,
            error: error.message
        });
    }
}

export async function PUT(request) {
    try {
        const reqBody = await request.json();
        const { userId } = reqBody;  // Expecting userId to be sent in the request body

        if (!userId) {
            return NextResponse.json({
                message: "userId is required",
                success: false,
            });
        }

        // Find the financial data by userId
        const data = await FinancialData.findOne({ userId });

        if (!data) {
            return NextResponse.json({
                message: "Financial data not found",
                success: false,
            });
        }

        return NextResponse.json({
            message: "Financial data retrieved successfully",
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error in PUT handler:", error);
        return NextResponse.json({
            message: "An error occurred",
            success: false,
            error: error.message,
        });
    }
}
