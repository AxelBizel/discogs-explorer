import db from "../models/index.js";
import discogsConfig from "../config/discogs.config.js";
import discogsClient from "disconnect";
const Discogs = discogsClient.Client;

const {
  user: User,
  release: Release,
  artist: Artist,
  artists_releases: Artists_Releases,
  label: Label,
  labels_releases: Labels_Releases,
  style: Style,
  styles_releases: Styles_Releases,
  genre: Genre,
  genres_releases: Genres_Releases,
} = db;
const discogs = new Discogs(discogsConfig).user().collection();
const paginationNumber = 50;

const getItemsNumber = async (user) => {
  const rawItems = await discogs.getReleases(user, 0, {
    page: 1,
    per_page: 1,
  });
  return rawItems.pagination.pages;
};

const getCollection = async (req, res) => {
  // get user id and username from access token
  const owner = await User.findByPk(req.userId);
  // get collection length and pages
  const itemNumber = await getItemsNumber(owner.username);
  const pages = Math.ceil(itemNumber / paginationNumber);
  // fetch collection
  const collection = [];
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
  // const collection = rawCollection.releases;

  res.status(200).send({
    collection,
  });
  //store data in database
  return storeItems(collection, owner.id);
};

const storeItems = (collection, owner) => {
  collection.forEach(async (item) => {
    const newRelease = await handleRelease(item, owner);
    await handleArtists(item, newRelease);
    await handleLabels(item, newRelease);
    await handleGenres(item, newRelease);
    await handleStyles(item, newRelease);
  });
};

const handleRelease = async (item, owner) => {
  const releaseBody = {
    discogsId: item.id,
    title: item.basic_information.title,
    dateAdded: item.date_added,
    resource_url: item.basic_information.resource_url,
    cover_url: item.basic_information.cover_image,
    cover_thumbnail: item.basic_information.thumb,
    release_year: item.basic_information.year,
    userId: owner,
  };
  const newRelease = await Release.create(releaseBody);
  return newRelease;
};

const handleArtists = async (item, release) => {
  const parsedArtists = item.basic_information.artists?.map((a) => {
    return {
      name: a.name,
      discogsId: a.id,
      resource_url: a.resource_url,
    };
  });

  parsedArtists?.forEach(async (parsedArtist) => {
    await Artist.findOrCreate({
      where: { discogsId: parsedArtist.discogsId },
      defaults: {
        name: parsedArtist.name,
        resource_url: parsedArtist.resource_url,
      },
    });
    const newArtist = await Artist.findOne({
      where: { discogsId: parsedArtist.discogsId },
    });
    if (newArtist) {
      try {
        await newArtist.addRelease(release, {
          through: Artists_Releases,
        });
      } catch (error) {
        console.log("error artist addRelease", error);
      }
    }
  });
};

const handleLabels = async (item, release) => {
  const parsedLabels = item.basic_information.labels?.map((l) => {
    return {
      name: l.name,
      discogsId: l.id,
      resource_url: l.resource_url,
    };
  });

  parsedLabels?.forEach(async (parsedLabel) => {
    await Label.findOrCreate({
      where: { discogsId: parsedLabel.discogsId },
      defaults: {
        name: parsedLabel.name,
        resource_url: parsedLabel.resource_url,
      },
    });
    const newLabel = await Label.findOne({
      where: { discogsId: parsedLabel.discogsId },
    });
    if (newLabel) {
      try {
        await newLabel.addRelease(release, {
          through: Labels_Releases,
        });
      } catch (error) {
        console.log("error label add release", error);
      }
    }
  });
};

const handleStyles = async (item, release) => {
  item.basic_information.styles?.forEach(async (s) => {
    await Style.findOrCreate({
      where: { name: s },
    });
    const newStyle = await Style.findOne({
      where: { name: s },
    });
    if (newStyle) {
      try {
        await newStyle.addRelease(release, {
          through: Styles_Releases,
        });
      } catch (error) {
        console.log("error style addRelease", error);
      }
    }
  });
};

const handleGenres = async (item, release) => {
  item.basic_information.genres?.forEach(async (g) => {
    await Genre.findOrCreate({
      where: { name: g },
    });
    const newGenre = await Genre.findOne({
      where: { name: g },
    });
    if (newGenre) {
      try {
        await newGenre.addRelease(release, {
          through: Genres_Releases,
        });
      } catch (error) {
        console.log("error genre addRelease", error);
      }
    }
  });
};

export default { getCollection };
