const express = require("express");
const sql = require("mssql/msnodesqlv8");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const config = {
    connectionString:
        "Driver={ODBC Driver 18 for SQL Server};Server=(localdb)\\DataBaseJ;Database=Restaurante_;Trusted_Connection=Yes;TrustServerCertificate=Yes;"
};

sql.connect(config)
    .then(() => {
        console.log("Conectado a SQL Server");
    })
    .catch((error) => {
        console.log("ERROR SQL:");
        console.log(error);
    });

app.post("/login", async (req, res) => {
    const usuario = req.body.usuario?.trim();
    const clave = req.body.clave?.trim();

    if (!usuario || !clave) {
        return res.json({
            success: false,
            message: "Faltan datos"
        });
    }

    try {
        const pool = await sql.connect(config);

        const resultado = await pool.request()
            .input("usuario", sql.VarChar, usuario)
            .input("clave", sql.VarChar, clave)
            .query(`
                SELECT usuario, rol
                FROM Usuarios
                WHERE LTRIM(RTRIM(usuario)) = @usuario
                AND LTRIM(RTRIM(clave)) = @clave
            `);

        console.log("Usuario recibido:", usuario);
        console.log("Clave recibida:", clave);
        console.log("Filas encontradas:", resultado.recordset.length);

        if (resultado.recordset.length > 0) {
            return res.json({
                success: true,
                usuario: resultado.recordset[0].usuario,
                rol: resultado.recordset[0].rol
            });
        }

        return res.json({
            success: false,
            message: "Usuario o contraseña incorrectos"
        });

    } catch (error) {
        console.log("ERROR EN LOGIN:");
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Error del servidor"
        });
    }
});

app.listen(3000, () => {
    console.log("Servidor activo:");
    console.log("http://localhost:3000");
});