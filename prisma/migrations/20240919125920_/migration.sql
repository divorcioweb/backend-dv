-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT,
    "telefone" TEXT,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "profissao" TEXT,
    "rg" TEXT,
    "cpf" TEXT,
    "type" INTEGER,
    "estado_civil" TEXT,
    "naturalidade" TEXT,
    "nome_solteiro" BOOLEAN,
    "is_admin" BOOLEAN,
    "status" TEXT,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "usuario_id" TEXT,
    CONSTRAINT "usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "complemento" TEXT,
    "estado" TEXT,
    "cidade" TEXT,
    "pais" TEXT,
    "cep" TEXT,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "usuario_id" TEXT,
    CONSTRAINT "endereco_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "usuario_id" TEXT NOT NULL,
    CONSTRAINT "documento_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pagamento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "porcentagem" INTEGER,
    "total" INTEGER NOT NULL DEFAULT 4000,
    "valor_pago" INTEGER,
    "pago" BOOLEAN NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "usuario_id" TEXT,
    CONSTRAINT "pagamento_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "data_hora" DATETIME NOT NULL,
    "usuario_id" TEXT,
    CONSTRAINT "data_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "evento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "resetpassword" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_usuario_id_key" ON "usuario"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "endereco_usuario_id_key" ON "endereco"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "pagamento_usuario_id_key" ON "pagamento"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "data_usuario_id_key" ON "data"("usuario_id");
