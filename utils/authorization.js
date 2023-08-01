const jwt = require('jsonwebtoken');
const cleSecret = 'b10g_Pers0nne1';

function genererToken(utilisateur) {
    const payload = {
        u_id: utilisateur.u_id,
        u_nom: utilisateur.u_nom,
        u_prenom: utilisateur.u_prenom,
        u_mail: utilisateur.u_mail,
        u_tel: utilisateur.u_tel
    };

    const options = {
        expiresIn: '15m'
    };

    return jwt.sign(payload, cleSecret, options);
}

function verifierToken(token) {
    try {
        const decoder = jwt.verify(token, cleSecret);
        return decoder;
    } catch (err) {
        // Gérer les erreurs de vérification du token (par exemple, token expiré)
        throw err
    }
}

function authentifierToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    try {
        const decoded = verifierToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.sendStatus(403);
    }
}

module.exports = { genererToken, verifierToken, authentifierToken };