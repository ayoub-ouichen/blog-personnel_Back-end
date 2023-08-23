const express = require('express');
const connection = require('../connection');
const router = express.Router();
const { authentifierToken } = require('../utils/authorization');

router.get('/lire-poste', authentifierToken, (req, res) => {
  connection.query('SELECT * FROM poste', (err, result) => {
    if (err) console.log(err);
    else res.send(result.recordset[0]);
  });
});

router.post('/nouveau-poste', authentifierToken, async (req,res)=>{
  
  const poste = req.body;

  try {
    let request = new connection.Request();
    request.input('param1', connection.VarChar, poste.p_titre);
    request.input('param2', connection.VarChar, poste.p_contenu);
    request.input('param3', connection.Int, poste.p_lire_temps);

    let result = await request.query('INSERT INTO poste (p_titre,p_contenu,p_date_creation,p_lire_temps) values (@param1,@param2,getdate(),@param3);');
    
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


