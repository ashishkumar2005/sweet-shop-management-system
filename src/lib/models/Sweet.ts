import mongoose, { Schema, Model } from 'mongoose'

export interface ISweet {
  name: string
  category: string
  price: number
  quantity: number
  imageUrl: string
  description: string
  createdAt: Date
}

const SweetSchema = new Schema<ISweet>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Sweet: Model<ISweet> = mongoose.models.Sweet || mongoose.model<ISweet>('Sweet', SweetSchema)

export default Sweet
