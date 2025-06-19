const express = require("express");
const axios = require("axios");

class AnimeList {
  constructor(node, listStatus) {
    this.node = node; // instance of Anime
    this.listStatus = listStatus; // object containing list status information
  }
  getNode() {
    return this.node;
  }
  getListStatus() {
    return this.listStatus;
  }
}

class AnimeNode {
  constructor(id, title, main_picture, genres, start_date) {
    this.id = id;
    this.title = title;
    this.main_picture = main_picture; // instance of MainPicture
    this.genres = genres; // array of Genres instances
    this.start_date = start_date; // Date object or string
  }

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getMainPicture() {
    return this.main_picture;
  }

  getGenres() {
    return this.genres;
  }

  getStartDate() {
    return this.start_date;
  }
}

class ListStatus {
  constructor(status, score, numEpisodesWatched) {
    this.status = status; // e.g., "completed", "watching", etc.
    this.score = score; // numerical score given by the user
    this.numEpisodesWatched = numEpisodesWatched; // number of episodes watched
  }

  getStatus() {
    return this.status;
  }

  getScore() {
    return this.score;
  }

  getNumEpisodesWatched() {
    return this.numEpisodesWatched;
  }
}

function createAnimeListFromData(data) {
  const animeNode = new AnimeNode(
    data.node.id,
    data.node.title,
    data.node.main_picture,
    data.node.genres, // Assuming genres is an array of objects with a 'name' property
    data.node.start_date
  );
  const listStatus = new ListStatus(
    data.list_status.status,
    data.list_status.score,
    data.list_status.num_episodes_watched
  );
  return new AnimeList(animeNode, listStatus);
}

async function getAnimelistFromUsername(username) {
  const link =
    "https://api.myanimelist.net/v2/users/" +
    username +
    "/animelist?fields=id,title,main_picture,genres,start_date,list_status&status=completed&sort=anime_start_date&limit=1000";
  try {
    const response = await axios.get(link, {
      headers: {
        "X-MAL-CLIENT-ID": "6327aadc75b2312d2d39f557425d4756",
        "Content-Type": "application/json",
      },
    });
    console.log(link);
    // console.log("Response status:", response);

    var userAnimeList = [];
    response.data.data.map((item) => {
      animeListIndex = userAnimeList.push(createAnimeListFromData(item)) - 1;
    });

    // console.log(response.data.data); // JSON data
    return userAnimeList;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

async function getAnimeByStartYearRange(username, startYear, endYear) {
  const userAnimeList = await getAnimelistFromUsername(username);
  return userAnimeList.filter((anime) => {
    const startDate = new Date(anime.getNode().getStartDate());
    const year = startDate.getFullYear();
    return year >= startYear && year <= endYear;
  });
}

async function getTop5MostWatchedGenresAllTime(username) {
  const userAnimeList = await getAnimelistFromUsername(username);
  const genreCount = {};

  userAnimeList.forEach((anime) => {
    anime
      .getNode()
      .getGenres()
      .forEach((genre) => {
        if (genre.name in genreCount) {
          genreCount[genre.name] += 1;
        } else {
          genreCount[genre.name] = 1;
        }
      });
  });

  // Sort genres by count and get the top 5
  const sortedGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return sortedGenres.map(([name, count]) => ({ name, count }));
}

async function getHighestRatedAnimeByYearRange(username, startYear, endYear) {
  let userAnimeList = await getAnimeByStartYearRange(
    username,
    startYear,
    endYear
  );

  let AnimeByYear = [];
  for (let year = startYear; year <= endYear; year++) {
    const animeOfYear = userAnimeList.filter((anime) => {
      const startDate = new Date(anime.getNode().getStartDate());
      return startDate.getFullYear() === year;
    });

    if (animeOfYear.length > 0) {
      AnimeByYear.push(new TopAnimeOfYear(year, animeOfYear));
    }
  }

  let topAnimeByYear = [];
  AnimeByYear.forEach((animeOfYear) => {
    const animeList = animeOfYear.getAnimeList();
    // Find the highest score in this year
    const highestScore = Math.max(
      ...animeList.map((anime) => anime.getListStatus().getScore())
    );
    // Get all anime with the highest score
    const highestRatedAnime = animeList.filter(
      (anime) => anime.getListStatus().getScore() === highestScore
    );
    topAnimeByYear.push({
      year: animeOfYear.getYear(),
      anime: highestRatedAnime,
    });
  });

  return topAnimeByYear;
}

class TopAnimeOfYear {
  constructor(year, anime_list) {
    this.year = year; // Year of the anime
    this.anime_list = anime_list; // Array of AnimeList instances
  }
  getYear() {
    return this.year;
  }
  getAnimeList() {
    return this.anime_list; // Returns an array of AnimeList instances
  }
}

async function getUserProfile(username) {
  const link = "https://api.jikan.moe/v4/users/" + username;
  try {
    const response = await axios.get(link);
    // console.log(link);
    // console.log("Response status:", response);

    const userData = new UserData(
      response.data.data.username,
      response.data.data.url,
      response.data.data.images,
      new Date(response.data.data.joined)
    );

    // console.log(response.data.data); // JSON data
    return userData;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

async function getUserStatistics(username) {
  const link = "https://api.jikan.moe/v4/users/" + username + "/statistics";
  try {
    const response = await axios.get(link);
    // console.log(link);
    // console.log("Response status:", response);

    const userStats = new UserAnimeStatistics(
      response.data.data.anime.days_watched,
      response.data.data.anime.mean_score,
      response.data.data.anime.total_entries
    );

    // console.log(response.data.data); // JSON data
    return userStats;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

async function getAnalyzerResult(username, startYear, endYear) {
  const userData = await getUserProfile(username);
  const userStats = await getUserStatistics(username);
  const top5MostWatchedGenresAllTime = await getTop5MostWatchedGenresAllTime(
    username
  );
  const topAnimeByYear = await getHighestRatedAnimeByYearRange(
    username,
    startYear,
    endYear
  );
  return new AnalyzerResult(
    userData,
    userStats,
    startYear,
    endYear,
    top5MostWatchedGenresAllTime,
    topAnimeByYear
  );
}

class UserAnimeStatistics {
  constructor(days_watched, mean_score, total_entries) {
    this.daysWatched = days_watched; // Total days watched
    this.meanScore = mean_score; // Average score of all anime watched
    this.totalEntries = total_entries; // Total number of anime entries
  }
}
class UserData {
  constructor(username, url, images, joined) {
    this.username = username; // Username of the user
    this.url = url; // URL to the user's profile
    this.images = images; // Object containing images (e.g., avatar)
    this.joined = joined; // Date when the user joined
  }
}

class AnalyzerResult {
  constructor(
    userData,
    userStats,
    startYear,
    endYear,
    top5MostWatchedGenresAllTime,
    topAnimeByYear
  ) {
    this.userData = userData;
    this.userStats = userStats; // instance of UserAnimeStatistics
    this.startYear = startYear;
    this.endYear = endYear;

    this.top5MostWatchedGenresAllTime = top5MostWatchedGenresAllTime;
    this.topAnimeByYear = topAnimeByYear;
  }
}

module.exports = {
  getAnimelistFromUsername,
  getAnimeByStartYearRange,
  getHighestRatedAnimeByYearRange,
  getTop5MostWatchedGenresAllTime,
  getAnalyzerResult,
  TopAnimeOfYear,
};
