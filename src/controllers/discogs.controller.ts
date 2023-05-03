import discogsConfig from "../config/discogs.config.js";
import { Response } from "express";
import prisma from "../../prisma/prisma.js";
import discogsClient from "disconnect";
import { releases } from "@prisma/client";
// import fetch from "node-fetch";

const discogs = new discogsClient.Client(discogsConfig).user().collection();
const paginationNumber = 50;

interface ArtistOrLabel {
  id: number;
  name: string;
  discogsId: number;
  resource_url: string;
}

interface DiscogsItem {
  id: number;
  date_added: Date;
  basic_information: {
    title: string;
    resource_url: string;
    cover_image: string;
    thumb: string;
    year: number;
    genres: string[];
    styles: string[];
    artists: ArtistOrLabel[];
    labels: ArtistOrLabel[];
    master_id?: number;
    master_url?: string;
  };
}

const handleRaceError = (error: any) => {
  if (error.code === "P2002") {
    return;
  } else {
    console.log("error");
  }
};

const getItemsNumber = async (user: string) => {
  const rawItems = await discogs.getReleases(user, 0, {
    page: 1,
    per_page: 1,
  });
  return rawItems.pagination.pages;
};

const fetchCollection = async (req: any, res: Response) => {
  // get user id and username from access token
  const owner = await prisma.users.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!owner) {
    res.status(400).send({
      message: "Failed! User does not exist on database",
    });
    return;
  }

  // get collection length and pages
  const itemNumber = await getItemsNumber(owner.username);
  console.log(itemNumber);
  const pages = Math.ceil(itemNumber / paginationNumber);
  // fetch collection
  const collection: any[] = [];
  for (let i = 1; i <= pages; i++) {
    const rawCollection = await discogs.getReleases(owner.username, 0, {
      page: `${i}`,
      per_page: paginationNumber,
    });
    Array.prototype.push.apply(collection, rawCollection.releases);
  }

  // test > 1 release only
  // const rawCollection = await discogs.getReleases(owner.username, 0, {
  //   page: 1,
  //   per_page: 1,
  // });
  // const collection: any = rawCollection.releases;

  res.status(200).send({
    collection,
  });
  //store data in database
  return storeItems(collection, owner.id);
};

const storeItems = (collection: DiscogsItem[], owner: number) => {
  collection.forEach(async (item) => {
    const newRelease = await handleRelease(item, owner);
    if (newRelease) {
      await handleArtists(item, newRelease);
      await handleLabels(item, newRelease);
      await handleGenres(item, newRelease);
      await handleStyles(item, newRelease);
    }
  });
  return console.log("STORAGE DONE");
};

const handleRelease = async (item: DiscogsItem, owner: number) => {
  const releaseBody = {
    discogsId: item.id,
    title: item.basic_information.title,
    dateAdded: item.date_added,
    resourceUrl: item.basic_information.resource_url,
    coverUrl: item.basic_information.cover_image,
    coverThumbnail: item.basic_information.thumb,
    releaseYear: item.basic_information.year,
    userId: owner,
    masterId: item.basic_information.master_id,
    masterUrl: item.basic_information.master_url,
  };
  try {
    const newRelease = await prisma.releases.upsert({
      where: { discogsId_userId: { discogsId: item.id, userId: owner } },
      update: {},
      create: { ...releaseBody },
    });
    return newRelease;
  } catch (error) {
    handleRaceError(error);
  }
};

const handleArtists = async (item: DiscogsItem, release: releases) => {
  const parsedArtists = item.basic_information.artists?.map((a: any) => {
    return {
      name: a.name,
      discogsId: a.id,
      resourceUrl: a.resource_url,
    };
  });

  parsedArtists?.forEach(async (parsedArtist: any) => {
    try {
      await prisma.artists.upsert({
        where: { discogsId: parsedArtist.discogsId },
        update: {},
        create: {
          discogsId: parsedArtist.discogsId,
          name: parsedArtist.name,
          resourceUrl: parsedArtist.resourceUrl,
        },
      });
    } catch (error) {
      handleRaceError(error);
    }

    const newArtist = await prisma.artists.findUnique({
      where: { discogsId: parsedArtist.discogsId },
    });
    if (newArtist) {
      try {
        await prisma.artists_releases.create({
          data: { artist: newArtist.id, release: release.id },
        });
      } catch (error) {
        handleRaceError(error);
      }
    }
  });
};

const handleLabels = async (item: DiscogsItem, release: releases) => {
  const parsedLabels = item.basic_information.labels?.map((l) => {
    return {
      name: l.name,
      discogsId: l.id,
      resourceUrl: l.resource_url,
    };
  });

  parsedLabels?.forEach(async (parsedLabel) => {
    try {
      await prisma.labels.upsert({
        where: { discogsId: parsedLabel.discogsId },
        update: {},
        create: {
          discogsId: parsedLabel.discogsId,
          name: parsedLabel.name,
          resourceUrl: parsedLabel.resourceUrl,
        },
      });
    } catch (error) {
      handleRaceError(error);
    }

    const newLabel = await prisma.labels.findUnique({
      where: { discogsId: parsedLabel.discogsId },
    });
    if (newLabel) {
      try {
        await prisma.labels_releases.upsert({
          where: {
            release_label: { label: newLabel.id, release: release.id },
          },
          update: {},
          create: { label: newLabel.id, release: release.id },
        });
      } catch (error) {
        handleRaceError(error);
      }
    }
  });
};

const handleStyles = async (item: DiscogsItem, release: releases) => {
  item.basic_information.styles?.forEach(async (s) => {
    try {
      await prisma.styles.upsert({
        where: { name: s },
        update: {},
        create: { name: s },
      });
    } catch (error) {
      handleRaceError(error);
    }

    const newStyle = await prisma.styles.findUnique({
      where: { name: s },
    });
    if (newStyle) {
      try {
        await prisma.styles_releases.upsert({
          where: {
            release_style: { style: newStyle.id, release: release.id },
          },
          update: {},
          create: { style: newStyle.id, release: release.id },
        });
      } catch (error) {
        handleRaceError(error);
      }
    }
  });
};

const handleGenres = async (item: DiscogsItem, release: releases) => {
  item.basic_information.genres?.forEach(async (g) => {
    try {
      await prisma.genres.upsert({
        where: { name: g },
        update: {},
        create: { name: g },
      });
    } catch (error) {
      handleRaceError(error);
    }

    const newGenre = await prisma.genres.findUnique({
      where: { name: g },
    });
    if (newGenre) {
      try {
        await prisma.genres_releases.upsert({
          where: {
            release_genre: { genre: newGenre.id, release: release.id },
          },
          update: {},
          create: { genre: newGenre.id, release: release.id },
        });
      } catch (error) {
        handleRaceError(error);
      }
    }
  });
};

const getCollection = async (req: any, res: Response) => {
  const userReleases = await prisma.releases.findMany({
    where: { userId: req.user.id },
  });
  res.status(200).send({
    userReleases,
  });
};

const getCollectionByYear = async (req: any, res: Response) => {
  const userReleases = await prisma.releases.groupBy({
    by: ["releaseYear"],
    _count: { _all: true },
    orderBy: { releaseYear: "asc" },
  });

  const parsedYears = userReleases
    .map((y) => {
      return { year: y.releaseYear, count: y._count._all };
    })
    .filter((y) => (y.year as number) > 0);

  res.status(200).send({
    parsedYears,
  });
};

// const handleMasterReleaseYear = async (release: releases) => {
//   // fetch master release year if exists
//   if (release.masterUrl) {
//     const master = await fetch(release.masterUrl);
//     const masterData: any = await master.json();
//     await prisma.releases.update({ where: { id: release.id } });
//     masterReleaseYear = masterData.year ? masterData.year : null;
//   }
// };

export default { fetchCollection, getCollection, getCollectionByYear };
