USE master;
GO

ALTER DATABASE Tienda
SET SINGLE_USER
WITH ROLLBACK IMMEDIATE;
GO

DROP DATABASE Tienda;
GO
