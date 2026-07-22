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
                default: ""
            },
            mrp: {
                type: Number,
                default: 0
            },
            sellingPrice: {
                type: Number,
                default: 0
            },
            reviewCount: {
                type: Number,
                default: 0
            },
            unit: {
                type: String,
                default: ""
            },
            quantityPerUnit: {
                type: Number,
                default: 1
            },
            rating: {
                type: Number,
                default: 0
            },
            marketPrice: {
                type: Number,
                default: 0
            },
            sku: {
                type: Number,
                default: 0
            }
        }
    ]
});

export const TrendModel = mongoose.model<trend>("Trend", TrendSchema);
