const express = require('express');
const connection = require('../connection');
const router = express.Router();
const { authentifierToken } = require('../utils/authorization');

router.post('/nouveau-poste', authentifierToken, async (req,res)=>{
  
  const poste = req.body;

  try {
    let request = new connection.Request();
    request.input('param1', connection.VarChar, poste.p_titre);
    request.input('param2', connection.VarChar, poste.p_contenu);

    let result = await request.query('INSERT INTO poste (p_titre,p_contenu,p_date_creation) values (@param1,@param2,getdate());');
    
    if (result.rowsAffected == 1) {
        return res.status(200).json({ success: true, message: 'Poste ajouté avec succès' });
    }
    else{
        return res.status(500).json({ success: false, message: 'Une erreur s° est produite' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;


