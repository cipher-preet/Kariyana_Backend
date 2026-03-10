import mongoose, {Types, Document} from "mongoose";

export interface trend extends Document {
    trendDescription: string;
    TrendName: string;
    products : [
        {
            _id: Types.ObjectId;
            name: string;
            images: string;
            mrp: number;
            sellingPrice: number;
            reviewCount: number;
            unit: string;
            quantityPerUnit: number;
            rating: number;
            marketPrice: number;
            sku: number;
        }
    ]
}

const TrendSchema = new mongoose.Schema<trend>({
    trendDescription: {
        type: String,
        required: true,
        trim: true
    }, 
    TrendName: {
        type: String,
        required: true,
        trim: true
    }, 
    products: [
        {
            _id: {
                type: Types.ObjectId,
                ref: "Product"
            },
            name: {
                type: String,
                required: true
            },
            images: {
                type: String,
                required: true
            },
            mrp: {
                type: Number,
                required: true
            },
            sellingPrice: {
                type: Number,
                required: true
            },
            reviewCount: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                required: true
            },
            quantityPerUnit: {
                type: Number,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            marketPrice: {
                type: Number,
                required: true
            },
            sku: {
                type: Number,
                required: true
            }
        }
    ]
});

export const TrendModel = mongoose.model<trend>("Trend", TrendSchema);
