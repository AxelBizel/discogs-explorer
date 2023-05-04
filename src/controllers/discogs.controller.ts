import discogsConfig from "../config/discogs.config.js";
import { Response } from "express";
import prisma from "../../prisma/prisma.js";
import discogsClient from "disconnect";
import { releases } from "@prisma/client";
// import fetch from "node-fetch";

const discogs = new discogsClient.Client(discogsConfig).user().collection();
const paginationNumber = 100;

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

let lastDiscogsPageFetched: number = 1;

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

const discogsCollectionQuery = async (
  owner: { username: string; id: number },
  pages: number,
  firstPage: number
): Promise<{
  status: string;
  error: any | null;
}> => {
  for (let i = firstPage; i <= pages; i++) {
    try {
      const rawCollection = await discogs.getReleases(owner.username, 0, {
        page: `${i}`,
        per_page: paginationNumber,
      });
      const fetchedReleases: DiscogsItem[] = rawCollection.releases;
      storeItems(fetchedReleases, owner.id);
    } catch (error) {
      lastDiscogsPageFetched = i;
      return { status: "error", error: error };
    }
  }

  return {
    status: "success",
    error: null,
  };
};

const fetchCollection = async (req: any, res: Response) => {
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

  // fetch pagination and items number and send to client
  const itemNumber = await getItemsNumber(owner.username);
  const pages = Math.ceil(itemNumber / paginationNumber);
  res.status(200).send({
    itemNumber,
  });

  // fetch and store releases in database
  const collectionRes = await discogsCollectionQuery(
    owner,
    pages,
    lastDiscogsPageFetched
  );
  if (
    collectionRes.status === "error" &&
    collectionRes.error.statusCode === 429
  ) {
    const retryInterval = setInterval(async () => {
      console.log("retry");
      const collectionRetry = await discogsCollectionQuery(
        owner,
        pages,
        lastDiscogsPageFetched
      );
      console.log("COL RETRY RES", collectionRetry);
      if (collectionRetry.status === "success") {
        clearInterval(retryInterval);
      }
    }, 5000);
  }
  return;
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

const countByReleaseYears = async (req: any, res: Response) => {
  try {
    const releasesGroupedByYears = await prisma.releases.groupBy({
      by: ["releaseYear"],
      _count: { _all: true },
      orderBy: { releaseYear: "asc" },
      where: { userId: req.user.id },
    });

    const parsedYears = releasesGroupedByYears
      .map((y) => {
        return { year: y.releaseYear, count: y._count._all };
      })
      .filter((y) => (y.year as number) > 0);

    res.status(200).send({
      parsedYears,
    });
  } catch (error) {
    res.status(error.code).send({
      message: error.message,
    });
  }
  return;
};

const countByArtists = async (req: any, res: Response) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT count(release)::int as nb, a.name from artists_releases ar
        inner join artists a on ar.artist = a.id
        inner join releases r on ar.release = r.id
        where r."userId" = ${req.user.id}
        group by a.name
        order by nb desc`;

    res.status(200).send({
      result,
    });
  } catch (error) {
    res.status(error.code).send({
      message: error.message,
    });
  }
  return;
};

const countByLabels = async (req: any, res: Response) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT count(release)::int as nb, l.name from labels_releases lr
        inner join labels l on lr.label = l.id
        inner join releases r on lr.release = r.id
        where r."userId" =  ${req.user.id}
        group by l.name
	      order by nb desc`;

    res.status(200).send({
      result,
    });
  } catch (error) {
    res.status(error.code).send({
      message: error.message,
    });
  }
  return;
};

const countByStyles = async (req: any, res: Response) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT count(release)::int as nb, s.name from styles_releases sr
        inner join styles s on sr.style = s.id
        inner join releases r on sr.release = r.id
        where r."userId" = ${req.user.id}
        group by s.name
	      order by nb desc`;

    res.status(200).send({
      result,
    });
  } catch (error) {
    res.status(error.code).send({
      message: error.message,
    });
  }
  return;
};

const countByGenres = async (req: any, res: Response) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT count(release)::int as nb, g.name from genres_releases gr
        inner join genres g on gr.genre = g.id
        inner join releases r on gr.release = r.id
        where r."userId" = ${req.user.id}
        group by g.name
	      order by nb desc`;

    res.status(200).send({
      result,
    });
  } catch (error) {
    res.status(error.code).send({
      message: error.message,
    });
  }
  return;
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

export default {
  fetchCollection,
  getCollection,
  countByReleaseYears,
  countByArtists,
  countByGenres,
  countByLabels,
  countByStyles,
};
