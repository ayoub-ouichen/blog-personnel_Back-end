const express = require('express');
const connection = require('../connection');
const router = express.Router();
const { hacher_pwd, comparer_pwd } = require('../utils/encryptPassword');
const { genererToken, authentifierToken } = require('../utils/authorization');

router.get('/getUsers', authentifierToken, (req, res) => {
  connection.query('SELECT * FROM utilisateur', (err, result) => {
      if (err) console.log(err);
      else res.send(result.recordset);
  });
});

router.post('/sinscrire', async (req,res)=>{
  
  const user = req.body;
  const pwd_hache = hacher_pwd(user.u_pwd);
  try {
    let request = new connection.Request();
    request.input('param1', connection.VarChar, user.u_nom);
    request.input('param3', connection.VarChar, user.u_mail);
    request.input('param4', connection.VarChar, user.u_tel);
    request.input('param5', connection.VarChar, pwd_hache);

    let result = await request.query('SELECT u_mail FROM utilisateur WHERE u_mail= @param3;');
    if (result.recordset.length <= 0) {
      let result = await request.query('INSERT INTO utilisateur (u_nom,u_mail,u_tel,u_pwd) values (@param1,@param3,@param4,@param5);');
      if (result.rowsAffected == 1) {
        return res.status(200).json({ success: true, message: 'Utilisateur ajouté avec succès' });
      }else{
        return res.status(500).json({ success: false, message: 'Une erreur s° est produite' });
      }
    }else{
      return res.status(200).json({ success: false, message: 'Email exist déjà' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
});

router.post('/connexion', async (req, res)=>{
  const user = req.body;
  try {
    let request = new connection.Request();
    request.input('u_mail', connection.VarChar, user.u_mail);
    let result = await request.query('SELECT * FROM utilisateur WHERE u_mail = @u_mail;');
    if(result.rowsAffected > 0) {
      let bon_pwd = comparer_pwd(user.u_pwd,result.recordset[0].u_pwd);
      if (bon_pwd) {
        const u_token = genererToken(result.recordset[0]);
        return res.status(200).json({ success: true, message: 'Connexion succès.', token: u_token});
      } else {
        return res.status(200).json({ success: false, message: 'Mot de passe incorrect.'});
      }
    } else {
      return res.status(200).json({ success: false, message: 'Pas de compte avec cet e-mail.'});
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err});
  }
});

module.exports = router;


