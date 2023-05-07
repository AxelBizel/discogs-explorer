-- CreateTable
CREATE TABLE "artists" (
    "id" SERIAL NOT NULL,
    "discogsId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "resourceUrl" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists_releases" (
    "release" INTEGER NOT NULL,
    "artist" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres_releases" (
    "release" INTEGER NOT NULL,
    "genre" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "labels" (
    "id" SERIAL NOT NULL,
    "discogsId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "resourceUrl" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "labels_releases" (
    "release" INTEGER NOT NULL,
    "label" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "refreshTokens" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiryDate" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "refreshTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "releases" (
    "id" SERIAL NOT NULL,
    "discogsId" INTEGER NOT NULL,
    "dateAdded" TIMESTAMPTZ(6) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "resourceUrl" VARCHAR(255),
    "coverUrl" VARCHAR(255),
    "coverThumbnail" VARCHAR(255),
    "releaseYear" INTEGER,
    "masterReleaseYear" INTEGER,
    "masterId" INTEGER,
    "masterUrl" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "releases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "styles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "styles_releases" (
    "release" INTEGER NOT NULL,
    "style" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artists_id_key" ON "artists"("id");

-- CreateIndex
CREATE UNIQUE INDEX "artists_discogsId_key" ON "artists"("discogsId");

-- CreateIndex
CREATE UNIQUE INDEX "artists_releases_release_artist_key" ON "artists_releases"("release", "artist");

-- CreateIndex
CREATE UNIQUE INDEX "genres_id_key" ON "genres"("id");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genres_releases_release_genre_key" ON "genres_releases"("release", "genre");

-- CreateIndex
CREATE UNIQUE INDEX "labels_id_key" ON "labels"("id");

-- CreateIndex
CREATE UNIQUE INDEX "labels_discogsId_key" ON "labels"("discogsId");

-- CreateIndex
CREATE UNIQUE INDEX "labels_releases_release_label_key" ON "labels_releases"("release", "label");

-- CreateIndex
CREATE UNIQUE INDEX "refreshTokens_id_key" ON "refreshTokens"("id");

-- CreateIndex
CREATE UNIQUE INDEX "refreshTokens_token_key" ON "refreshTokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "releases_id_key" ON "releases"("id");

-- CreateIndex
CREATE UNIQUE INDEX "releases_discogsId_userId_key" ON "releases"("discogsId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "styles_id_key" ON "styles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "styles_name_key" ON "styles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "styles_releases_release_style_key" ON "styles_releases"("release", "style");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "artists_releases" ADD CONSTRAINT "artists_releases_artist_fkey" FOREIGN KEY ("artist") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artists_releases" ADD CONSTRAINT "artists_releases_release_fkey" FOREIGN KEY ("release") REFERENCES "releases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genres_releases" ADD CONSTRAINT "genres_releases_genre_fkey" FOREIGN KEY ("genre") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genres_releases" ADD CONSTRAINT "genres_releases_release_fkey" FOREIGN KEY ("release") REFERENCES "releases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labels_releases" ADD CONSTRAINT "labels_releases_label_fkey" FOREIGN KEY ("label") REFERENCES "labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labels_releases" ADD CONSTRAINT "labels_releases_release_fkey" FOREIGN KEY ("release") REFERENCES "releases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refreshTokens" ADD CONSTRAINT "refreshTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "releases" ADD CONSTRAINT "releases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "styles_releases" ADD CONSTRAINT "styles_releases_release_fkey" FOREIGN KEY ("release") REFERENCES "releases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "styles_releases" ADD CONSTRAINT "styles_releases_style_fkey" FOREIGN KEY ("style") REFERENCES "styles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
