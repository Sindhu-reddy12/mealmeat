/**
 * localStore.js — File-based JSON fallback for User and Meal data.
 * Used automatically when MongoDB is not connected.
 * Data is persisted to server/data/users.json and server/data/meals.json
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON(file) {
  ensureDir();
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(fp)) return [];
  try {
    return JSON.parse(fs.readFileSync(fp, "utf8"));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── Users ─────────────────────────────────────────────────────────────────
const Users = {
  findOne: (query) => {
    const users = readJSON("users.json");
    if (query.email) return users.find((u) => u.email === query.email) || null;
    if (query._id) return users.find((u) => u._id === query._id) || null;
    return null;
  },
  findById: (id) => {
    const users = readJSON("users.json");
    return users.find((u) => u._id === id) || null;
  },
  create: (data) => {
    const users = readJSON("users.json");
    const user = {
      _id: newId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(user);
    writeJSON("users.json", users);
    return user;
  },
};

// ── Meals ─────────────────────────────────────────────────────────────────
const Meals = {
  create: (data) => {
    const meals = readJSON("meals.json");
    const meal = {
      _id: newId(),
      ...data,
      userId: data.userId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    meals.push(meal);
    writeJSON("meals.json", meals);
    return meal;
  },
  find: (query, opts = {}) => {
    let meals = readJSON("meals.json");
    if (query.userId) meals = meals.filter((m) => m.userId === query.userId.toString());
    if (query.createdAt) {
      const { $gte, $lte } = query.createdAt;
      if ($gte) meals = meals.filter((m) => new Date(m.createdAt) >= new Date($gte));
      if ($lte) meals = meals.filter((m) => new Date(m.createdAt) <= new Date($lte));
    }
    // sort desc by default
    meals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (opts.limit) meals = meals.slice(0, opts.limit);
    return meals;
  },
};

module.exports = { Users, Meals };
