USE Restaurante_;
GO

INSERT INTO Usuarios(usuario, clave, rol)
VALUES('admin', '1234', 'Administrador');

GO

UPDATE Usuarios
SET clave = '1234'
WHERE usuario = 'admin';

USE Restaurante_;
GO

SELECT usuario, clave, rol
FROM Usuarios;

USE Restaurante_;
GO

SELECT usuario, rol
FROM Usuarios
WHERE LTRIM(RTRIM(usuario)) = 'admin'
AND LTRIM(RTRIM(clave)) = '1234';