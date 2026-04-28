const db = require('../config/db'); // Asegúrate de que apunte a tu conexión de MySQL

exports.obtenerPosts = (req, res) => {
    const sql = "SELECT * FROM publicaciones ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.crearPost = (req, res) => {
    const { autor, avatarAutor, texto, image, fecha } = req.body;
    const sql = "INSERT INTO publicaciones (autor, avatarAutor, texto, image, fecha) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [autor, avatarAutor, texto, image, fecha], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: 'success', id: result.insertId });
    });
};

exports.agregarLike = (req, res) => {
    const { id, likes, liked } = req.body;
    const sql = "UPDATE publicaciones SET likes = ?, liked = ? WHERE id = ?";
    db.query(sql, [likes, liked, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: 'success' });
    });
};