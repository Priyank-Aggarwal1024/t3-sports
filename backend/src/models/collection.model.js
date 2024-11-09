import mongoose from "mongoose";



const CollectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const Collection = mongoose.model('Collection', CollectionSchema);

export default Collection;