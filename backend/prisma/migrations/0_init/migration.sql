-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "password_reset_token" TEXT,
    "token_send_at" TIMESTAMP(3),
    "email_verified_at" TIMESTAMP(3),
    "email_verify_token" TEXT,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clash" (
    "id" SERIAL NOT NULL,
    "user_Id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "expire_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clash_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VersusItem" (
    "id" SERIAL NOT NULL,
    "clash_Id" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VersusItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VersusComments" (
    "id" SERIAL NOT NULL,
    "clash_Id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VersusComments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Clash" ADD CONSTRAINT "Clash_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VersusItem" ADD CONSTRAINT "VersusItem_clash_Id_fkey" FOREIGN KEY ("clash_Id") REFERENCES "Clash"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VersusComments" ADD CONSTRAINT "VersusComments_clash_Id_fkey" FOREIGN KEY ("clash_Id") REFERENCES "Clash"("id") ON DELETE CASCADE ON UPDATE CASCADE;

