const axios = require("axios");
const { Calendar } = require("../models");
require("dotenv").config();

const userId = 612511;
const apiKey = "a3a014ee35f19c7c8ddf42bd1b7972bb";

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    if (str && str !== "time pass always") {
      console.error("JSON Parse Error for string:", str.substring(0, 50));
    }
    return null;
  }
};

const getTithiData = async (
  date,
  day,
  month,
  year,
  min,
  hour,
  latitude,
  longitude,
  timezone,
  language
) => {
  try {
    console.log(`CalendarService [getTithiData] year=${year}, month=${month}`);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    console.log(`CalendarService date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const result = {
      tithi: [],
      festival: [],
      muhurat: [],
    };

    // Bulk check in DB for the whole month (all non-deleted entries)
    const existingEntries = await Calendar.find({
      date: {
        $gte: formatDate(startDate),
        $lte: formatDate(endDate)
      },
      deleteflag: false,
    });

    const dbMap = new Map();
    existingEntries.forEach(e => {
      if (!dbMap.has(e.date)) dbMap.set(e.date, []);
      dbMap.get(e.date).push(e);
    });

    const fetchPromises = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDate(d);
      const dbEntries = dbMap.get(dateStr) || [];

      // Specifically look for the "Tithi" type which contains the API data
      const tithiEntry = dbEntries.find(e => e.type === "Tithi" && (e.heading === "Daily Panchang" || !e.heading));
      const parsedTithiData = tithiEntry ? safeParse(tithiEntry.line) : null;

      // Ensure we have Chaughadiya and API Festivals as well
      const isComplete = parsedTithiData && parsedTithiData.chaughadiya && parsedTithiData.api_festivals;

      // Add manual entries to festivals/muhurats if they exist
      dbEntries.forEach(entry => {
        // Skip the main automated Tithi entry
        if (entry._id.toString() === tithiEntry?._id?.toString()) return;

        if (entry.type === "Festival") {
          result.festival.push({ date: dateStr, value: entry.heading, details: entry.line, timings: entry.timings });
        } else if (entry.type === "Shubh Muhurat") {
          result.muhurat.push({ date: dateStr, value: entry.heading, details: entry.line, timings: entry.timings });
        } else if (entry.heading && entry.heading !== "Daily Panchang") {
          // Any other manual entry with a heading
          result.festival.push({ date: dateStr, value: entry.heading, details: entry.line, type: entry.type || "Special", timings: entry.timings });
        }
      });

      if (isComplete) {
        result.tithi.push({
          date: dateStr,
          value: parsedTithiData,
        });
      } else {
        // Need to fetch Tithi from API
        const payload = {
          day: d.getDate(),
          month: d.getMonth() + 1,
          year: d.getFullYear(),
          hour,
          min,
          lat: latitude,
          lon: longitude,
          tzone: timezone,
        };

        // Fetch both Panchang and Chaughadiya in parallel
        const panchangPromise = axios.post(
          `https://json.astrologyapi.com/v1/advanced_panchang`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${Buffer.from(userId + ":" + apiKey).toString("base64")}`,
              "Accept-Language": language || "en",
            },
          }
        );

        const chaughadiyaPromise = axios.post(
          `https://json.astrologyapi.com/v1/chaughadiya_muhurta`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${Buffer.from(userId + ":" + apiKey).toString("base64")}`,
              "Accept-Language": language || "en",
            },
          }
        );

        const festivalPromise = axios.post(
          `https://json.astrologyapi.com/v1/panchang_festival`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${Buffer.from(userId + ":" + apiKey).toString("base64")}`,
              "Accept-Language": language || "en",
            },
          }
        );

        const promise = Promise.all([panchangPromise, chaughadiyaPromise, festivalPromise]).then(([panchangRes, chaughadiyaRes, festivalRes]) => {
          const combinedData = {
            ...panchangRes.data,
            chaughadiya: chaughadiyaRes.data.chaughadiya,
            api_festivals: festivalRes.data.festivals
          };
          console.log(`AstrologyAPI Response [${dateStr}]: Panchang + Chaughadiya + Festival fetched`);
          return { date: dateStr, data: combinedData };
        })
          .catch(err => {
            console.error(`Error fetching Tithi/Chaughadiya for ${dateStr}:`, err.message);
            return { date: dateStr, data: null };
          });

        fetchPromises.push(promise);
      }
    }

    if (fetchPromises.length > 0) {
      const fetchedResults = await Promise.all(fetchPromises);

      for (const res of fetchedResults) {
        if (res.data) {
          result.tithi.push({
            date: res.date,
            value: res.data,
          });

          // Save to local DB via Mongoose
          await Calendar.updateOne(
            { date: res.date, type: "Tithi" },
            {
              $set: {
                line: JSON.stringify(res.data),
                status: true,
                deleteflag: false,
                heading: "Daily Panchang"
              }
            },
            { upsert: true }
          ).catch(e => console.error("Error saving to DB:", e.message));
        }
      }
    }

    // Sort by date to ensure frontend gets ordered data
    result.tithi.sort((a, b) => a.date.localeCompare(b.date));
    return result;
  } catch (error) {
    console.error("Error in getTithiData:", error);
    throw error;
  }
};

const getTithiDataForDate = async (
  date,
  day,
  month,
  year,
  min,
  hour,
  latitude,
  longitude,
  timezone,
  language
) => {
  try {
    const formattedDate = formatDate(date);

    // Check DB
    const existingEntry = await Calendar.findOne({
      date: formattedDate,
      type: "Tithi",
      deleteflag: false,
    });

    const parsedData = existingEntry ? safeParse(existingEntry.line) : null;
    // Only return from DB if data exists AND it is completely complete (includes both chaughadiya AND api_festivals)
    if (parsedData && parsedData.chaughadiya && parsedData.api_festivals) {
      return {
        source: "db",
        date: formattedDate,
        tithi: parsedData,
      };
    }

    // Fetch from API in parallel
    const [panchangResponse, chaughadiyaResponse, festivalResponse] = await Promise.all([
      axios.post(
        `https://json.astrologyapi.com/v1/advanced_panchang`,
        { day, month, year, hour, min, lat: latitude, lon: longitude, tzone: timezone },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(userId + ":" + apiKey).toString("base64")}`,
            "Accept-Language": language || "en",
          },
        }
      ),
      axios.post(
        `https://json.astrologyapi.com/v1/chaughadiya_muhurta`,
        { day, month, year, hour, min, lat: latitude, lon: longitude, tzone: timezone },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(userId + ":" + apiKey).toString("base64")}`,
            "Accept-Language": language || "en",
          },
        }
      ),
      axios.post(
        `https://json.astrologyapi.com/v1/panchang_festival`,
        { day, month, year, hour, min, lat: latitude, lon: longitude, tzone: timezone },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(userId + ":" + apiKey).toString("base64")}`,
            "Accept-Language": language || "en",
          },
        }
      )
    ]);

    const combinedData = {
      ...panchangResponse.data,
      chaughadiya: chaughadiyaResponse.data.chaughadiya,
      api_festivals: festivalResponse.data.festivals
    };

    console.log(`AstrologyAPI Response [${formattedDate}]: Panchang + Chaughadiya + Festival fetched`);

    if (combinedData) {
      await Calendar.updateOne(
        { date: formattedDate, type: "Tithi" },
        {
          $set: {
            line: JSON.stringify(combinedData),
            status: true,
            deleteflag: false
          }
        },
        { upsert: true }
      );
    }

    return {
      source: "api",
      date: formattedDate,
      tithi: combinedData,
    };
  } catch (error) {
    console.error("Error in getTithiDataForDate:", error);
    throw error;
  }
};

module.exports = {
  getTithiData,
  getTithiDataForDate,
};
