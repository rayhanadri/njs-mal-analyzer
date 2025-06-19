NJS MAL Analyzer is a backend API built to summarize and analyze MyAnimeList user data. It provides structured insights into a user's anime-watching habits, including:

👤 User profile information

📈 Watching statistics

🎭 Most-watched genres

🏆 Top anime from the last 10 years

Ideal for anime dashboards, MAL analytics tools, or personal watch history summaries.

Note: this API uses MAL Official API and Jikan API

---

## 📦 Prerequisites to Host Your Own API
- NodeJS

---
### 🌐 Live Endpoint URL

https://njs-mal-analyzer-67960749090.asia-southeast2.run.app/analyzer

---
## 📡 Endpoint

| Method | Endpoint           | Description                                                             |
|--------|--------------------|-------------------------------------------------------------------------|
| POST   | `/analyzer`       | Analyze a MyAnimeList user's data and return summarized insights.       |

Request Body Example:
```bash
{
    "username" : "Eru_Ikusu"
}
```

Response Success Example:
```bash
{
    "userData": {
        "username": "Eru_Ikusu",
        "url": "https://myanimelist.net/profile/Eru_Ikusu",
        "images": {
            "jpg": {
                "image_url": "https://cdn.myanimelist.net/s/common/userimages/06f83680-9858-43b0-bc8c-e3499bb4c43b_225w?s=e70c557ab5653024358527f76f68e1ed"
            },
            "webp": {
                "image_url": "https://cdn.myanimelist.net/s/common/userimages/06f83680-9858-43b0-bc8c-e3499bb4c43b_225w?s=e70c557ab5653024358527f76f68e1ed"
            }
        },
        "joined": "2012-10-07T00:00:00.000Z"
    },
    "userStats": {
        "daysWatched": 192.4,
        "meanScore": 7.21,
        "totalEntries": 737
    },
    "startYear": 2015,
    "endYear": 2025,
    "top5MostWatchedGenresAllTime": [
        {
            "name": "Action",
            "count": 250
        },
        {
            "name": "Comedy",
            "count": 234
        },
        {
            "name": "Fantasy",
            "count": 212
        },
        {
            "name": "School",
            "count": 199
        },
        {
            "name": "Romance",
            "count": 161
        }
    ],
    "topAnimeByYear": [
        {
            "year": 2015,
            "anime": [
                {
                    "node": {
                        "id": 28999,
                        "title": "Charlotte",
                        "main_picture": {
                            "medium": "https://cdn.myanimelist.net/images/anime/1826/147276.jpg",
                            "large": "https://cdn.myanimelist.net/images/anime/1826/147276l.jpg"
                        },
                        "genres": [
                            {
                                "id": 8,
                                "name": "Drama"
                            },
                            {
                                "id": 23,
                                "name": "School"
                            },
                            {
                                "id": 31,
                                "name": "Super Power"
                            }
                        ],
                        "start_date": "2015-07-05"
                    },
                    "listStatus": {
                        "status": "completed",
                        "score": 10,
                        "numEpisodesWatched": 13
                    }
                },
                {
                    "node": {
                        "id": 28701,
                        "title": "Fate/stay night: Unlimited Blade Works 2nd Season",
                        "main_picture": {
                            "medium": "https://cdn.myanimelist.net/images/anime/1881/124810.jpg",
                            "large": "https://cdn.myanimelist.net/images/anime/1881/124810l.jpg"
                        },
                        "genres": [
                            {
                                "id": 1,
                                "name": "Action"
                            },
                            {
                                "id": 10,
                                "name": "Fantasy"
                            },
                            {
                                "id": 82,
                                "name": "Urban Fantasy"
                            }
                        ],
                        "start_date": "2015-04-05"
                    },
                    "listStatus": {
                        "status": "completed",
                        "score": 10,
                        "numEpisodesWatched": 13
                    }
                },
                {
                    "node": {
                        "id": 23277,
                        "title": "Saenai Heroine no Sodatekata",
                        "main_picture": {
                            "medium": "https://cdn.myanimelist.net/images/anime/1329/142757.jpg",
                            "large": "https://cdn.myanimelist.net/images/anime/1329/142757l.jpg"
                        },
                        "genres": [
                            {
                                "id": 4,
                                "name": "Comedy"
                            },
                            {
                                "id": 9,
                                "name": "Ecchi"
                            },
                            {
                                "id": 35,
                                "name": "Harem"
                            },
                            {
                                "id": 69,
                                "name": "Otaku Culture"
                            },
                            {
                                "id": 22,
                                "name": "Romance"
                            },
                            {
                                "id": 23,
                                "name": "School"
                            }
                        ],
                        "start_date": "2015-01-16"
                    },
                    "listStatus": {
                        "status": "completed",
                        "score": 10,
                        "numEpisodesWatched": 12
                    }
                }
            ]
        },
        ...
            ]
        }
    ]
}
```

Response Failed Example:
```bash
{
    "error": "Internal server error"
}
```

