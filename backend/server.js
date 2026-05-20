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

app.get("/", (req, res) => {
    res.send("Backend funcionando correctamente");
});

app.get("/test-usuarios", async (req, res) => {
    try {
        const pool = await sql.connect(config);

        const resultado = await pool.request().query(`
            SELECT usuario, clave, rol
            FROM Usuarios
        `);

        res.json(resultado.recordset);

    } catch (error) {
        console.log("ERROR TEST USUARIOS:");
        console.log(error);

        res.status(500).json({
            error: "Error SQL"
        });
    }
});

app.post("/login", async (req, res) => {
    const usuario = req.body.usuario?.trim();
    const clave = req.body.clave?.trim();

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

        if (resultado.recordset.length > 0) {
            res.json({
                success: true,
                usuario: resultado.recordset[0].usuario,
                rol: resultado.recordset[0].rol
            });
        } else {
            res.json({
                success: false,
                message: "Usuario o contraseña incorrectos"
            });
        }

    } catch (error) {
        console.log("ERROR LOGIN:");
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error del servidor"
        });
    }
});

app.listen(3000, () => {
    console.log("Servidor activo:");
    console.log("http://localhost:3000");
});