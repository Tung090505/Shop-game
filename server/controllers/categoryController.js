const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ displayOrder: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name, slug, image, description, displayOrder, parent, type } = req.body;

        const newCategory = new Category({
            name,
            slug: slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            image,
            description,
            displayOrder,
            parent: parent === '' ? null : parent,
            type: type || 'account'
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Tránh lỗi ObjectId nếu parent là chuỗi rỗng
        if (updateData.parent === '') {
            updateData.parent = null;
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
