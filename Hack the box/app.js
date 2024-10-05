const express = require('express');
const axios = require('axios');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const Toy = require("./model/Toy") 
app.use(express.json()); 
dotenv.config(); 
const UNSPLASH_ACCESS_KEY = process.env.xyz;
mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to MongoDB");
      
    }
  );
app.post('/toys', async (req, res) => {
      const { name, description, price } = req.body;
      try {
          
  
          const newToy = new Toy({ name, description, price});
          await newToy.save();
          res.status(201).json(newToy);
      } catch (error) {
          res.status(500).json({ error: 'Error creating toy' });
      }
  });
app.get('/toys', async (req, res) => {
      try {
          const toys = await Toy.find();
          res.status(200).json(toys);
      } catch (error) {
          res.status(500).json({ error: 'Error fetching toys' });
      }
  });
app.get('/toys/:id', async (req, res) => {
      try {
          const toy = await Toy.findById(req.params.id);
          if (!toy) return res.status(404).json({ message: 'Toy not found' });
          const thumbnail = await axios.get('https://api.unsplash.com/search/photos', {
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
            params: {
              query: toy.name,
              per_page: 1    
            }
          });
          res.status(200).json({toy,thumbnail});
      } catch (error) {
          res.status(500).json({ error: 'Error fetching toy' });
      }
  });

app.put('/toys/:id', async (req, res) => {
    const { name, description, price } = req.body;
    try {
        
        const updatedToy = await Toy.findByIdAndUpdate(
            req.params.id,
            { name, description, price },
            { new: true }
        );

        if (!updatedToy) return res.status(404).json({ message: 'Toy not found' });
        res.status(200).json(updatedToy);
    } catch (error) {
        res.status(500).json({ error: 'Error updating toy' });
    }
});
app.delete('/toys/:id', async (req, res) => {
                try {
                    const deletedToy = await Toy.findByIdAndDelete(req.params.id);
                    if (!deletedToy) return res.status(404).json({ message: 'Toy not found' });
                    res.status(204).send();
                } catch (error) {
                    res.status(500).json({ error: 'Error deleting toy' });
                }
            });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});